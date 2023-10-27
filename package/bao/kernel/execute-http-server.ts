import { createId } from "@paralleldrive/cuid2";
import { _afterHTTPRequestMiddlewares, _beforeHTTPResponseMiddlewares, configFramework } from "..";
import { SuperJSON } from "superjson";
import schema from "../../../src/../generate/schema";
import { logger } from "../../../src/logger";
import { failCode } from "../../../src/fail-code";
import type { HTTPRequest, HTTPResponse } from "..";
import { hanldeCatchError } from "../util/handle-catch-error";
import { _execute } from "./execute";

export async function _executeHttpServer() {
  process.on("uncaughtException", (error) => {
    logger.error("Error caught in uncaughtException event:");
    logger.error(error);
  });

  const server = Bun.serve({
    port: configFramework.port,
    async fetch(request: HTTPRequest) {
      const fullurl = new URL(request.url, `http://${request.headers.get("host") ?? "localhost"}`);
      const contextid = (request.headers.get("x-scf-request-id") as string) ?? createId();
      const ip = (request.headers.get("x-forwarded-for") as string | undefined)?.split(",")[0] ?? "0.0.0.0";
      const headers = request.headers;

      logger.log(`\n🧊 --- Request In ---\n🧊 - Method: ${request.method}\n🧊 - ContextId: ${contextid}\n🧊 - URL: ${fullurl.pathname}\n🧊 - Headers: ${JSON.stringify(request.headers.toJSON())}`);

      const response: HTTPResponse = {
        body: "",
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Methods": configFramework.corsAllowMethods ?? "*",
          "Access-Control-Allow-Headers": configFramework.corsAllowHeaders ?? "*",
          "Access-Control-Allow-Origin": configFramework.corsAllowOrigin ?? "*"
        }
      };

      try {
        // Process OPTIONS pre inspection requests
        if (request.method === "OPTIONS") {
          return new Response("", {
            headers: {
              "Access-Control-Allow-Methods": configFramework.corsAllowMethods ?? "*",
              "Access-Control-Allow-Headers": configFramework.corsAllowHeaders ?? "*",
              "Access-Control-Allow-Origin": configFramework.corsAllowOrigin ?? "*"
            }
          });
        }

        let path = fullurl.pathname.substring(1).split("/");

        // Compatible with API gateway's ability to differentiate versions by path
        // see: /src/config/ConfigProgram.ts in "ignorePathLevel"
        if (configFramework.ignorePathLevel !== 0) path = path.slice(configFramework.ignorePathLevel);

        const pathstr = path.join("/") as keyof (typeof schema)["apiMethodsSchema"];

        const detail = {
          path: pathstr,
          ip,
          contextid,
          fullurl,
          request,
          response
        };

        // Special processing: do not run middleware when encountering 404 and return quickly
        if (!(pathstr in schema.apiParams.params)) {
          const rawbody = await request.text();
          logger.log(`🧊 --- Request Body ---\n${rawbody || "no body"}`);
          logger.log("🧊 --- Execute ---");
          response.body = SuperJSON.stringify({
            success: false,
            fail: {
              code: "not-found",
              message: failCode["not-found"](),
              data: undefined
            }
          });

          logger.log("done.");
          logger.log(`\n🧊 --- Response Info ---\n🧊 - Code: ${response.status}\n🧊 - Headers: ${JSON.stringify(response.headers)}\n`);
          logger.log(`🧊 --- Response Body ---\n${response.body || "no body"}`);
          logger.log("🧊 --- Response Out ---\n");

          return new Response(response.body, response);
        }

        // Execute api
        // after request middleware
        for (const m of _afterHTTPRequestMiddlewares) {
          await m.middleware(headers, detail);
        }

        const rawbody = await request.text();
        logger.log(`🧊 --- Request Body ---\n${rawbody || "no body"}`);
        logger.log("🧊 --- Request Begin ---");

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let params: any;
        if (rawbody === "") {
          params = undefined;
        } else if (rawbody.startsWith('{"json":{')) {
          params = SuperJSON.parse(rawbody);
        } else {
          try {
            params = JSON.parse(rawbody);
          } catch (error) {
            // body is not json, the content is not empty, but the content is not in a valid JSON or SuperJSON format. The original content value can be retrieved via request.text()
            logger.log("TIP: body is not json, the content is not empty, but the content is not in a valid JSON or SuperJSON format. The original content value can be retrieved via request.text()");
            params = undefined;
          }
        }

        const result = await _execute(pathstr, params, headers, {
          contextId: contextid,
          detail
        });

        if (response.body === "") {
          response.body = response.body + SuperJSON.stringify(result);
        } else if (response.body === undefined || response.body === null) {
          response.body = "";
        }

        // before response middleware
        const middlewareResponse = {
          value: response.body
        };
        for (const m of _beforeHTTPResponseMiddlewares) {
          await m.middleware(middlewareResponse, detail);
        }

        response.body = middlewareResponse.value;
      } catch (error) {
        const result = hanldeCatchError(error);
        response.body = SuperJSON.stringify(result);
      }

      logger.log(`🧊 --- Response Info ---\n🧊 - Code: ${response.status}\n🧊 - Headers: ${JSON.stringify(response.headers)}\n`);
      logger.log(`🧊 --- Response Body ---\n${response.body || "no body"}`);
      logger.log("🧊 --- Response Out ---\n");

      return new Response(response.body, response);
    }
  });

  logger.log(`🧊 Http server started at :${configFramework.port}`);

  return {
    server,
    stop: server.stop
  };
}

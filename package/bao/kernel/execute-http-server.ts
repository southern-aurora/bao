import { createId } from "@paralleldrive/cuid2";
import { _afterHTTPRequestMiddlewares, _beforeHTTPResponseMiddlewares, configFramework, loggerPushTags, loggerSubmit, useLogger, loggerSubmitAll, runtime } from "..";
import { SuperJSON } from "superjson";
import schema from "../../../src/../generate/api-schema";
import { failCode } from "../../../src/fail-code";
import type { ExecuteId, HTTPRequest, HTTPResponse } from "..";
import { hanldeCatchError } from "../util/handle-catch-error";
import { _execute } from "./execute";
import process, { exit } from "node:process";

export async function _executeHttpServer() {
  // If an unexpected error occurs, exit the process.
  // For modern production environments such as Serverless, Kubernetes, or Docker Compose:
  // The process will automatically restart after exiting.
  // This helps prevent unexpected errors from contaminating the entire application and causing subsequent requests to fail intermittently.
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  process.on("uncaughtException", async (error) => {
    const logger = useLogger("global");
    logger.error("Error caught in uncaughtException event:", error);
    await loggerSubmitAll();
    exit(1);
  });

  const server = Bun.serve({
    port: configFramework.port,
    async fetch(request: HTTPRequest) {
      const fullurl = new URL(request.url, `http://${request.headers.get("host") ?? "localhost"}`);
      const executeId = `exec#${createId()}` as ExecuteId;
      runtime.httpServer.executeIds.add(executeId);
      const ip = (request.headers.get("x-forwarded-for") as string | undefined)?.split(",")[0] ?? "0.0.0.0";
      const headers = request.headers;

      loggerPushTags(executeId, {
        from: "http-server",
        url: fullurl.pathname,
        ip,
        method: request.method,
        requestHeaders: request.headers.toJSON(),
        timein: new Date().getDate()
      });

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
          await loggerSubmit(executeId);
          runtime.httpServer.executeIds.delete(executeId);

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
          executeId,
          fullurl,
          request,
          response
        };

        // Special processing: do not run middleware when encountering 404 and return quickly
        if (!(pathstr in schema.apiParams.params)) {
          const rawbody = await request.text();
          loggerPushTags(executeId, {
            body: rawbody || "no body"
          });
          response.body = SuperJSON.stringify({
            executeId,
            success: false,
            fail: {
              code: "not-found",
              message: failCode["not-found"](),
              data: undefined
            }
          });

          loggerPushTags(executeId, {
            status: response.status,
            responseHeaders: response.headers,
            timeout: new Date().getTime()
          });

          await loggerSubmit(executeId);
          runtime.httpServer.executeIds.delete(executeId);

          return new Response(response.body, response);
        }

        // Execute api
        // after request middleware
        for (const m of _afterHTTPRequestMiddlewares) {
          await m.middleware(headers, detail);
        }

        const rawbody = await request.text();
        loggerPushTags(executeId, {
          body: rawbody || "no body"
        });

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
            const logger = useLogger(executeId);
            // body is not json, the content is not empty, but the content is not in a valid JSON or SuperJSON format. The original content value can be retrieved via request.text()
            logger.log("TIP: body is not json, the content is not empty, but the content is not in a valid JSON or SuperJSON format. The original content value can be retrieved via request.text()");
            params = undefined;
          }
        }

        loggerPushTags(executeId, {
          params
        });

        const result = await _execute(pathstr, params, headers, {
          executeId,
          detail,
          disableLoggerAutoSubmit: true
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
        const result = hanldeCatchError(error, executeId);
        response.body = SuperJSON.stringify(result);
      }

      loggerPushTags(executeId, {
        status: response.status,
        responseHeaders: response.headers,
        body: response.body || "no body",
        timeout: new Date().getTime()
      });

      await loggerSubmit(executeId);
      runtime.httpServer.executeIds.delete(executeId);

      return new Response(response.body, response);
    }
  });

  // eslint-disable-next-line no-console
  console.log(`🧊 Http server started at :`, configFramework.port);

  return {
    server,
    stop: server.stop
  };
}

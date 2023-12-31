/* eslint-disable @typescript-eslint/no-explicit-any */
import { createId } from "@paralleldrive/cuid2";
import schema from "../../../src/../generate/api-schema";
import type { Context } from "../../../src/context";
import { failCode } from "../../../src/fail-code";
import type { FrameworkContext } from "../kernel/context";
import { _afterExecuteMiddlewares, _beforeExecuteMiddlewares } from "../kernel/middleware";
import { type ExecuteId, type Fail, type FailEnumerates, loggerPushTags, loggerSubmit, runtime } from "..";
import { hanldeCatchError } from "../util/handle-catch-error";
import { _validate } from "./validate";

export async function _execute<Path extends keyof (typeof schema)["apiMethodsTypeSchema"], Result extends Awaited<ReturnType<(typeof schema)["apiMethodsTypeSchema"][Path]["action"]>>>(path: Path, params: Parameters<(typeof schema)["apiMethodsTypeSchema"][Path]["action"]>[0] | string, headersInit: Record<string, string> | Headers = {}, options?: ExecuteApiOptions): Promise<ExecuteResult<Result>> {
  const executeId = (options?.executeId ?? `exec#${createId()}`) as ExecuteId;
  runtime.execute.executeIds.add(executeId);

  if (options?.disableLoggerAutoSubmit !== true) {
    loggerPushTags(executeId, {
      from: "execute",
      executeId,
      params,
      path
    });
  }

  if (!(path in schema.apiParams.params)) {
    const result = {
      executeId,
      success: false,
      fail: {
        code: "not-found",
        message: failCode["not-found"](),
        data: undefined
      }
    } satisfies ExecuteResult<Result>;

    if (options?.disableLoggerAutoSubmit !== true) await loggerSubmit(executeId);
    runtime.execute.executeIds.delete(executeId);

    return result;
  }

  let headers: Headers;
  if (!(headersInit instanceof Headers)) {
    headers = new Headers({
      ...headersInit
    });
  } else {
    headers = headersInit;
  }

  if (options?.disableLoggerAutoSubmit !== true) {
    loggerPushTags(executeId, {
      headers: headers.toJSON()
    });
  }

  const context: Context = {
    executeId,
    path,
    headers,
    detail: options?.detail
  };

  let result: { value: Result };
  try {
    // before execute middleware
    for (const m of _beforeExecuteMiddlewares) {
      await m.middleware(context);
    }

    // check type

    _validate(await schema.apiParams.params[path](params));

    // Execute api
    const api = schema.apiMethodsSchema[path]();
    const apiModuleAwaited = await api.module;
    // @ts-ignore
    const apiMethod = apiModuleAwaited[api.method].action;

    result = { value: await apiMethod(params, context) };

    // after execute middleware
    for (const m of _afterExecuteMiddlewares) {
      await m.middleware(context, result);
    }
  } catch (error: any) {
    const errorResult = hanldeCatchError(error, executeId);

    if (options?.disableLoggerAutoSubmit !== true) await loggerSubmit(executeId);
    runtime.execute.executeIds.delete(executeId);

    return errorResult;
  }

  if (options?.disableLoggerAutoSubmit !== true) {
    loggerPushTags(executeId, {
      success: true,
      result: result.value
    });
  }

  if (options?.disableLoggerAutoSubmit !== true) await loggerSubmit(executeId);
  runtime.execute.executeIds.delete(executeId);

  return {
    executeId,
    success: true,
    data: result.value
  };
}

export type ExecuteResult<Result> =
  | {
      executeId: ExecuteId;
      success: true;
      data: Result;
    }
  | {
      executeId: ExecuteId;
      success: false;
      fail: Fail<keyof FailEnumerates>;
    };

export type ExecuteApiOptions = {
  /**
   * The executeId of the request
   * executeId may be generated by the serverless provider, if not, a random string will be generated instead
   */
  executeId?: string;
  /**
   * Automatically submit the result to the server
   * If not set, the result will not be submitted
   */
  disableLoggerAutoSubmit?: boolean;
  /**
   * Additional information about the request
   * These are usually only fully implemented when called by an HTTP server
   * During testing or when calling between microservices, some or all of the values may be undefined
   */
  detail?: FrameworkContext["detail"];
};

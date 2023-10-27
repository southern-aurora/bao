import type { ExecuteResult } from "../kernel/execute";
import { logger } from "../../../src/logger";
import { failCode } from "../../../src/fail-code";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function hanldeCatchError(error: any): ExecuteResult<any> {
  if (error.stack) logger.error(error.stack);
  logger.error("\nError Data: " + JSON.stringify(error));

  // If it is not FailError, it is considered an internal server error that should not be exposed
  if (error.name !== "FailError") {
    return {
      success: false,
      fail: {
        code: "internal-server-error",
        message: failCode["internal-server-error"](),
        data: undefined
      }
    };
  }

  return {
    success: false,
    fail: {
      code: error.code,
      message: error.message,
      data: error.data
    }
  };
}

import type { ExecuteResult } from "../kernel/execute";
import { logger } from "../../../src/logger";
import { failCode } from "../../../src/fail-code";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function hanldeCatchError(error: any): ExecuteResult<any> {
  if (error.stack) logger.error(error.stack);
  else logger.error(error);
  logger.error("\nError Data: " + JSON.stringify(error));

  if (error.name !== "FailError") {
    // If it is not FailError, it is considered an internal server error that should not be exposed
    logger.error(`FailCode: internal-server-error`);
    return {
      success: false,
      fail: {
        code: "internal-server-error",
        message: failCode["internal-server-error"](),
        data: undefined
      }
    };
  } else {
    logger.error(`FailCode: ${error.code}`);
    return {
      success: false,
      fail: {
        code: error.code,
        message: error.message,
        data: error.data
      }
    };
  }
}

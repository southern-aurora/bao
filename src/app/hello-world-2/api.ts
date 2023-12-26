import { defineApi, defineFail, useLogger } from "southern-aurora-bao";

export const say = defineApi({
  meta: {
    //
  },
  action(
    params: {
      by?: string;
    },
    context
  ) {
    const message = `hello world! (by ${params.by})`;

    const logger = useLogger(context.executeId);
    logger.debug("你好你好你好");

    if (!params.by) {
      throw defineFail("business-fail", 'You need to include "by" in data.');
    }

    return {
      youSay: message
    };
  }
});

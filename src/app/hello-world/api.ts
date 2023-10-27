import { defineApi, defineFail } from "southern-aurora-bao";

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

    if (!params.by) {
      throw defineFail("business-fail", 'You need to include "by" in data.');
    }

    return {
      youSay: message
    };
  }
});

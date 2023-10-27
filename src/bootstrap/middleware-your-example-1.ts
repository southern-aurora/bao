/* eslint-disable no-console */
import { defineFail, useMeta, useMiddleware } from "southern-aurora-bao";

export default function () {
  const middleware1 = useMiddleware(1);
  middleware1.onBeforeExecute(async () => {
    console.log("onBeforeExecute 1");
  });
  middleware1.onAfterExecute(async () => {
    console.log("onAfterExecute 1");
  });

  const middleware2 = useMiddleware(2);
  middleware2.onBeforeExecute(async () => {
    console.log("onBeforeExecute 2");
  });
  middleware2.onAfterExecute(async () => {
    console.log("onAfterExecute 2");
  });
}

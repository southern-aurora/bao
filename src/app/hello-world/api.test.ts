import { test } from "bun:test";
import { createClient } from "client";
import { testBaseUrl, testStorage } from "../../test";

test("app/ping", async () => {
  const client = createClient({
    url: testBaseUrl,
    storage: testStorage
  });
  const result = await client.execute("hello-world/say", {
    by: "southern-aurora-bao"
  });

  if (!result.success) throw result;
});

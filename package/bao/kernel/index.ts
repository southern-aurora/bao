import { configFramework } from "..";
import schema from "../../../src/../generate/bootstrap-schema";
import { _sortMiddleware } from "./middleware";
import type { _executeHttpServer } from "./execute-http-server";
import { _execute } from "./execute";

export async function createBaoApp() {
  // eslint-disable-next-line no-console
  console.log(`🧊 Framework starting on "${configFramework.cwd}"`);

  const bootstraps: Array<Promise<void>> = [];
  for (const bootstrapName in schema.bootstrapSchema) {
    // @ts-ignore
    const bootstrapFunction = schema.bootstrapSchema[bootstrapName];
    bootstraps.push(bootstrapFunction());
  }
  await Promise.all(bootstraps);

  await _sortMiddleware();

  return {
    execute: _execute,
    // This method will only be loaded when used, because for some serverless environments, this method will never be used
    executeHttpServer: async (...args: Parameters<typeof _executeHttpServer>) => {
      return await (await import("./execute-http-server"))._executeHttpServer(...args);
    }
  };
}

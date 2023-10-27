import { beforeAll } from "bun:test";

beforeAll(async () => {
  // Before all the test starts, load Index.TS and start the HTTP server for testing and use
  await import("../index");
});

export const testBaseUrl = "http://127.0.0.1:9000/";

const storage = new Map<string, string>();

export const testStorage = {
  getItem(key: string) {
    return storage.get(key) ?? null;
  },
  setItem(key: string, value: string) {
    storage.set(key, value);
  }
};

import SuperJSON from "superjson";
import type schema from "../../generate/schema";
import { failCode } from "../../src/fail-code";

export function createClient(clientOptions: ClientOptions) {
  const execute = async <Path extends keyof Schema["apiMethodsTypeSchema"]>(path: Path, data: Parameters<Schema["apiMethodsTypeSchema"][Path]["action"]>[0] | string, headers: Record<string, string | Array<string> | undefined> = {}): Promise<ExecuteResult<Path>> => {
    const request = new Request(`${clientOptions.url}${path}`, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        ...headers
      }),
      body: SuperJSON.stringify(data)
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result: any;
    try {
      console.warn(request);

      const response = await fetch(request);
      result = SuperJSON.parse(await response.text());
    } catch (e) {
      console.warn("[client] 请求失败，可能是网络原因", e);
      result = {
        success: false,
        fail: {
          code: "network-error",
          message: failCode["network-error"](),
          data: undefined
        }
      };
    }

    return result;
  };

  return {
    execute
  };
}

type ClientOptions = {
  url: string;
  storage: StorageLike;
};

type StorageLike = {
  getItem(key: string): string | null | Promise<string | null | undefined | "">;
  setItem(key: string, value: string): void | Promise<void>;
};

export type ExecuteResult<Path extends keyof Schema["apiMethodsTypeSchema"]> =
  | {
      success: true;
      data: Awaited<ReturnType<Schema["apiMethodsTypeSchema"][Path]["action"]>>;
    }
  | {
      success: false;
      fail: Fail<keyof typeof failCode>;
    };

export type Fail<FailCode extends keyof typeof failCode> = {
  code: FailCode;
  message: string;
  data: Parameters<(typeof failCode)[FailCode]>[0];
};

export type Schema = typeof schema;

export const FailCode = failCode;

import type { failCode } from "../../src/fail-code";

export type FailEnumerates = typeof failCode;

export type HTTPRequest = Request;

export type HTTPResponse = Override<ResponseInit & { body: string | null | undefined }, { headers: NonNullable<ResponseInit["headers"]> }>;

export type Fail<FailCode extends keyof FailEnumerates> = {
  code: FailCode;
  message: string;
  data: Parameters<FailEnumerates[FailCode]>[0];
};

export type DatabaseType<Table extends { findFirst: () => unknown }> = NonNullable<Awaited<ReturnType<Table["findFirst"]>>>;

export type Override<P, S> = Omit<P, keyof S> & S;

export type Logger = {
  debug: (...args: Array<unknown>) => void;
  log: (...args: Array<unknown>) => void;
  warn: (...args: Array<unknown>) => void;
  error: (...args: Array<unknown>) => void;
};

import type schema from "../../generate/schema";
import { failCode } from "../../src/fail-code";
export declare function createClient(clientOptions: ClientOptions): {
    execute: <Path extends "hello-world/say">(path: Path, data: string | Parameters<{
        'hello-world/say': {
            meta: {};
            action(params: {
                by?: string | undefined;
            }, context: import("southern-aurora-bao").FrameworkContext): {
                youSay: string;
            };
        } & {
            isApi: true;
        };
    }[Path]["action"]>[0], headers?: Record<string, string | Array<string> | undefined>) => Promise<ExecuteResult<Path>>;
};
type ClientOptions = {
    url: string;
    storage: StorageLike;
};
type StorageLike = {
    getItem(key: string): string | null | Promise<string | null | undefined | "">;
    setItem(key: string, value: string): void | Promise<void>;
};
export type ExecuteResult<Path extends keyof Schema["apiMethodsTypeSchema"]> = {
    success: true;
    data: Awaited<ReturnType<Schema["apiMethodsTypeSchema"][Path]["action"]>>;
} | {
    success: false;
    fail: Fail<keyof typeof failCode>;
};
export type Fail<FailCode extends keyof typeof failCode> = {
    code: FailCode;
    message: string;
    data: Parameters<(typeof failCode)[FailCode]>[0];
};
export type Schema = typeof schema;
export declare const FailCode: {
    "network-error": () => string;
    "internal-server-error": () => string;
    "not-found": () => string;
    "not-allow-method": () => string;
    "general-type-safe-error": (p: {
        path: string;
        expected: string;
        value: string;
    }) => string;
    "business-fail": (message: string) => string;
};
export {};

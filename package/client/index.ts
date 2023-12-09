import { failCode } from "./generate/src/fail-code";
import type _ApiSchema from "./generate/generate/api-schema";
import type _ApiParams from "./generate/generate/products/api-params";

export type ApiSchema = typeof _ApiSchema;

export type ApiParams = typeof _ApiParams;

export const FailCode = failCode;

export type ExecuteParams<Path extends keyof ApiParams["params"]> = Awaited<ReturnType<ApiParams["params"][Path]>>;

export type ExecuteResult<Path extends keyof ApiSchema["apiMethodsTypeSchema"]> =
  | {
      success: true;
      data: Awaited<ReturnType<ApiSchema["apiMethodsTypeSchema"][Path]["action"]>>;
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

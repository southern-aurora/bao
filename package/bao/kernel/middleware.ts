import cuid from "cuid";
import type { Context } from "../../../src/context";
import type { FrameworkHTTPDetail } from "./context";

export const _beforeExecuteMiddlewares: Array<{
  id: string;
  index: number;
  middleware: BeforeExecute;
}> = [];
export const _afterExecuteMiddlewares: Array<{
  id: string;
  index: number;
  middleware: AfterExecute;
}> = [];
export const _afterHTTPRequestMiddlewares: Array<{
  id: string;
  index: number;
  middleware: AfterHTTPRequestMiddleware;
}> = [];
export const _beforeHTTPResponseMiddlewares: Array<{
  id: string;
  index: number;
  middleware: BeforeHTTPResponseMiddleware;
}> = [];

export function useMiddleware(index: number) {
  return {
    onBeforeExecute(middleware: BeforeExecute) {
      const id = cuid();
      _beforeExecuteMiddlewares.push({ id, index, middleware });
      return () =>
        _beforeExecuteMiddlewares.splice(
          _beforeExecuteMiddlewares.findIndex((v) => v.id === id),
          1
        );
    },
    onAfterExecute(middleware: AfterExecute) {
      const id = cuid();
      _afterExecuteMiddlewares.push({ id, index, middleware });
      return () =>
        _afterExecuteMiddlewares.splice(
          _afterExecuteMiddlewares.findIndex((v) => v.id === id),
          1
        );
    },
    onAfterHTTPRequest(middleware: AfterHTTPRequestMiddleware) {
      const id = cuid();
      _afterHTTPRequestMiddlewares.push({ id, index, middleware });
      return () =>
        _afterHTTPRequestMiddlewares.splice(
          _afterHTTPRequestMiddlewares.findIndex((v) => v.id === id),
          1
        );
    },
    onBeforeHTTPResponse(middleware: BeforeHTTPResponseMiddleware) {
      const id = cuid();
      _beforeHTTPResponseMiddlewares.push({ id, index, middleware });
      return () =>
        _beforeHTTPResponseMiddlewares.splice(
          _beforeHTTPResponseMiddlewares.findIndex((v) => v.id === id),
          1
        );
    }
  };
}

export async function _sortMiddleware() {
  _beforeExecuteMiddlewares.sort((a, b) => a.index - b.index);
  _afterExecuteMiddlewares.sort((a, b) => b.index - a.index);
  _afterHTTPRequestMiddlewares.sort((a, b) => a.index - b.index);
  _beforeHTTPResponseMiddlewares.sort((a, b) => b.index - a.index);
}

export type BeforeExecute = (context: Context) => Promise<void> | void;
export type AfterExecute = (context: Context, response: { value: unknown }) => Promise<void> | void;
export type AfterHTTPRequestMiddleware = (headers: Headers, detail: FrameworkHTTPDetail) => Promise<void> | void;
export type BeforeHTTPResponseMiddleware = (response: { value: string }, detail: FrameworkHTTPDetail) => Promise<void> | void;

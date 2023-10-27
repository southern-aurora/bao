import type { Meta } from "../../../src/meta";
import schema from "../../../generate/schema";

export async function useMeta(path: string): Promise<Meta> {
  const api = schema.apiMethodsSchema[path as keyof (typeof schema)["apiMethodsTypeSchema"]]();
  const module = await api.module;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (module[api.method as keyof typeof module] as any).meta;
}

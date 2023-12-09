/**
 * This file is no longer needed and is kept for compatibility purposes.
 * Bun has implemented native support for reading environment variables.
 * Refer to https://bun.sh/docs/runtime/env#manually-specifying-env-files
 */

import { exists } from "node:fs/promises";
import { argv, env } from "node:process";

function parseEnv(data: string): Record<string, string> {
  const envEntries = data.split("\n");
  const envObject: Record<string, string> = {};

  for (const entry of envEntries) {
    const [key, value] = entry.split("=");
    if (key && value) {
      envObject[key.trim()] = value.trim();
    }
  }

  return envObject;
}

async function loadEnvFile(mode: string) {
  if (!(await exists(mode))) return;
  const envfile = Bun.file(mode);
  const rawenv = await envfile.text();
  const objenv = parseEnv(rawenv);
  for (const key in objenv) {
    env[key] = objenv[key];
  }
}

let mode = env.MODE;

if (mode === undefined) {
  for (let index = 2; index < argv.length - 2; index++) {
    const arg = argv[index];
    if (arg.startsWith("--mode=")) {
      mode = arg.slice(7);
      break;
    }
  }
}

if (mode === undefined || mode === "") {
  mode = ".env";
}

await loadEnvFile(mode);

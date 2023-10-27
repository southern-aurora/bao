import { exists } from "node:fs/promises";
import { env } from "node:process";

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

async function loadEnvFile() {
  if (!(await exists(".env"))) return;
  const envfile = Bun.file(".env");
  const rawenv = await envfile.text();
  const objenv = parseEnv(rawenv);
  for (const key in objenv) {
    env[key] = objenv[key];
  }
}

await loadEnvFile();

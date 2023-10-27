import type { Logger } from "southern-aurora-bao";

// By default, log output to the console
// You can customize an object to implement the log output to the file, or send it to the private log center
export const logger: Logger = console;

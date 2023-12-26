/* eslint-disable @typescript-eslint/no-explicit-any */

import { type LoggerOptions, type ExecuteId } from "southern-aurora-bao";

// By default, log output to the console
// You can customize an object to implement the log output to the file, or send it to the private log center

export const loggerOptions = {
  onInsert: (options) => {
    // eslint-disable-next-line no-console
    console[options.loggerLevel](options.description, ...options.params);

    return true;
  },
  onSubmit: (tags, logs) => {
    //
  }
} satisfies LoggerOptions;

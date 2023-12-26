/// <reference types="bun-types" />
import "southern-aurora-bao/load-env-file";
export declare const bao: {
    execute: typeof import("southern-aurora-bao/kernel/execute")._execute;
    executeHttpServer: () => Promise<{
        server: import("bun").Server;
        stop: (closeActiveConnections?: boolean | undefined) => void;
    }>;
};

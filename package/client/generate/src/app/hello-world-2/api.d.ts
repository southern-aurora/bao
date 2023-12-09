export declare const say: {
    meta: {};
    action(params: {
        by?: string;
    }, context: import("southern-aurora-bao").FrameworkContext): {
        youSay: string;
    };
} & {
    isApi: true;
};

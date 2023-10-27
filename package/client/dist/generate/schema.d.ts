/**
 * ⚠️This file is generated and modifications will be overwritten
 */
import type * as helloWorld$api from '../src/app/hello-world/api';
import middlewareYourExample1$bootstrap from '../src/bootstrap/middleware-your-example-1';
declare const _default: {
    apiParams: {
        params: {
            'hello-world/say': (params: unknown) => Promise<import("typia").IValidation<{
                by?: string | undefined;
            }>>;
        };
    };
    apiMethodsSchema: {
        'hello-world/say': () => {
            module: Promise<typeof helloWorld$api>;
            method: string;
        };
    };
    apiMethodsTypeSchema: {
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
    };
    bootstrapSchema: {
        'middleware-your-example-1': typeof middlewareYourExample1$bootstrap;
    };
};
export default _default;

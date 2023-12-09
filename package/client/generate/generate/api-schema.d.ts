/**
 * ⚠️This file is generated and modifications will be overwritten
 */
import type * as helloWorld2$api from '../src/app/hello-world-2/api';
import type * as helloWorld$api from '../src/app/hello-world/api';
declare const _default: {
    apiParams: {
        params: {
            'hello-world-2/say': (params: unknown) => Promise<import("typia").IValidation<{
                by?: string | undefined;
            }>>;
            'hello-world/say': (params: unknown) => Promise<import("typia").IValidation<{
                by?: string | undefined;
            }>>;
        };
    };
    apiMethodsSchema: {
        'hello-world-2/say': () => {
            module: Promise<typeof helloWorld2$api>;
            method: string;
        };
        'hello-world/say': () => {
            module: Promise<typeof helloWorld$api>;
            method: string;
        };
    };
    apiMethodsTypeSchema: {
        'hello-world-2/say': {
            meta: {};
            action(params: {
                by?: string | undefined;
            }, context: import("southern-aurora-bao").FrameworkContext): {
                youSay: string;
            };
        } & {
            isApi: true;
        };
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
};
export default _default;

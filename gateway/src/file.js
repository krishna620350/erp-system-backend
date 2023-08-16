import { data } from "../json/jsonData.cjs";
import { typeSecurityGroup } from "../security/typeSecurity.js";
import { contentSecurity } from "../security/contentSecurity.js";
import { createApiProxy, logDataMiddleware } from "../apiProxy/proxyServer.js";

export const urlPathandSecurity = {
    path: data.local,
    port: data.port,
    typeSecurityGroup: typeSecurityGroup,
    contentSecurity: contentSecurity,
    createApiProxy: createApiProxy,
    logDataMiddleware: logDataMiddleware,
    deployePath: data.deployment
}
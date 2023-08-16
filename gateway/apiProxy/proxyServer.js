import { createProxyMiddleware } from "http-proxy-middleware";
import { objectFile } from "./files.js";

export const createApiProxy = (target, path) => {
  return createProxyMiddleware(path, {
    target,
    changeOrigin: true,
    onError: (err, req, res) => {
      console.error("Proxy Error:", err);
      objectFile.logFile.writeLog(`${path} - [PROXY-ERROR] - server error`, "blue");
      res.status(500).send("Proxy Error");
    },
  });
};

export const logDataMiddleware = (name) => {
  return (req, res, next) => {
    try {
      objectFile.logFile.writeLog(`${name} - [INFO] - Data is send to the named server`, "green");
    } catch (error) {
      objectFile.logFile.writeLog(`${name} - [ERROR] - Data is not send to the named server`, "red");
      console.error("JSON Parsing Error:", error);
    }
    next();
  };
};

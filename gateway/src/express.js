import express from "express";
import cors from "cors";
import { urlPathandSecurity } from "./file.js";

const app = express();

app.use(cors());

app.use(urlPathandSecurity.contentSecurity);
app.use(urlPathandSecurity.typeSecurityGroup);

const proxies = [
  { path: "/school",  target: `${urlPathandSecurity.deployePath.school}`, name:"school"},
  // { path: "/teacher", target: `${urlPathandSecurity.path}${urlPathandSecurity.port.teacher}`, name:"teacher"},
  // { path: "/student", target: `${urlPathandSecurity.path}${urlPathandSecurity.port.student}`, name:"student"},
];

proxies.forEach((proxyConfig) => {
  const { path, target, name } = proxyConfig;
  const logDataMiddleware = urlPathandSecurity.logDataMiddleware(name);
  const apiProxy = urlPathandSecurity.createApiProxy(target, path);
  app.use(path, logDataMiddleware, apiProxy);
});

app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

export { app };
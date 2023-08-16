// securityMiddleware.js

export const contentSecurity = (req, res, next) => {
  if (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") {
    const contentType = req.headers["content-type"];
    if (!contentType || !contentType.includes("application/json")) {
      return res.status(400).json({ message: "Only JSON data is allowed." });
    }
  }
  next();
};

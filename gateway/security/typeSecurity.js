export const typeSecurityGroup = (req, res, next) => {
    // Enforce HTTPS (HSTS)
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");

    // Prevent MIME type sniffing
    res.setHeader("X-Content-Type-Options", "nosniff");

    // Enable XSS filtering (may be redundant if browser supports CSP)
    res.setHeader("X-XSS-Protection", "1; mode=block");

    // Set X-Frame-Options to prevent clickjacking
    res.setHeader("X-Frame-Options", "SAMEORIGIN");

    next();
}


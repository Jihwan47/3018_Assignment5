import helmet from "helmet";

// config/helmetConfig.ts
const getHelmetConfig = () => {
    const isDevelopment = process.env.NODE_ENV === "development";

    if (isDevelopment) {
        return helmet({
            // Relaxed settings for development
            contentSecurityPolicy: false, // Disable CSP in development
            hsts: false, // No HTTPS enforcement in development
            hidePoweredBy: true, // hide freamwork, version or any vulnurability information
            dnsPrefetchControl: false, // Most of the browser prefetch DNS to improve performance, but it can be a privacy concern. Privacy Trade-off
            frameguard: {action: "deny"}, // Prevent clickjacking by disallowing the application from being embedded in frames.
            noSniff: true, // Prevent MIME type sniffing, which can lead to security vulnerabilities.
        });
    }

    // Production configuration optimized for APIs
    return helmet({
        // Disable CSP for API-only applications
        contentSecurityPolicy: false,

        hsts: {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true,
        },

        // Hide server technology information
        hidePoweredBy: true,

        // // Prevent MIME type sniffing
        noSniff: true,

        // Prevent clickjacking by denying framing
        frameguard: { action: "deny" },

        // Disable DNS prefetching for privacy
        dnsPrefetchControl: { allow: false },
        
    });
};

export default getHelmetConfig;
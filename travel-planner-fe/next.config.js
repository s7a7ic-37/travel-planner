const nextConfig = {
    outputFileTracingRoot: __dirname,
    output: "export",
    trailingSlash: true,
    images: { unoptimized: true },
    reactStrictMode: true,
    transpilePackages: ["@mui/system", "@mui/material", "@mui/icons-material"],
    modularizeImports: {
        "@mui/material": {
            transform: "@mui/material/{{member}}"
        },
        "@mui/icons-material": {
            transform: "@mui/icons-material/{{member}}"
        }
    }
};
module.exports = nextConfig;

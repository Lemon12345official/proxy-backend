const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

app.use("/", createProxyMiddleware({
  target: "https://example.com",
  changeOrigin: true,
  pathRewrite: (path, req) => {
    const url = req.query.url;
    return url ? url : "/";
  }
}));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Proxy running on port " + port));

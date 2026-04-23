const express = require("express");
const app = express();

app.get("/", async (req, res) => {
  const target = req.query.url;
  if (!target) {
    return res.send("No URL provided. Use ?url=https://example.com");
  }

try {
  let current = target;
  let response;
  let html;

  // Follow up to 5 redirects
  for (let i = 0; i < 5; i++) {
    response = await fetch(current, { redirect: "manual" });
    if (response.status >= 300 && response.status < 400 && response.headers.get("location")) {
      current = new URL(response.headers.get("location"), current).href;
      continue;
    }
    html = await response.text();
    break;
  }

  // Inject a <base> tag so relative paths resolve correctly
  const baseTag = `<base href="${current}">`;
  html = html.replace(/<head>/i, `<head>${baseTag}`);

  // Rewrite absolute URLs to route through proxy
  html = html.replace(/(href|src)="https?:\/\/([^"]+)"/g, (match, attr, url) => {
    return `${attr}="${req.protocol}://${req.get("host")}/?url=https://${url}"`;
  });

  // Rewrite relative links and sources to go through proxy
  html = html.replace(/(href|src)="\/(?!\/)/g, (match, attr) => {
    return `${attr}="${req.protocol}://${req.get("host")}/?url=${current}/`;
  });

  res.send(html);
} catch (err) {
  res.status(500).send("Error fetching target: " + err.message);
}

});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Proxy running on port " + port));

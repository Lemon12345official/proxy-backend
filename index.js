const express = require("express");
const app = express();

app.get("/", async (req, res) => {
  const target = req.query.url;
  if (!target) {
    return res.send("No URL provided. Use ?url=https://example.com");
  }

  try {
    const response = await fetch(target);
    let html = await response.text();

    // Inject a <base> tag so relative paths resolve correctly
    const baseTag = `<base href="${target}">`;
    html = html.replace(/<head>/i, `<head>${baseTag}`);

    // Rewrite absolute URLs to route through proxy
    html = html.replace(/(href|src)="https?:\/\/([^"]+)"/g, (match, attr, url) => {
      return `${attr}="${req.protocol}://${req.get("host")}/?url=https://${url}"`;
    });

    // Rewrite relative links and sources to go through proxy
    html = html.replace(/(href|src)="\/(?!\/)/g, (match, attr) => {
      return `${attr}="${req.protocol}://${req.get("host")}/?url=${target}/`;
    });

    res.send(html);
  } catch (err) {
    res.status(500).send("Error fetching target: " + err.message);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Proxy running on port " + port));

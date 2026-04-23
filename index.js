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

  // Rewrite relative links and sources to go through your proxy
  html = html.replace(/(href|src)="\/(?!\/)/g, `$1="${req.protocol}://${req.get("host")}/?url=${target}/`);

  res.send(html);
} catch (err) {
  res.status(500).send("Error fetching target: " + err.message);
}

  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Proxy running on port " + port));

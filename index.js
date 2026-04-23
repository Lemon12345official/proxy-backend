const express = require("express");
const fetch = require("node-fetch");

const app = express();

app.get("/", async (req, res) => {
  const target = req.query.url;
  if (!target) {
    return res.send("No URL provided. Use ?url=https://example.com");
  }

  try {
    const response = await fetch(target);
    const html = await response.text();
    res.send(html);
  } catch (err) {
    res.status(500).send("Error fetching target: " + err.message);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Proxy running on port " + port));
// updated April 23 2026

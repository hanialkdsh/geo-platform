const express = require("express");
const cors = require("cors");
const https = require("https");

const app = express();
const PORT = 3001;

const ANTHROPIC_KEY = process.env.ANTHROPIC_KEY || "YOUR_ANTHROPIC_KEY_HERE";

app.use(cors({ origin: ["http://localhost:3000", "http://localhost:3001"] }));
app.use(express.json());

app.post("/api/generate", (req, res) => {
  const body = JSON.stringify(req.body);

  const options = {
    hostname: "api.anthropic.com",
    path: "/v1/messages",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_KEY,
      "anthropic-version": "2023-06-01",
      "Content-Length": Buffer.byteLength(body),
    },
  };

  const request = https.request(options, (response) => {
    let data = "";
    response.on("data", (chunk) => (data += chunk));
    response.on("end", () => {
      try {
        res.json(JSON.parse(data));
      } catch {
        res.status(500).json({ error: "Invalid response from Anthropic" });
      }
    });
  });

  request.on("error", (e) => {
    res.status(500).json({ error: e.message });
  });

  request.write(body);
  request.end();
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`✓ GEO Platform Server running on http://localhost:${PORT}`);
  console.log(`✓ Anthropic API proxy ready`);
});

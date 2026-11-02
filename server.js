
const express = require("express");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

const DATA_FILE = path.join(__dirname, "links.json");

// Store links in memory
const links = new Map();

// Load previously saved links
if (fs.existsSync(DATA_FILE)) {
    const savedLinks = JSON.parse(
        fs.readFileSync(DATA_FILE, "utf8")
    );

    for (const [code, data] of Object.entries(savedLinks)) {
        links.set(code, data);
    }
}

// Save links permanently
function saveLinks() {
    const data = Object.fromEntries(links);

    fs.writeFileSync(
        DATA_FILE,
        JSON.stringify(data, null, 2),
        "utf8"
    );
}

app.use(express.json());

// Display website
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Load CSS
app.get("/style.css", (req, res) => {
    res.sendFile(path.join(__dirname, "style.css"));
});

// Load JavaScript
app.get("/script.js", (req, res) => {
    res.sendFile(path.join(__dirname, "script.js"));
});

// Shorten URL
app.post("/api/shorten", (req, res) => {
    const input = req.body?.url;

    if (typeof input !== "string") {
        return res.status(400).json({
            error: "Please enter a valid URL"
        });
    }

    let originalUrl;

    try {
        const parsed = new URL(input.trim());

        if (!["http:", "https:"].includes(parsed.protocol)) {
            throw new Error("Invalid protocol");
        }

        originalUrl = parsed.href;
    } catch (error) {
        return res.status(400).json({
            error: "Please enter a valid HTTP or HTTPS URL"
        });
    }

    let shortCode;

    do {
        shortCode = crypto.randomBytes(4).toString("hex");
    } while (links.has(shortCode));

    links.set(shortCode, {
        originalUrl: originalUrl,
        clicks: 0
    });

    // Save newly created link
    saveLinks();

    const shortUrl = `http://localhost:${PORT}/${shortCode}`;

    res.json({
        shortUrl,
        originalUrl
    });
});

// Analytics API
app.get("/api/links", (req, res) => {
    const analytics = Array.from(links.entries()).map(
        ([code, data]) => ({
            shortUrl: `http://localhost:${PORT}/${code}`,
            originalUrl: data.originalUrl,
            clicks: data.clicks
        })
    );

    res.json(analytics);
});

// Redirect short links
app.get("/:code", (req, res) => {
    const link = links.get(req.params.code);

    if (!link) {
        return res.status(404).send("Short URL not found");
    }

    // Increase click count
    link.clicks += 1;

    // Save updated click count
    saveLinks();

    res.redirect(link.originalUrl);
});

// Start server
app.listen(PORT, "127.0.0.1", () => {
    console.log(
        `LinkLens running at http://localhost:${PORT}`
    );
});

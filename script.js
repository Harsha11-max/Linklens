
const shortenBtn = document.getElementById("shortenBtn");
const longUrl = document.getElementById("longUrl");
const result = document.getElementById("result");

const totalLinks = document.getElementById("totalLinks");
const totalClicks = document.getElementById("totalClicks");
const linksTableBody = document.getElementById("linksTableBody");
const refreshBtn = document.getElementById("refreshBtn");

// Shorten URL
shortenBtn.addEventListener("click", async function () {
    const url = longUrl.value.trim();

    if (url === "") {
        alert("Please enter a URL!");
        return;
    }

    try {
        shortenBtn.disabled = true;
        shortenBtn.textContent = "Shortening...";
        result.replaceChildren();

        const response = await fetch("/api/shorten", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ url })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Unable to shorten URL");
        }

        const heading = document.createElement("h3");
        heading.textContent = "Your Shortened URL:";

        const link = document.createElement("a");
        link.href = data.shortUrl;
        link.textContent = data.shortUrl;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.style.color = "#a78bfa";

        result.append(heading, link);

        // Update dashboard after creating a link
        await loadAnalytics();

    } catch (error) {
        alert(error.message);
    } finally {
        shortenBtn.disabled = false;
        shortenBtn.textContent = "Shorten URL";
    }
});

// Load analytics from backend
async function loadAnalytics() {
    try {
        const response = await fetch("/api/links");

        if (!response.ok) {
            throw new Error("Unable to load analytics");
        }

        const links = await response.json();

        // Update total links
        totalLinks.textContent = links.length;

        // Calculate total clicks
        let clicks = 0;

        links.forEach(link => {
            clicks += link.clicks;
        });

        totalClicks.textContent = clicks;

        // Clear previous table data
        linksTableBody.replaceChildren();

        if (links.length === 0) {
            const row = document.createElement("tr");
            const cell = document.createElement("td");

            cell.colSpan = 3;
            cell.textContent = "No links created yet.";

            row.appendChild(cell);
            linksTableBody.appendChild(row);
            return;
        }

        // Display each shortened link
        links.forEach(link => {
            const row = document.createElement("tr");

            const originalCell = document.createElement("td");
            originalCell.textContent = link.originalUrl;

            const shortCell = document.createElement("td");
            const anchor = document.createElement("a");

            anchor.href = link.shortUrl;
            anchor.textContent = link.shortUrl;
            anchor.target = "_blank";
            anchor.rel = "noopener noreferrer";

            shortCell.appendChild(anchor);

            const clicksCell = document.createElement("td");
            clicksCell.textContent = link.clicks;

            row.appendChild(originalCell);
            row.appendChild(shortCell);
            row.appendChild(clicksCell);

            linksTableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Analytics Error:", error);
        linksTableBody.replaceChildren();

        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = 3;
        cell.textContent = "Could not load analytics.";

        row.appendChild(cell);
        linksTableBody.appendChild(row);
    }
}

// Refresh dashboard
refreshBtn.addEventListener("click", loadAnalytics);

// Automatically load analytics when page opens
loadAnalytics();

const http = require("http");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const client = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

const PORT = process.env.PORT || 3000;

const CONTENT_TYPES = {
	".html": "text/html",
	".js": "text/javascript",
	".css": "text/css",
	".json": "application/json",
	".ico": "image/x-icon",
	".png": "image/png",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
};

async function handleApiParse(req, res) {
	try {
		let body = "";

		req.on("data", (chunk) => {
			body += chunk.toString();
		});

		req.on("end", async () => {
			try {
				const parsed = JSON.parse(body || "{}");
				const { fullPrompt } = parsed;

				if (!fullPrompt || typeof fullPrompt !== "string") {
					res.writeHead(400, { "Content-Type": "application/json" });
					res.end(
						JSON.stringify({
							error: "fullPrompt is required in request body.",
						})
					);
					return;
				}

				const response = await client.responses.create({
					model: "gpt-5",
					reasoning: { effort: "low" },
					input: fullPrompt,
				});

				// Match the behavior in test.mjs
				const text = response.output_text || "";

				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(JSON.stringify({ text }));
			} catch (err) {
				console.error("Error handling /api/parse:", err);
				if (!res.headersSent) {
					res.writeHead(500, { "Content-Type": "application/json" });
				}
				res.end(JSON.stringify({ error: "Internal server error." }));
			}
		});
	} catch (err) {
		console.error("Unexpected error in handleApiParse:", err);
		if (!res.headersSent) {
			res.writeHead(500, { "Content-Type": "application/json" });
		}
		res.end(JSON.stringify({ error: "Internal server error." }));
	}
}

const server = http.createServer((req, res) => {
	// API route for OpenAI calls
	if (req.method === "POST" && req.url === "/api/parse") {
		handleApiParse(req, res);
		return;
	}

	// Static file serving
	let urlPath = req.url;
	if (urlPath === "/") {
		urlPath = "/index.html";
	}

	// Strip query string if present
	const [pathname] = urlPath.split("?");
	const filePath = path.join(__dirname, pathname);
	const ext = path.extname(filePath).toLowerCase();
	const contentType = CONTENT_TYPES[ext] || "application/octet-stream";

	const fileStream = fs.createReadStream(filePath);

	fileStream.on("open", () => {
		if (!res.headersSent) {
			res.writeHead(200, { "Content-Type": contentType });
		}
		fileStream.pipe(res);
	});

	fileStream.on("error", (err) => {
		if (res.headersSent) {
			res.end();
			return;
		}

		if (err.code === "ENOENT") {
			res.writeHead(404, { "Content-Type": "text/plain" });
			res.end("File not found");
		} else {
			res.writeHead(500, { "Content-Type": "text/plain" });
			res.end(err.message);
		}
	});
});

server.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
// Minimal zero-dependency static server for local preview.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const ROOT = new URL(".", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const PORT = process.env.PORT || 3210;
const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8", ".svg": "image/svg+xml",
  ".json": "application/json", ".xml": "application/xml",
  ".webmanifest": "application/manifest+json", ".txt": "text/plain; charset=utf-8",
  ".ico": "image/x-icon", ".png": "image/png",
};

createServer(async (req, res) => {
  try {
    let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (p === "/") p = "/index.html";
    let file = normalize(join(ROOT, p));
    if (!file.startsWith(normalize(ROOT))) { res.writeHead(403).end("Forbidden"); return; }
    let body;
    try { body = await readFile(file); }
    catch { body = await readFile(join(ROOT, "404.html")); res.writeHead(404, { "Content-Type": TYPES[".html"] }).end(body); return; }
    res.writeHead(200, { "Content-Type": TYPES[extname(file)] || "application/octet-stream", "Cache-Control": "no-cache" });
    res.end(body);
  } catch (e) { res.writeHead(500).end(String(e)); }
}).listen(PORT, () => console.log(`Buckeye Broadband Authorized Agent preview → http://localhost:${PORT}`));

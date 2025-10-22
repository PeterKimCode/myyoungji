import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import { promises as fs } from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif"
};

const resolveFilePath = (urlPath) => {
  let resolved = urlPath.split("?")[0] ?? "/";
  if (!resolved.startsWith("/")) {
    resolved = `/${resolved}`;
  }
  if (resolved.endsWith("/")) {
    resolved = `${resolved}index.html`;
  } else if (!path.extname(resolved)) {
    resolved = `${resolved}/index.html`;
  }
  return path.join(distDir, resolved);
};

const port = Number(process.env.PORT ?? 4321);

const server = http.createServer(async (req, res) => {
  try {
    const filePath = resolveFilePath(req.url ?? "/");
    const data = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] ?? "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      try {
        const fallback = await fs.readFile(path.join(distDir, "404.html"));
        res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
        res.end(fallback);
      } catch {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Not found");
      }
    } else {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Internal server error");
    }
  }
});

server.listen(port, () => {
  console.log(`Preview server running at http://localhost:${port}`);
});

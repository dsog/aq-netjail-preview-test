// Fixed-port test app for AQ preview units in network-isolated work items.
const http = require("http");
const fs = require("fs");
const PORT = 3000; // deliberately fixed: two work items must both get it
const hog = [];
setInterval(() => {
  // Touch a HOG file in the worktree to make this process eat memory (OOM test).
  if (fs.existsSync(__dirname + "/HOG")) { const b = Buffer.alloc(64 * 1024 * 1024, 1); hog.push(b); console.log(`hog: ${hog.length * 64} MB`); }
}, 200);
http.createServer((req, res) => {
  const msg = fs.readFileSync(__dirname + "/message.txt", "utf8").trim();
  res.setHeader("content-type", "text/html");
  res.end(`<!doctype html><title>${msg}</title><h1 style="font:48px sans-serif">${msg}</h1><p>pid ${process.pid}, port ${PORT}</p>`);
}).listen(PORT, () => console.log(`netjail-test listening on ${PORT}, message: ${fs.readFileSync(__dirname + "/message.txt", "utf8").trim()}`));

import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const html_path = "./src/index.html";

let html = fs.readFileSync(html_path);
let clients = [];

const app = express();
app.use(express.static(path.join(__dirname, "public")));

function updateHTML() {
  html = fs.readFileSync(html_path, "utf-8");
  console.log("HTML content updated");
  clients.forEach((client) => client.res.write(`data: ${JSON.stringify({ html })}\n\n`));
}

fs.watch(html_path, (eventType, filename) => {
  if (eventType === "change") {
    console.log(`${filename} has been modified`);
    updateHTML();
  }
});

app.get("/", (req, res) => {
  res.status(200);
  res.end(html);
});

app.get("/updates", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" });
  res.write("\n");

  const clientId = Date.now();
  const newClient = { id: clientId, res };
  clients.push(newClient);

  req.on("close", () => {
    console.log(`${clientId} Connection closed`);
    clients = clients.filter((client) => client.id !== clientId);
  });
});

const PORT = 3108;
app.listen(PORT, () => {
  console.log("listening");
});

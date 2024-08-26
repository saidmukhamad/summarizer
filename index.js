import express from "express";
import fs from "fs";
import path from "path";
const app = express();

let html = fs.readFileSync("./index.html");
let clients = [];

function updateHTML() {
  html = fs.readFileSync("./index.html", "utf-8");
  console.log("HTML content updated");
  clients.forEach((client) => client.res.write(`data: ${JSON.stringify({ html })}\n\n`));
}

fs.watch("./index.html", (eventType, filename) => {
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

// websocketServer.js
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 });

let counter = 0;

wss.on("connection", (ws) => {
  // Send initial counter value to the client
  ws.send(JSON.stringify({ type: "counter", count: counter }));

  ws.on("message", (message) => {
    const data = JSON.parse(message);

    if (data.type === "increment") {
      counter += 1;
    } else if (data.type === "decrement") {
      counter -= 1;
    }

    // Broadcast the updated counter to all clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: "counter", count: counter }));
      }
    });
  });
});

console.log("WebSocket server running on ws://localhost:8080");

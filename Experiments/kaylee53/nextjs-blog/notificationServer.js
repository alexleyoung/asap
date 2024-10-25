const WebSocket = require("ws");

const server = new WebSocket.Server({ port: 8080 });

let count = 0;

server.on("connection", (ws) => {
  console.log("Client connected");

  // Send initial count to the new client
  ws.send(JSON.stringify({ type: "counter", count }));

  ws.on("message", (message) => {
    const data = JSON.parse(message);

    if (data.type === "increment") {
      count = data.count; // Update the count
      // Broadcast the updated count to all clients
      server.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: "counter", count }));
        }
      });
      // Send notification
      server.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              type: "notification",
              message: `Counter incremented to ${count}`,
            })
          );
        }
      });
    }

    if (data.type === "decrement") {
      count = data.count; // Update the count
      // Broadcast the updated count to all clients
      server.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: "counter", count }));
        }
      });
      // Send notification
      server.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              type: "notification",
              message: `Counter decremented to ${count}`,
            })
          );
        }
      });
    }
  });
});

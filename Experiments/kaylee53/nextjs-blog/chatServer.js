// chatServer.js
const WebSocket = require("ws");
const chatWSS = new WebSocket.Server({ port: 8082 });

chatWSS.on("connection", (ws) => {
  console.log("Client connected to chat WebSocket.");

  ws.on("message", (message) => {
    const data = JSON.parse(message);

    if (data.type === "chat") {
      // Broadcast chat messages to all connected clients
      chatWSS.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: "chat", message: data.message }));
        }
      });
      console.log("Chat message broadcast:", data.message);
    }
  });
});

console.log("Chat WebSocket server running on ws://localhost:8082");

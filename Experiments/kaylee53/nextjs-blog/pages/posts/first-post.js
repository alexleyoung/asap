import Link from "next/link";
import Head from "next/head";

import React, { useEffect, useState, useRef } from "react";

const Counter = () => {
  const [count, setCount] = useState(0);
  const [notification, setNotification] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");

  // Store WebSocket connections in refs
  const counterWS = useRef(null);
  const notificationWS = useRef(null);
  const chatWS = useRef(null);

  useEffect(() => {
    counterWS.current = new WebSocket("ws://localhost:8080");
    notificationWS.current = new WebSocket("ws://localhost:8081");
    chatWS.current = new WebSocket("ws://localhost:8082");

    counterWS.current.onopen = () => {
      console.log("Connected to counter WebSocket");
    };

    notificationWS.current.onopen = () => {
      console.log("Connected to notification WebSocket");
    };

    chatWS.current.onopen = () => {
      console.log("Connected to chat WebSocket");
    };

    counterWS.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "counter") {
        setCount(data.count);
      }
    };

    notificationWS.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "notification") {
        setNotification(data.message);
      }
    };

    chatWS.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "chat") {
        setChatMessages((prev) => [...prev, data.message]);
      }
    };

    return () => {
      counterWS.current.close();
      notificationWS.current.close();
      chatWS.current.close();
    };
  }, []);

  const incrementCounter = () => {
    const newCount = count + 1; // Calculate the new count
    setCount(newCount); // Update the local count state
    console.log("Incrementing counter to:", newCount);
    // Send increment message to the counter WebSocket
    if (counterWS.current && counterWS.current.readyState === WebSocket.OPEN) {
      counterWS.current.send(
        JSON.stringify({ type: "increment", count: newCount })
      );
    }
  };

  const decrementCounter = () => {
    const newCount = count - 1; // Calculate the new count
    setCount(newCount); // Update the local count state
    // Send decrement message to the counter WebSocket
    if (counterWS.current && counterWS.current.readyState === WebSocket.OPEN) {
      counterWS.current.send(
        JSON.stringify({ type: "decrement", count: newCount })
      );
    }
  };

  const sendChatMessage = () => {
    if (chatWS.current && chatWS.current.readyState === WebSocket.OPEN) {
      chatWS.current.send(JSON.stringify({ type: "chat", message: chatInput }));
      setChatInput(""); // Clear input after sending
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Counter: {count}</h2>
      <div className="mb-4">
        <button
          onClick={incrementCounter}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          Increment
        </button>
        <button
          onClick={decrementCounter}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Decrement
        </button>
      </div>
      {notification && <p className="text-green-600 mb-4">{notification}</p>}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Chat</h3>
        <ul className="mb-2">
          {chatMessages.map((msg, index) => (
            <li key={index} className="border-b border-gray-200 py-1">
              {msg}
            </li>
          ))}
        </ul>
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          className="border border-gray-300 p-2 rounded mr-2"
          placeholder="Type a message"
        />
        <button
          onClick={sendChatMessage}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default function FirstPost() {
  return (
    <>
      <Head>
        <title>First Post</title>
      </Head>
      <h1 className=" font-bold text-3xl mb-10">First Post</h1>

      <Counter />
      <footer>
        <Link href="/">← Back to home</Link>
      </footer>
    </>
  );
}

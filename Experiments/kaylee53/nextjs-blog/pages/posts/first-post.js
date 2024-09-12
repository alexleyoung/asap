import Link from "next/link";
import Head from "next/head";
import React from "react";

const Counter = () => {
  const [count, setCount] = React.useState(0);

  return (
    <>
      <h2 className="text-xl mb-4">Counter: {count}</h2>
      <button
        onClick={() => setCount(count + 1)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 mr-4"
      >
        Increment
      </button>
      <button
        onClick={() => setCount(count - 1)}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Decrement
      </button>
    </>
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

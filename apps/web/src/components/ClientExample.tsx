"use client";

import { useState } from "react";

type ClientExampleProps = {
  translations: {
    counter: string;
    increment: string;
    decrement: string;
    currentCount: string;
  };
};

export function ClientExample({ translations }: ClientExampleProps) {
  const [count, setCount] = useState(0);

  return (
    <div className="p-6 border rounded-lg bg-white shadow-sm">
      <h2 className="text-xl font-semibold mb-4">{translations.counter}</h2>
      <p className="mb-4">
        {translations.currentCount}: <span className="font-bold">{count}</span>
      </p>
      <div className="flex space-x-2">
        <button
          onClick={() => setCount(count - 1)}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
        >
          {translations.decrement}
        </button>
        <button
          onClick={() => setCount(count + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          {translations.increment}
        </button>
      </div>
    </div>
  );
}

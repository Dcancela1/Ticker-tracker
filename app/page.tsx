"use client";

import { useState } from "react";

const mockPosts = [
  { id: 1, content: "Just bought some $AAPL, looks promising!" },
  { id: 2, content: "Loving $TSLA right now, great earnings." },
  { id: 3, content: "Sold $GME, bought more $AAPL instead." },
  { id: 4, content: "Big fan of $MSFT long-term." },
  { id: 5, content: "$TSLA to the moon!" },
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter posts based on search term
  const filteredPosts = mockPosts.filter((post) =>
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Count ticker mentions
  const tickerCounts: { [key: string]: number } = {};
  mockPosts.forEach((post) => {
    const tickers = post.content.match(/\$[A-Z]+/g) || [];
    tickers.forEach((ticker) => {
      tickerCounts[ticker] = (tickerCounts[ticker] || 0) + 1;
    });
  });

  // Sort tickers by count (most to least)
  const sortedTickers = Object.entries(tickerCounts).sort(
    ([, countA], [, countB]) => countB - countA
  );

  return (
    <main className="p-4 max-w-2xl mx-auto min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Ticker Tracker</h1>
      
      <input
        type="text"
        placeholder="Search for a ticker (e.g., $AAPL)"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-3 mb-6 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Filtered Posts</h2>
          {filteredPosts.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1">
              {filteredPosts.map((post) => (
                <li key={post.id}>{post.content}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No posts match your search.</p>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Ticker Mentions</h2>
          <ul className="list-decimal pl-5 space-y-1">
            {sortedTickers.map(([ticker, count]) => (
              <li key={ticker}>
                {ticker}: {count} mention{count > 1 ? "s" : ""}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
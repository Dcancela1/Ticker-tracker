"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts] = useState([]); // Real tweets go here

  useEffect(() => {
    async function fetchTweets() {
      const userIds = [
        "1539633097379774465", // @StockSavvyShay
        "3363026992",         // @amitisinvesting
        "19798169",           // @matthughes13
        "1474087474478755840", // @cantonmeow
        "1506279565763919872", // @dannycheng2022
        "305051737",          // @iamtomnash
        "1511123187713892352", // @Micro2Macr0
        "1666149370758979585", // @JIMROInvest
        "1417229738582958082"  // @HolySmokas
      ];

      try {
        // Fetch tweets for each user ID
        const tweets = [];
        for (const userId of userIds) {
          const response = await fetch(
            `https://api.twitter.com/2/users/${userId}/tweets?max_results=10&tweet.fields=text`,
            {
              headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_X_BEARER_TOKEN}`,
              },
            }
          );
          const data = await response.json();
          if (data.data) {
            tweets.push(
              ...data.data.map((tweet) => ({
                id: tweet.id,
                content: tweet.text,
              }))
            );
          }
        }
        setPosts(tweets);
      } catch (error) {
        console.error("Error fetching tweets:", error);
      }
    }
    fetchTweets();
  }, []); // Runs once on page load

  // Filter posts based on search term
  const filteredPosts = posts.filter((post) =>
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Count ticker mentions
  const tickerCounts = {};
  posts.forEach((post) => {
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

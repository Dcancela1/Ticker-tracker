import { NextResponse } from 'next/server';

export async function GET() {
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
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.data) {
        tweets.push(
          ...data.data.map((tweet: any) => ({
            id: tweet.id,
            content: tweet.text,
          }))
        );
      }
    }
    return NextResponse.json(tweets);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
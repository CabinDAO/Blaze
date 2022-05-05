(global as any).WebSocket = require("isomorphic-ws");
import { NextApiRequest, NextApiResponse } from "next";
import urlMetadata from "url-metadata";
import { TwitterApi } from "twitter-api-v2";

interface MetadataInfo {
  title: string;
  url: string;
  description?: string;
  og_description?: string;
}

/** Fetch metadata from any URL */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    if (req.body.url.includes("twitter.com")) {
      const match = req.body.url.match(/twitter\.com\/.*\/status\/(?<id>\d+)/);
      if (match?.groups?.id) {
        const id = match.groups.id;
        const client = new TwitterApi(process.env.TWITTER_API_KEY ?? "")
          .readOnly;
        const tweet = await client.v2.singleTweet(id, {
          expansions: ["author_id"],
        });
        const author = tweet.includes?.users?.find(
          (u) => u.id === tweet.data.author_id
        );
        return res.status(200).json({
          title: tweet.data.text,
          url: req.body.url,
          description: `Tweet by @${author?.username}`,
        });
      }
    }
    urlMetadata(req.body.url).then(
      (metadata: Object) => {
        res.status(200).json(metadata);
      },
      (error: any) => {
        res.status(500).json({ message: error });
      }
    );
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}

(global as any).WebSocket = require("isomorphic-ws");
import { NextApiRequest, NextApiResponse } from "next";
import { parse } from "rss-to-json";
import initMiddleware from "../../lib/init-middleware";
import Cors from "cors";
import { setupThreadClient, createInstance, auth } from "@/lib/db";
import { ThreadID } from "@textile/hub";
import { getUnixTime } from "date-fns";
import { v4 as uuidv4 } from "uuid";

export interface Post {
  _id: string;
  title: string;
  domainText: string;
  url: string;
  postedBy: string;
  timeStamp: number;
  upvotes: number;
}

// Initialize the cors middleware
const cors = initMiddleware(
  Cors({
    // Only allow requests with GET, POST
    methods: ["GET", "POST"],
  })
);
//Mirror feeds to seed database
// Cabin, Krause House, MirrorDAO, Songcamp, Seed Club
const MirrorRSSFeedURLs = [
  ["mirror.xyz", "https://dao.submirror.xyz"],
  ["creatorcabins.com", "https://creators.submirror.xyz"],
  ["krausehouse.club", "https://krausehouse.submirror.xyz/"],
  ["songcamp.band", "https://songcamp.submirror.xyz/"],
  ["seedclub.xyz", "https://club.submirror.xyz/"],
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await cors(req, res);
  if (req.method === "POST") {
    try {
      const { authorization } = req.headers;
      if (
        authorization === `Bearer ${process.env.NEXT_PUBLIC_TEXTILE_API_KEY}`
      ) {
        const userAuth = await auth({
          key: process.env.NEXT_PUBLIC_TEXTILE_API_KEY || "",
          secret: process.env.NEXT_PUBLIC_TEXTILE_API_SECRET || "",
        });
        const client = await setupThreadClient(userAuth);
        const threadList = await client.listDBs();
        const threadId = ThreadID.fromString(threadList[0].id);

        const fetchMirrorData = async (urlArray: string[][]) => {
          let combinedData = [];
          for (const arr of urlArray) {
            const domainText = arr[0];
            const rawData = await parse(arr[1], {});
            const linkData = await rawData.items.slice(0, 10).map((item) => {
              return {
                _id: uuidv4(),
                title: item.title,
                url: item.link,
                domainText: domainText,
                postedBy: "0x0000000000000000000000000000000000000000",
                timeStamp: getUnixTime(new Date()),
                upvotes: 0,
              };
            });
            combinedData.push(...linkData);
          }
          return combinedData;
        };
        const fetchedLinks = await fetchMirrorData(MirrorRSSFeedURLs);
        const currentPosts: Post[] = await client.find(threadId, "links", {});
        const concat = fetchedLinks.concat(currentPosts);

        //remove duplicates
        const uniquePosts = new Set(concat);
        //convert back to array
        const uniquePostsArray = Array.from(uniquePosts);

        const newPosts = await createInstance(
          client,
          threadId,
          "links",
          uniquePostsArray
        );
        if (newPosts.length > 0) {
          res.status(200).json({
            message: `${newPosts.length} new posts added to database`,
            posts: newPosts,
          });
        } else {
          res.status(200).json({
            message: `No new posts added to database`,
          });
        }
      } else {
        res.status(401).json({ message: "Unauthorized access" });
      }
    } catch (err: any) {
      console.log(err);
      res.status(500).json({ message: err.message });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}

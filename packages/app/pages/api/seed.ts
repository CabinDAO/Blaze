(global as any).WebSocket = require("isomorphic-ws");
import { NextApiRequest, NextApiResponse } from "next";
import { parse } from "rss-to-json";
import initMiddleware from "../../lib/init-middleware";
import Cors from "cors";
import { setupThreadClient, auth } from "@/lib/db

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
  "https://dao.submirror.xyz",
  "https://creators.submirror.xyz",
  "https://krausehouse.submirror.xyz/",
  "https://songcamp.submirror.xyz/",
  "https://club.submirror.xyz/",
];
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await cors(req, res);
  if (req.method === "POST") {
    try {
          const { authorization } = req.headers;
    if (authorization === `Bearer ${process.env.API_KEY}`) {
        const userAuth = await auth({ key: process.env.API_KEY || "", secret: process.env.API_SECRET || "" });
      const fetchMirrorData = async (urlArray) => {
        let combinedData = [];
        for (const url of urlArray) {
          const rawData = await parse(url, {});
          const linkData = await rawData.items.slice(0, 10).map((item) => {
            return {
              title: item.title,
              url: item.link,
            };
          });
          combinedData.push(...linkData);
        }
        return combinedData;
      };
      const writeLinksToDB = async (linksArray) => {
        for (const link in linksArray) {
        }
      };
      // const links = await fetchMirrorData(MirrorRSSFeedURLs);
      // await writeLinksToDB(links);
      res.status(200).json({ status: "success", newLinks: links });
    } catch (err) {
      console.log(err);
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}

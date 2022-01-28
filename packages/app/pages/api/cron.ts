import { NextApiRequest, NextApiResponse } from "next";
import { parse } from "rss-to-json";
import OrbitDB from "orbit-db";
import Ipfs from "ipfs";
import DaoCampDB from "../../scripts/db";

//Mirror feeds to seed database
// Cabin, Krause House, MirrorDAO, Songcamp, Seed Club
const MirrorRSSFeedURLs = [
  "https://dao.submirror.xyz, https://creators.submirror.xyz, https://krausehouse.submirror.xyz/",
  "https://songcamp.submirror.xyz/",
  "https://club.submirror.xyz/",
];
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { authorization } = req.headers;

      if (authorization === `Bearer ${process.env.API_KEY}`) {
        let rss = await parse(MirrorRSSFeedURLs[0], {
          transformRequest: (data) => {
            data.items = data.items.slice(0, 10);
            return data;
            }
        });
        res.status(200).json(rss);
      } else {
        res
          .status(401)
          .json({ success: false, message: "Unauthorized access" });
      }
    } catch (err) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}

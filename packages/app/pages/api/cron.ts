import { NextApiRequest, NextApiResponse } from "next";
import { parse } from "rss-to-json";
import OrbitDB from "orbit-db";
import Ipfs from "ipfs";
import DaoCampDB from "../../scripts/db";

//Mirror feeds to seed database
// Cabin, Krause House, MirrorDAO, Songcamp, Seed Club
const MirrorFeedURLs = ["https://dao.mirror.xyz/OvXLCC3v2hUR06ay0g6wvn3zH1mShq4z3VCfto6TBKY, "]
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { authorization } = req.headers;

      if (authorization === `Bearer ${process.env.API_SECRET_KEY}`) {

        res.status(200).json({ success: true });
      } else {
        res.status(401).json({ success: false });
      }
    } catch (err) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}

import { NextApiRequest, NextApiResponse } from "next";
import initMiddleware from "../../lib/init-middleware";
import Cors from "cors";
import { setupThreadClient, createDB, createCollection, auth } from "@/lib/db";
import { ThreadID, Where } from "@textile/hub";

export interface Profile {
  _id: string;
  walletAddress: string;
  joinDate: number;
  lastSeenDate: number;
  upvotesReceived: number;
  linksUpvoted: number;
}

export interface Link {
  _id: string;
  title: string;
  url: string;
  timeStamp: number;
  upvotes: number;
}

export interface Upvote {
  _id: string;
  upvoter: string;
  timeStamp: number;
  link: string;
}

// Initialize the cors middleware
const cors = initMiddleware(
  Cors({
    // Only allow requests with GET, POST
    methods: ["GET", "POST"],
  })
);

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

        //get all instances
        const links: Link[] = await client.find(threadId, "links", {});
        const upvotes: Upvote[] = await client.find(threadId, "upvotes", {});
        const profiles: Profile[] = await client.find(threadId, "profiles", {});
        //get instance ids and delete instances
        const linkIds = links.map((link) => link._id);
        await client.delete(threadId, "links", linkIds);
        const upvoteIds = upvotes.map((upvote) => upvote._id);
        await client.delete(threadId, "upvotes", upvoteIds);
        const profileIds = profiles.map((profile) => profile._id);
        await client.delete(threadId, "profiles", profileIds);

        res.status(200).json({ status: "success" });
      } else {
        res
          .status(401)
          .json({ success: false, message: "Unauthorized access" });
      }
    } catch (err: any) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}

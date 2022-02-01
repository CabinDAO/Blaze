import { NextApiRequest, NextApiResponse } from "next";
import initMiddleware from "../../lib/init-middleware";
import Cors from "cors";
import { setupThreadClient, createDB, createCollection, auth, ProfileSchema, LinkSchema, UpvoteSchema } from "@/lib/db";
import { ThreadID } from "@textile/hub";

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
            if (authorization === `Bearer ${process.env.NEXT_PUBLIC_TEXTILE_API_KEY}`) {
                const userAuth = await auth({ key: process.env.NEXT_PUBLIC_TEXTILE_API_KEY || "", secret: process.env.NEXT_PUBLIC_TEXTILE_API_SECRET || "" });
                const client = await setupThreadClient(userAuth);
                const thread = await createDB(client);
                await createCollection(client, thread, "profiles", ProfileSchema);
                await createCollection(client, thread, "links", LinkSchema);
                await createCollection(client, thread, "upvotes",  UpvoteSchema);
                res.status(200).json({ status: "success", message: "DB and Collections created — ready to seed.", threadID: thread.toString()});
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
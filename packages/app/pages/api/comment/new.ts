(global as any).WebSocket = require("isomorphic-ws");
import { NextApiRequest, NextApiResponse } from "next";
import supabase from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";
import { getUnixTime } from "date-fns";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const comment = {
      ...req.body,
      _id: uuidv4(),
      timestamp: getUnixTime(new Date()),
    };

    try {
      if (comment.parentCommentId) {
      await supabase.from("SubComments").insert(comment);
      } else {
      await supabase.from("PostComments").insert(comment);
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
    res.status(200).json({
      message: "New comment added to the database",
      comment: comment,
    });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}

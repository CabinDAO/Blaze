import { NextApiRequest, NextApiResponse } from 'next';
import supabase from "@/lib/supabaseClient";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { error } = await supabase.rpc("upordownvote", {
      post_id: req.body.postId,
      address: req.body.upvoter,
    });

    if (error) {
      return res.status(409).json({ message: "Already upvoted" });
    }

    return res.status(201).json({ postId: req.body.postId });
  } else {
    return res.setHeader("ALLOWED", "POST").status(405);
  }
}

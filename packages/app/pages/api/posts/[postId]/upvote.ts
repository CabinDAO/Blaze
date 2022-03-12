import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { createClient } from "@supabase/supabase-js";
import { ironOptions } from "@/constants";

const supabaseId = process.env.NEXT_PUBLIC_SUPABASE_KEY || "";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";

const supabase = createClient(supabaseUrl, supabaseId, {
  schema: "public",
  autoRefreshToken: true,
  persistSession: false,
  detectSessionInUrl: false,
});

const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { method } = req;
  switch (method) {
    case "POST":
      try {
        if (req.session.siwe) {
          await supabase.rpc("upordownvote", {
            post_id: req.body.postId,
            address: req.session.siwe.address,
          });
          return res.status(201).json({ postId: req.body.postId });
        } else {
          return res.status(403).json({ message: "Action forbidden" });
        }
      } catch (_error) {
        return res.status(409).json({ message: "Already upvoted" });
      }
    default:
      res.setHeader("ALLOWED", "POST").status(405);
      return;
  }
};

export default withIronSessionApiRoute(handler, ironOptions);

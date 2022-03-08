import {NextApiRequest, NextApiResponse} from "next";
import supabase from "@/lib/supabaseClient";
import {withIronSessionApiRoute} from "iron-session/next";
import {ironOptions} from "@/constants";

const handler = async (req: any, res: any) => {
  const {method} = req;
  switch (method) {
    case "POST":
      try {
        if (req.session.siwe) {
          await supabase.rpc("upordownvote", {
            post_id: req.body.postId,
            address: req.session.siwe.address,
          });
          return res.status(201).json({postId: req.body.postId});
        } else {
          return res.status(403).json({message: "Action forbidden"});
        }
      } catch (_error) {
        return res.status(409).json({message: "Already upvoted"});
      }
    default:
      return res.setHeader("ALLOWED", "POST").status(405);
  }
};

export default withIronSessionApiRoute(handler, ironOptions);

import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { SiweMessage } from 'siwe';
import { ironOptions } from '@/constants';
import supabase from "@/lib/supabaseClient";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    // TODO: verify upvoter address using signed message
    const { message, signature } = req.body
    const siweMessage = new SiweMessage(message)
    const fields = await siweMessage.validate(signature)
    const { error } = await supabase.rpc("upvote", {
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

export default withIronSessionApiRoute(handler, ironOptions)

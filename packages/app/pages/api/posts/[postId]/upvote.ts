import supabase from "@/lib/supabaseServer";

export default async function handler(req: any, res: any) {
  if (req.method === "POST") {
    // TODO: upvote if authed with ETH auth
    // returns data as whether the user has just upvoted or downvoted
    const {data: upvoted, error} = await supabase.rpc("upordownvote", {
      post_id: req.body.postId,
      address: req.body.upvoter,
    });

    if (error) {
      return res.status(409).json({message: "Already upvoted", error});
    }

    return res.status(201).json({postId: req.body.postId, upvoted});
  } else {
    return res.setHeader("ALLOWED", "POST").status(405);
  }
}

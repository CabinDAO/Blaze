import supabase from "@/lib/supabaseClient";

export default async function handler(req: any, res: any) {
  if (req.method === "POST") {
    // TODO: verify upvoter address using signed message
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

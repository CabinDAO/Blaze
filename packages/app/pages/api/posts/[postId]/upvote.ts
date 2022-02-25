import supabase from "@/lib/supabaseClient";

export default async function handler(req: any, res: any) {
  if (req.method === "POST") {
    const post = await supabase
      .from<{ _id: string; upvotes: number }>("Posts")
      .select("*")
      .filter("_id", "eq", req.body.postId)
      .single();

    // create upvote
    if (!post.data) {
      return res.status(404);
    }
    await supabase.from("Upvotes").insert({
      upvoter: req.body.upvoter,
      post: req.body.postId,
      timestamp: new Date().getTime(),
    });

    // TODO: this should be a stored function in supabase
    await supabase
      .from("Posts")
      .update({ upvotes: post.data?.upvotes + 1 })
      .match({ _id: post.data._id });

    return res.json({ ...post.data, upvotes: post.data.upvotes + 1 });
  } else {
    return res.status(404);
  }
}

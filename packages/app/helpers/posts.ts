import supabase from "@/lib/supabase";

interface Post {
  _id: string;
  title: string;
  postedBy: string;
  url: string;
  domainText: string;
  upvotes: number;
  created_at: string;
  score: number;
  upvoted: boolean;
}

interface PostRanking {
  _id: string;
  title: string;
  postedBy: string;
  url: string;
  domainText: string;
  upvotes: number;
  created_at: string;
  score: number;
}

const sorting: Record<
  string,
  { column: keyof PostRanking | keyof Post; ascending: boolean }
> = {
  newest: {
    column: "created_at",
    ascending: false,
  },
  trending: {
    column: "score",
    ascending: false,
  },
};

export function queryPosts(
  sort: "newest" | "trending",
  address?: string | null
) {
  let limit = 25;
  let query = address
    ? supabase
        .rpc<Post>("user_posts_ranking", { address })
        .select("*")
        .limit(limit)
    : supabase.from<PostRanking>("post_rankings").select("*").limit(limit);

  if (sorting[sort]) {
    query = query
      .order(sorting[sort].column as any, {
        ascending: sorting[sort].ascending,
      })
      .order("_id", { ascending: true });
  }
  return query;
}

export async function loadPost(id: string, address?: string | null) {
  let query = address
    ? supabase.rpc<Post>("user_posts_ranking", { address }).select("*")
    : supabase.from<PostRanking>("post_rankings").select("*");
  const { data, error } = await query.eq("_id", id).limit(1).single();
  return data;
}

export async function loadPosts(
  sort: "newest" | "trending",
  address?: string | null
) {
  const query = queryPosts(sort, address);
  const { data: posts, error: postsError } = await query;
  return posts;
}

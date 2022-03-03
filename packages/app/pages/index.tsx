import type {NextPage} from "next";
import PostList from "@/components/PostList";
import {useStore} from "@/store/store";
import Title from "@/components/Title";
import StickyTabBar from "@/components/TabBar";
import {useQuery} from "react-query";
import supabase from "@/lib/supabaseClient";

const sorting: Record<string, {column: string; ascending: boolean}> = {
  newest: {
    column: "created_at",
    ascending: false,
  },
  trending: {
    column: "score",
    ascending: false,
  },
};

// TODO: if sort by newest
async function loadPosts(sort: string) {
  let query =
    sort === "trending"
      ? supabase.from("post_rankings").select("*").limit(25)
      : supabase.from("Posts").select("*").limit(25);

  if (sorting[sort]) {
    query = query
      .order(sorting[sort].column, {
        ascending: sorting[sort].ascending,
      })
      .order("_id", {ascending: true});
  }
  const {data: posts, error: postsError} = await query;
  return posts;
}

const Home: NextPage = () => {
  const {sort} = useStore();
  const {data: posts} = useQuery(["posts", sort], () => loadPosts(sort));

  return (
    <div>
      <Title>Today</Title>
      <StickyTabBar />
      <PostList posts={posts ?? []} sort={sort} />
    </div>
  );
};

export default Home;

export async function getStaticProps() {
  const initSupabaseClient = async () => {
    const {createClient} = await import("@supabase/supabase-js");
    const supabaseId = process.env.NEXT_PUBLIC_SUPABASE_KEY || "";
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const supabase = createClient(supabaseUrl, supabaseId, {
      schema: "public",
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    });
    return supabase;
  };
  const supabase = await initSupabaseClient();
  let {data: upvotes, error: upvotesError} = await supabase
    .from("Upvotes")
    .select("*");
  if (upvotes === null) {
    console.log(upvotesError);
    upvotes = [];
  }
  return {
    props: {
      initialZustandState: {
        upvotes,
      },
    },
    revalidate: 10,
  };
}

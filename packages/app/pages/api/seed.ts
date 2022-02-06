(global as any).WebSocket = require("isomorphic-ws");
import { NextApiRequest, NextApiResponse } from "next";
import { parse } from "rss-to-json";
import initMiddleware from "../../lib/init-middleware";
import Cors from "cors";
import { v4 as uuidv4} from "uuid";


import supabase from "@/lib/supabaseClient";
import { getUnixTime } from "date-fns";

export interface Post {
  _id: string;
  title: string;
  domainText: string;
  url: string;
  postedBy: string;
  timestamp: number;
  upvotes: number;
}

export interface Link {
  title: string;
  link: string
}

// Initialize the cors middleware
const cors = initMiddleware(
  Cors({
    // Only allow requests with GET, POST
    methods: ["GET", "POST"],
  })
);
//Mirror feeds to seed database
// Cabin, Krause House, MirrorDAO, Songcamp, Seed Club
const MirrorRSSFeedURLs = [
  ["mirror.xyz", "https://dao.submirror.xyz"],
  ["creatorcabins.com", "https://creators.submirror.xyz"],
  ["krausehouse.club", "https://krausehouse.submirror.xyz/"],
  ["songcamp.band", "https://songcamp.submirror.xyz/"],
  ["seedclub.xyz", "https://club.submirror.xyz/"],
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await cors(req, res);
  if (req.method === "POST") {
    try {
      const { authorization } = req.headers;
      if (
        authorization === `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_KEY}`
      ) {
        const fetchMirrorData = async (urlArray: string[][]) => {
          let transformedData = [];
          for (const arr of urlArray) {
            const domainText = arr[0];
            const rawData = await parse(arr[1], {});
            const postData: Post[] = await rawData.items.slice(0, 10).map((item: Link) => {
              return {
                _id: uuidv4(),
                title: item.title,
                url: item.link,
                domainText: domainText,
                postedBy: "0x0000000000000000000000000000000000000000",
                timestamp: getUnixTime(new Date()),
                upvotes: 0,
              };
            });
            transformedData.push(...postData);
          }
          return transformedData;
        };
        const fetchedPosts = await fetchMirrorData(MirrorRSSFeedURLs);
        let { data } = await supabase.from("Posts").select('*');
        if (data === null) {
          data = []
        }
        const concat = fetchedPosts.concat(data);

        //remove duplicates by converting to set
        const uniquePosts = new Set(concat);

        //convert back to array
        const uniquePostsArray = Array.from(uniquePosts);



        if (uniquePostsArray.length > 0) {
          const { data, error } = await supabase
            .from('Posts')
            .insert(uniquePostsArray);
          res.status(200).json({
            message: `${data.length} new posts added to database`,
            posts: uniquePostsArray,
          });
        } else {
          res.status(200).json({
            message: `No new posts added to database`,
          });
        }
      } else {
        res.status(401).json({ message: "Unauthorized access" });
      }
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}

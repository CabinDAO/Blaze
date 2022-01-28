import { NextApiRequest, NextApiResponse } from "next";
import { parse } from "rss-to-json";
import OrbitDB from "orbit-db";
import Ipfs from "ipfs";
import DCDB from "../../lib/db";
import initMiddleware from "../../lib/init-middleware";
import Cors from "cors";

// Initialize the cors middleware
const cors = initMiddleware(
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    methods: ["GET", "POST"],
  })
);
//Mirror feeds to seed database
// Cabin, Krause House, MirrorDAO, Songcamp, Seed Club
const MirrorRSSFeedURLs = [
  "https://dao.submirror.xyz",
  "https://creators.submirror.xyz",
  "https://krausehouse.submirror.xyz/",
  "https://songcamp.submirror.xyz/",
  "https://club.submirror.xyz/",
];
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await cors(req, res);
  if (req.method === "POST") {
    try {
      // const { authorization } = req.headers;
      // if (authorization === `Bearer ${process.env.API_SECRET_KEY}`) {
      //   let rss = await parse(MirrorRSSFeedURLs[0], {
      //     transformRequest: (data) => {
      //       data.items = data.items.slice(0, 10);
      //       return data;
      //     }
      //   });
      //   res.status(200).json(rss);
      // } else {
      //   res
      //     .status(401)
      //     .json({ success: false, message: "Unauthorized access" });
      // }
      const rawData1 = await parse(MirrorRSSFeedURLs[0], {});
      const rawData2 = await parse(MirrorRSSFeedURLs[1], {});
      const rawData3 = await parse(MirrorRSSFeedURLs[2], {});
      const rawData4 = await parse(MirrorRSSFeedURLs[3], {});
      const linkData1 = rawData1.items.slice(0, 10).map((item) => {
        return {
          title: item.title,
          url: item.link,
        };
      });
      const linkData2 = rawData1.items.slice(0, 10).map((item) => {
        return {
          title: item.title,
          url: item.link,
 
        };
      });
      const linkData3 = rawData1.items.slice(0, 10).map((item) => {
        return {
          title: item.title,
          url: item.link,
        };
      });
      const linkData4 = rawData1.items.slice(0, 10).map((item) => {
        return {
          title: item.title,
          url: item.link,
        };
      });
      const combinedData = [...linkData1, ...linkData2, ...linkData3, linkData4];

      let newLinks = [];
      combinedData.forEach(obj =>
        newLinks.push(DCDB.addNewLink(obj.title, obj.url))
      );
      Promise.all(newLinks).then((links) =>
        res.status(200).json({ status: "success", newLinks: links })
      );
    } catch (err) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}

(global as any).WebSocket = require("isomorphic-ws");
import { NextApiRequest, NextApiResponse } from "next";
import urlMetadata from 'url-metadata';


/** Fetch metadata from any URL */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    urlMetadata(req.body.url).then(
    (metadata: Object) => {
      res.status(200).json(metadata);
    },
    (error: any) => { 
      res.status(500).json({ message: error });
    });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}

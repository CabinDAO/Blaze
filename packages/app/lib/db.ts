import {
  Client,
  PrivateKey,
  UserAuth,
  createUserAuth,
  KeyInfo,
  ThreadID,
  QueryJSON,
} from "@textile/hub";

export const ProfileSchema = {
  $id: "www.creatorcabins.com/profile.json",
  $schema: "http://json-schema.org/draft-07/schema#",
  description: "User profiles for users of the application",
  type: "object",
  properties: {
    _id: {
      type: "string",
      description: "The unique identifier for the user profile",
    },
    walletAddress: {
      type: "string",
      description: "The wallet address of the user",
    },
    joinDate: {
      type: "number",
      description: "The date the user first logged in to the application",
    },
    lastSeenDate: {
      type: "number",
      description: "The date the user last logged in to the application",
    },
    upvotesReceived: {
      type: "number",
      description: "The number of upvotes received by the user",
    },
    linksUpvoted: {
      type: "number",
      description: "The links upvoted by the user",
    },
  },
  required: ["_id", "walletAddress"],
};
export const LinkSchema = {
    $id: "www.creatorcabins.com/links.json",
    $schema: "http://json-schema.org/draft-07/schema#",
    description: " RSS feed links for the application",
    type: "object",
    properties: {
        _id: {
            type: "string",
            description: "The unique identifier for the link",
        },
        title: {
            type: "string",
            description: "The title of the link",
        },
        url: {
            type: "string",
            description: "The url of the link",
        },
        postedBy: {
            type: "string",
            description: "The wallet address of the user",
        },
        timeStamp: {
            type: "number",
            description: "The date the link was submitted",
        },
        upvotes: {
            type: "number",
            description: "The number of upvotes the link has received",
        },
    },
    required: ["_id", "postedBy", "timeStamp", "title", "url"],  
};
export const UpvoteSchema = {
  $id: "www.creatorcabins.com/links.json",
  $schema: "http://json-schema.org/draft-07/schema#",
  description: "Upvotes given by the users of the application",
  type: "object",
  properties: {
    _id: {
      type: "string",
      description: "The unique identifier for the upvote",
    },
    upvoter: {
      type: "string",
      description: "The profile id of the user who upvoted the link",
    },
    timeStamp: {
      type: "number",
      description: "The date the upvote was given",
    },
    link: {
      type: "string",
      description: "The link id of the link that was upvoted",
    },
  },
  required: ["_id", "upvoter", "timeStamp", "link"],
};

export const setupThreadClient = async (auth: UserAuth) => {
  const client = await Client.withUserAuth(auth);
  return client;
};
export const auth = async (keyInfo: KeyInfo) => {
  // Create an expiration and create a signature. 60s or less is recommended.
  const expiration = new Date(Date.now() + 60 * 1000);
  // Generate a new UserAuth
  const userAuth: UserAuth = await createUserAuth(
    keyInfo.key,
    keyInfo.secret ?? "",
    expiration
  );
  return userAuth;
};
export const newUserToken = async (client: Client, user: PrivateKey) => {
  const token = await client.getToken(user);
  return token;
};

export const createDB = async (client: Client) => {
  const thread: ThreadID = await client.newDB();
  return thread;
};

export const createCollection = async (
  client: Client,
  threadID: ThreadID,
  collectionName: string,
  schema: any
) => {
  const collection = await client.newCollection(threadID, {
    name: collectionName,
    schema: schema,
  });
};

export const createInstance = async (
  client: Client,
  threadID: ThreadID,
  collectionName: string,
  data: any
) => {
  const created = await client.create(threadID, collectionName, data);
  return created;
};

export const createQuery = async (
  client: Client,
  collectionName: string,
  threadID: ThreadID,
  query: QueryJSON
) => {
  const results = client.find(threadID, collectionName, query);
  return results;
};

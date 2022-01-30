import {
  Client,
  PrivateKey,
  UserAuth,
  createUserAuth,
  KeyInfo,
  ThreadID,
  QueryJSON,
} from "@textile/hub";

/*
type Profile @entity {
  id: ID!
  walletAddress: String!
  joinDate: DateTime!
  lastSeenDate: DateTime!
  upvotesReceived: [Upvote]
  linksUpvoted: [Post]

}

type Links @entity {
  id: ID!
  postedBy: Profile!
  timeStamp: DateTime!
  title: String!
  url: String!
  upvotes: [Upvote]
  comments: [Comment]
}

type Comment @entity {
  id: ID!
  postedBy: Profile
  timeStamp: DateTime!
  text: String!
  link: Link!
  upvotes: [Upvote]
  comments: [Comment]
}

type Upvote @entity {
  id: ID!
  upvoter: Profile!
  timeStamp: DateTime!
  link: Link
  comment: Comment
}

*/

const profileSchema = {
  $id: "www.creatorcabins.com/profile.json",
  $schema: "http://json-schema.org/draft-07/schema#",
  description: "User profiles for users of the dao-camp application",
  type: "object",
  properties: {
    id: {
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
      type: "array",
      description: "The upvotes received by the user",
      items: {
        $ref: "#/definitions/Upvote",
      },
    },
    linksUpvoted: {
      type: "array",
      description: "The links upvoted by the user",
      items: {
        $ref: "#/definitions/Link",
      },
    },
  },
  required: ["id", "walletAddress"],
};
const linkSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
};
const upvoteSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
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

export const createQuery = (
  client: Client,
  collectionName: string,
  threadID: ThreadID,
  query: QueryJSON
) => {
  const results = client.find(threadID, collectionName, query);
  return results;
};

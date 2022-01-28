import { ApolloServer } from "apollo-server-micro";
import { schema } from "../../graphql/schema";
import { context } from "../../graphql/context";

const server = new ApolloServer({ schema, context });
const handler = server.createHandler({ path: "/api/graphql" });

export default handler;

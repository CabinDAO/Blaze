import { makeExecutableSchema } from "@graphql-tools/schema";
import typeDefs from "./typedefs";
import resolvers from "./resolvers";

export const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});
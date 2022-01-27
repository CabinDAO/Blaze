const typeDefs: string = /* GraphQL */ `
  type Profile @entity {
    id: ID!
    walletAddress: String!
    joinDate: DateTime!
    lastSeenDate: DateTime!
    upvotesReceived: [Upvote]
    linksUpvoted: [Post]
  }

  type Link @entity {
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
  schema {
    query: Query
    mutation: Mutation
  }
`;
export default typeDefs;

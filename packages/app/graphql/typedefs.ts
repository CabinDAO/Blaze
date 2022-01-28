/*
log: 	An immutable (append-only) log with traversable history. Useful for "latest N"    use cases or as a message queue.
feed:  	A mutable log with traversable history. Entries can be added and removed. Useful  for "shopping cart" type of use cases, or for example as a feed of blog posts or "tweets".
keyvalue: 	A simple key-value database that supports any JSON-serializable data, even nested objects.
docs 	A document database that stores JSON documents which can be indexed by a specified key. Useful for building search indices or version controlling documents and data.
counter 	An increment-only integer counter useful for counting events separate from log/feed data.
*/

//stores needed for the app:
  //1.Profile keyvalue store
  //2.Log store for links
  //3.Log store for upvotes

const typeDefs: string = /* GraphQL */ ` 
  type Profile # OrbitDB kvstore
    @entity { 
    id: ID!
    walletAddress: String!
    joinDate: DateTime!
    lastSeenDate: DateTime!
    upvotesReceived: [Upvote] # OrbitDB log of upvotes Id's
    linksUpvoted: [Post] # OrbitDB log of upvoted link Id's
  }

  type Link
    @entity { # OrbitDB log entry
    id: ID!
    postedBy: String # Shortend URL string
    timeStamp: DateTime!
    title: String!
    url: String!
    upvotes: [Upvote] # OrbitDB log of upvotes Id's
    # comments: [Comment]
  }

 # type Comment @entity {
   # id: ID!
    #postedBy: Profile 
    #timeStamp: DateTime!
    #text: String!
   #link: Link!
   # upvotes: [Upvote]
    #comments: [Comment]
  }

  type Upvote @entity { # OrbitDB log entry
    id: ID!
    upvotedBy: Profile! # OrbitDB Profile by id
    timeStamp: DateTime!
    link: Link # OrbitDB link by id
    # comment: Comment
  }
  schema {
    query: Query
    mutation: Mutation
  }
`;
export default typeDefs;

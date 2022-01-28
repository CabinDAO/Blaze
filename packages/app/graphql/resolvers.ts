const OrbitDB = require('orbit-db');
const Ipfs = require('ipfs');
const DaoCampDb = require('./scripts/db');
const DCDB = new DaoCampDb(Ipfs, OrbitDB);

const resolverMap = {
  Query: {
    links: async () => {
      //load most recent version of link store
      //return list of all links

    },
    profile: async (id) => {
      //get profile by id from orbitdb
    },
  },
  Mutuation: {
    createProfile: async (id) => {},
    upvoteLink: async (_, { id: id }) => {
    },
  },
  Profile: {
    walletAddress: async (profile) => {
      //get wallet address from orbitdb
    },
    joinDate: async (profile) => {
      //get join date from orbitdb
    },
    lastSeenDate: async (profile) => {
      //get last seen date from orbitdb
    },
    upvotesReceived: async (profile) => {
      //get upvotes received from orbitdb
    },
    linksUpvoted: async (profile) => {
      //get links upvoted from orbitdb
    }
  },
  Link: {
    postedBy: async (link) => {
      //get posted by from orbitdb
    },
    timeStamp: async (link) => {
      //get time stamp from orbitdb
    },
    title: async (link) => {
      //get title from orbitdb
    },
    url: async (link) => {
      //get url from orbitdb
    },
    upvotes: async (link) => {
      //get upvotes from orbitdb
    },
    // comments: async (link) => {
    //   //get comments from orbitdb
    // },
  },
  // Comment: {
  //   postedBy: async (comment) => {
  //     //get posted by from orbitdb
  //   },
  //   timeStamp: async (comment) => {
  //     //get time stamp from orbitdb
  //   },
  //   text: async (comment) => {
  //     //get text from orbitdb
  //   },
  //   link: async (comment) => {
  //     //get link from orbitdb
  //   },
  //   upvotes: async (comment) => {
  //     //get upvotes from orbitdb
  //   },
  //   comments: async (comment) => {
  //     //get comments from orbitdb
  //   }
  // },
  Upvote: {
    upvoter: async (upvote) => {
      //get upvoter from orbitdb
    },
    timeStamp: async (upvote) => {
      //get time stamp from orbitdb
    },
    link: async (upvote) => {
      //get link from orbitdb
    },
    // comment: async (upvote) => {
    //   //get comment from orbitdb
    // },
  }
};
export default resolvers;
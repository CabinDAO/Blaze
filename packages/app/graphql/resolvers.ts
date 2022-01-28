const OrbitDB = require('orbit-db');
const Ipfs = require('ipfs');
const DaoCampDb = require('./lib/orbit-db');
const DCDB = new DaoCampDb(Ipfs, OrbitDB);

const resolvers = {
  Query: {
    links: async () => {
      await DCDB.load();
      const links = await DCDB.links.query();
      await DCDB.close();
      //return links
      return links;
    },
    profile: async (profileId) => {
      await DCDB.load();
      const profile = await DCDB.profiles.get(profilId);
      await DCDB.close();
      return profile;
    },
  },
  Mutuation: {
    createProfile: async (walletAddress) => {
      await DCDB.load();
      const profile = await DCDB.createProfile(walletAddress);
      await DCDB.close();
      return profile;
    },
    upvoteLink: async (_, { id: id }) => {
      await DCDB.load();
      const upvote = await DCDB.upvoteLink(id);
      await DCDB.close();
      return upvote;
    },
  },
  Profile: {
    walletAddress: async (profile) => {
      await DCDB.load();
      const profile = await DCDB.profiles.get(profile.id);
      await DCDB.close();
      return profile.walletAddress;
    },
    joinDate: async (profile) => {
      await DCDB.load();
      const profile = await DCDB.profiles.get(profile.id);
      await DCDB.close();
      return profile.joinDate;
    },
    lastSeenDate: async (profile) => {
      await DCDB.load();
      const profile = await DCDB.profiles.get(profile.id);
      await DCDB.close();
      return profile.lastSeenDate;
    },
    upvotesReceived: async (profile) => {
      await DCDB.load();
      const profile = await DCDB.profiles.get(profile.id);
      await DCDB.close();
      return profile.upvotesReceived.value;
    },
    linksUpvoted: async (profile) => {
      await DCDB.load();
      const profile = await DCDB.profiles.get(profile.id);
      await DCDB.close();
      return profile.linksUpvoted.value;
    },
  },
  Link: {
    postedBy: async (link) => {
      await DCDB.load();
      const link = await DCDB.links.get(link.id);
      await DCDB.close();
      return link.postedBy;
    },
    timeStamp: async (link) => {
      await DCDB.load();
      const link = await DCDB.links.get(link.id);
      await DCDB.close();
      return link.timeStamp;
    },
    title: async (link) => {
      await DCDB.load();
      const link = await DCDB.links.get(link.id);
      await DCDB.close();
      return link.title;
    },
    url: async (link) => {
      await DCDB.load();
      const link = await DCDB.links.get(link.id);
      await DCDB.close();
      return link.url;
    },
    upvotes: async (link) => {
      await DCDB.load();
      const link = await DCDB.links.get(link.id);
      await DCDB.close();
      return link.upvotes.value;
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
    upvotedBy: async (upvote) => {
      await DCDB.load();
      const upvote = await DCDB.upvotes.get(upvote.id);
      await DCDB.close();
      return upvote.upvotedBy;
    },
    timeStamp: async (upvote) => {
      await DCDB.load();
      const upvote = await DCDB.upvotes.get(upvote.id);
      await DCDB.close();
      return upvote.timeStamp;
    },
    link: async (upvote) => {
      await DCDB.load();
      const upvote = await DCDB.upvotes.get(upvote.id);
      await DCDB.close();
      return upvote.link;
    },
    // comment: async (upvote) => {
    //   //get comment from orbitdb
    // },
  },
};
export default resolvers;
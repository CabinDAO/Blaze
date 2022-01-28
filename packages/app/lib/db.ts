const { v4 } = require("uuid");
const { getUnixTime } =  require("date-fns");

class DaoCampDb {
  constructor(Ipfs, OrbitDB) {
    this.Ipfs = Ipfs;
    this.OrbitDB = OrbitDB;
  }
  async create() {
    this.node = await this.Ipfs.create({
      preload: { enabled: false },
      repo: "./ipfs",
      EXPERIMENTAL: { pubsub: true },
      config: {
        Bootstrap: [],
        Addresses: { Swarm: [] },
      },
    });

    this._init();
  }

  async _init() {
    this.orbitdb = await this.OrbitDB.createInstance(this.node);
    this.defaultOptions = {
      accessController: {
        write: [this.orbitdb.identity.id],
      },
    };
    this.profiles = await this.orbitdb.docstore(
      "profiles",
      this.defaultOptions
    );
    this.links = await this.orbitdb.docstore("links", this.defaultOptions);
    this.upvotes = await this.orbitdb.docstore("upvotes", this.defaultOptions);
    await this.profiles.load();
    await this.links.load();
    await this.upvotes.load();
    if (this.onready) this.onready();
  }

  async createProfile(walletAddress) {
    const upvotesStoreName = `${walletAddress}-upvotes-received`;
    const upvotedStoreName = `${walletAddress}-links-upvoted`;

    const counter1 = await this.orbitdb.counter(
      upvotesStoreName,
      this.defaultOptions
    );
    const counter2 = await this.orbitdb.counter(
      upvotedStoreName,
      this.defaultOptions
    );

    const profile = {
      _id: walletAddress,
      walletAddress: walletAddress,
      joinDate: getUnixTime(new Date()),
      lastSeenDate: getUnixTime(new Date()),
      upvotesReceived: counter1.id,
      linksUpvoted: counter2.id,
    };
    const cid = await this.profiles.put(profile);
    return cid;
  }

  async updateLastSeenDate(walletAddress) {
    const profile = await this.profiles.get(walletAddress);
    const cid = await this.profiles.put(walletAddress, {
      ...profile,
      lastSeenDate: getUnixTime(new Date()),
    });
    return cid;
  }

  async addNewLink(title, url) {
    const id = v4();
    const upvotesStoreName = `${id}-link-upvotes-received`;
    const counter = await this.orbitdb.counter(
      upvotesStoreName,
      this.defaultOptions
    );
    const link = {
      _id: id,
      title: title,
      postedBy: url,
      url: url,
      timeStamp: getUnixTime(new Date()),
      upvotes: counter.id,
    };
    await this.links.put(link);
    return link;
  }

  async upvoteLink(walletAddress, linkId) {
    const profile = await this.profiles.get(walletAddress);
    const link = await this.links.get(linkId);
    const counter = await this.orbitdb.counter(
      link.counter,
      this.defaultOptions
    );
    await counter.load();
    const cid = await counter.inc();
    const upvote = {
      id: v4(),
      upvotedBy: profile.id,
      timeStamp: getUnixTime(new Date()),
      link: link.id,
    };
    await this.upvotes.put(upvote);
    return link;
  }
  async getProfile(profileId) {
    return await this.profiles.get(profileId);
  }

  async getLinks() {
    return await this.links.query((q) => q.orderBy("timeStamp", "desc"));
  }

  async getLink(linkId) {
    return await this.links.get(linkId);
  }

  async getLinkUpvotes(linkId) {
    return await this.upvotes.query((q) => q.link === linkId);
  }

  async getUpvotedLinks(walletAddress) {
    const profile = await this.profiles.get(walletAddress);
    return await this.upvotes.query((q) => q.upvotedBy === profile.id);
  }
  async getSubmittedLinks(walletAddress) {
    const profile = await this.profiles.get(walletAddress);
    return await this.links.query((q) => q.postedBy === profile.id);
  }

  // async getUpvotesReceived(profileId) {}
  // async getLinksSubmitted(profileId) {}

  async getLinkUpvotes(linkId) {
    const upvotes = await this.upvotes.query((q) => q.link === linkId);
    return upvotes;
  }

  async getUpvoter(upvoteId) {
    const upvote = await this.upvotes.get(upvoteId);
    return upvote.upvotedBy;
  }

  async getUpvoteTimeStamp(upvoteId) {
    const upvote = await this.upvotes.get(upvoteId);
    return upvote.timeStamp;
  }

  async getUpvotedLink(upvoteId) {
    const upvote = await this.upvotes.get(upvoteId);
    return upvote.link;
  }
 }

if (typeof window !== undefined) {
  const Ipfs = require('ipfs');
  const OrbitDB = require('orbit-db');
  const DCDB = new DaoCampDb(Ipfs, OrbitDB);
  DCDB.create();
  DCDB.onready = () => {
    console.log(DCDB.orbitdb.id);
  };
  module.exports = exports = DCDB;
} else {
  window.NPP = new DaoCampDb(window.Ipfs, window.OrbitDB);
 }


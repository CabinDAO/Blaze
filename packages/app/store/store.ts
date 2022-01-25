import create from "zustand";
import { v4 as uuidV4 } from "uuid";
import AppState, { Sort } from "@/types";

export const useStore = create<AppState>((set) => ({
  posts: [
    {
      id: uuidV4(),
      title:
        "Design with Community in Mind: Cabin Core Contributor Mel Shields",
      domainText: "www.cabincreators.com",
      url: "www.creatorcabins.com",
      walletAddress: "0x0000000000000000000000000000000000000000",
      submissionDate: 1642774657,
      numberOfComments: 5,
      numberOfUpvotes: 10,
    },
    {
      id: uuidV4(),
      title: "A brief history of decentralized cities and centralized states",
      domainText: "www.cabincreators.com",
      url: "www.creatorcabins.com",
      walletAddress: "0x0000000000000000000000000000000000000000",
      submissionDate: 1642763857,
      numberOfComments: 0,
      numberOfUpvotes: 0,
    },
    {
      id: uuidV4(),
      title: "ConstitutionDAO: We Lost the Battle, But Will Win the War",
      domainText: "www.cabincreators.com",
      url: "www.creatorcabins.com",
      walletAddress: "0x0000000000000000000000000000000000000000",
      submissionDate: 1642591057,
      numberOfComments: 27,
      numberOfUpvotes: 100,
    },
    {
      id: uuidV4(),
      title: "Growing the Writer’s Guild: Cabin Core Contributor Roxine Kee",
      domainText: "www.cabincreators.com",
      url: "www.creatorcabins.com",
      walletAddress: "0x0000000000000000000000000000000000000000",
      submissionDate: 1642504657,
      numberOfComments: 9,
      numberOfUpvotes: 1943,
    },
    {
      id: uuidV4(),
      title: "Building a Decentralized City: Cabin Core Contributor Phil Levin",
      domainText: "www.cabincreators.com",
      url: "www.creatorcabins.com",
      walletAddress: "0x0000000000000000000000000000000000000000",
      submissionDate: 1642527043,
      numberOfComments: 13,
      numberOfUpvotes: 376,
    },
    {
      id: uuidV4(),
      title: "Around the Campfire, Cabin Contributor Jon Hillis",
      domainText: "www.cabincreators.com",
      url: "www.creatorcabins.com",
      walletAddress: "0x0000000000000000000000000000000000000000",
      submissionDate: 1643121108,
      numberOfComments: 43,
      numberOfUpvotes: 66,
    },
  ],
  sort: "newest",
  updateSort: (sort: Sort) => set({ sort }),
  upvotePost: (postId: string) => {
    set((state) => {
      const post = state.posts.find((post) => post.id === postId);
      if (post) {
        post.numberOfUpvotes += 1;
      }

      return { posts: state.posts };
    });
  },
}));

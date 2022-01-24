import create from 'zustand'
import PostListProps, {AppState, PostProps} from '@/types'

export const useStore = create<AppState>((set) => ({
    posts: [
  {
    title: "Design with Community in Mind: Cabin Core Contributor Mel Shields",
    domainText: "www.cabincreators.com",
    url: "www.creatorcabins.com",
    walletAddress: "0x0000000000000000000000000000000000000000",
    submissionDate: 6,
    numberOfComments: 5,
    numberOfUpvotes: 10,
  },
  {
    title: "A brief history of decentralized cities and centralized states",
    domainText: "www.cabincreators.com",
    url: "www.creatorcabins.com",
    walletAddress: "0x0000000000000000000000000000000000000000",
    submissionDate: 5,
    numberOfComments: 0,
    numberOfUpvotes: 0,
  },
  {
    title: "ConstitutionDAO: We Lost the Battle, But Will Win the War",
    domainText: "www.cabincreators.com",
    url: "www.creatorcabins.com",
    walletAddress: "0x0000000000000000000000000000000000000000",
    submissionDate: 4,
    numberOfComments: 27,
    numberOfUpvotes: 100,
  },
  {
    title: "Growing the Writer’s Guild: Cabin Core Contributor Roxine Kee",
    domainText: "www.cabincreators.com",
    url: "www.creatorcabins.com",
    walletAddress: "0x0000000000000000000000000000000000000000",
    submissionDate: 3,
    numberOfComments: 9,
    numberOfUpvotes: 1943,
  },
  {
    title: "Building a Decentralized City: Cabin Core Contributor Phil Levin",
    domainText: "www.cabincreators.com",
    url: "www.creatorcabins.com",
    walletAddress: "0x0000000000000000000000000000000000000000",
    submissionDate: 2,
    numberOfComments: 13,
    numberOfUpvotes: 376,
  },
  {
    title: "Around the Campfire, Cabin Contributor Jon Hillis",
    domainText: "www.cabincreators.com",
    url: "www.creatorcabins.com",
    walletAddress: "0x0000000000000000000000000000000000000000",
    submissionDate: 1,
    numberOfComments: 43,
    numberOfUpvotes: 66,
  },
],
    sort: "newest",
    updateSort: (sort: AppState["sort"]) => set({sort}),
}));
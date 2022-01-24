import { Context } from 'react';

export interface PostProps {
  title: string,
  domainText: string,
  url: string,
  walletAddress: string,
  submissionDate: number,
  numberOfComments: number,
  numberOfUpvotes: number,
}
export interface AppState {
  posts: PostProps[],
  sort: "newest" | "trending" | "controversial",
  updateSort: (sort: "newest" | "trending") => void,
}

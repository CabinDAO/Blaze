export interface PostProps {
  title: string,
  domainText: string,
  url: string,
  walletAddress: string,
  submissionDate: number,
  numberOfComments: number,
  numberOfUpvotes: number,
}
export default interface PostListProps {
  posts: PostProps[],
}
export interface AppState {
  posts: PostListProps,
  sort: "newest" | "trending" | "controversial",
  updateSort: (sort: "newest" | "trending") => void,
}

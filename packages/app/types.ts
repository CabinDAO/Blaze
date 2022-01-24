export interface PostProps {
  title: string,
  domainText: string,
  url: string,
  walletAddress: string,
  submissionDate: number,
  numberOfComments: number,
  numberOfUpvotes: number,
}
export type PostListProps =  PostProps[];
export type Sort =  "newest" | "trending" | "controversial";
export default interface AppState {
  posts: PostListProps;
  sort: Sort;
  updateSort: (sort: Sort) => void;
}

export interface PostProps {
  _id: string;
  title: string,
  domainText: string,
  url: string,
  postedBy: string,
  timeStamp: number,
  numberOfComments: number,
  numberOfUpvotes: number,
}
export type PostListProps =  PostProps[];
export type Sort =  "newest" | "trending" | "controversial";
export default interface AppState {
  posts: PostListProps;
  sort: Sort;
  updateSort: (sort: Sort) => void;
  upvotePost: (postId: string) => void;
}

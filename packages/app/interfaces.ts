export interface IPost {
  _id: string;
  title: string;
  domainText: string;
  url: string;
  postedBy: string;
  created_at: string;
  upvotes: number;
  upvoted?: boolean;
}

export interface IComment {
  _id: string;
  text: string;
  postedBy: string;
  postId?: string;
  parentCommentId?: string;
  created_at: string;
  subcomments?: IComment[];
  upvotes: number;
  upvoted?: boolean;
}

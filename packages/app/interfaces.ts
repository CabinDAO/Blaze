export interface IPost {
  _id: string;
  title: string;
  domainText: string;
  url: string;
  postedBy: string;
  created_at: string;
  upvotes: number;
}

export interface IPostComment {
  _id: string;
  postId: string;
  text: string;
  postedBy: string;
  created_at: string;
  comments?: ICommentComment[];
  upvotes: number;
  upvoted?: boolean;
}

export interface ICommentComment {
  _id: string;
  text: string;
  postedBy: string;
  created_at: string;
  upvotes: number;
  upvoted?: boolean;
}

export interface IPost {
  _id: string;
  title: string;
  domainText: string;
  url: string;
  postedBy: string;
  created_at: string;
  comments: IComment[] | null;
  upvotes: number;
  upvoted?: boolean;
}

export interface IComment {
  _id: string;
  text: string;
  postedBy: string;
  created_at: string;
  subcomments: IComment[] | null;
  upvotes: number;
  upvoted?: boolean;
}

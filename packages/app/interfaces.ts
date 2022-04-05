export interface IPost {
  _id: string;
  title: string;
  domainText: string;
  url: string;
  postedBy: string;
  created_at: string;
  upvotes: number;
}

export interface IComment {
  _id: string;
  text: string;
  postedBy: string;
  created_at: string;
  upvotes: number;
  upvoted?: boolean;
}

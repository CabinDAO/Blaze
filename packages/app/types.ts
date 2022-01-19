export interface PostListProps {
    posts: {
      title: string;
      domainText: string;
      url: string;
      walletAddress: string;
      submissionDate: number;
      numberOfComments: number;
    }[];
    sort: "newest" | "trending";
  }
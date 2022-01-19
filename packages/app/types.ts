export default interface PostListProps {
    posts: {
      title: string;
      domainText: string;
      url: string;
      walletAddress: string;
      submissionDate: number;
      numberOfComments: number;
    }[];
  }

  export interface Option {
    text: string;
    value: string;
  }
  export interface SelectProps {
    options: Option[];
    sortHandler: (sort: "newest"|"trending") => void;
  }
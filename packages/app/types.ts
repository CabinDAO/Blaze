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
export default interface PostListProps {
  posts: PostProps []
}

export interface SortContext {
  sortType: {
    text: string;
    value: string;
  };
  changeSortType: (sortType: {text: string, value: string}) => void;
}

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
  posts: PostProps[],
  sort: SortContext['sortType']
}

export interface SortContext {
  sortType: {
    key: string;
    label: string;
  };
  setSortType: (sortType: {key: string, label: string}) => void;
}

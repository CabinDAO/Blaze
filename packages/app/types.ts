import { Context } from 'react';

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
export interface DropdownProps {
  options: Option[];
}

export interface SortContext {
  sortType: {
    text: string;
    value: string;
  };
  changeSortType: (sortType: {text: string, value: string}) => void;
}

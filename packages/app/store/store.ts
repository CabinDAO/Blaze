import { useLayoutEffect } from "react";
import create from "zustand";
import createContext from "zustand/context";


/* @type { import('zustand/index').UseStore<typeof initialState>} */
let store: any;

export interface Post {
  _id: string;
  title: string;
  domainText: string;
  url: string;
  postedBy: string;
  timestamp: number;
  upvotes: number;
}
export type PostList = Post[];
export type Sort = "newest" | "trending" | "controversial";
export type Profile =  {
  _id: string ;
  walletAddress: string ;
  joinDate: number ;
  lastSeenDate: number ;
  upvotesReceived: number ;
  postsUpvoted: number ;
} | null;
export interface Upvote {
  _id: string;
  upvoter: string;
  timestamp: number;
  link: string;
}
export interface InitialState {
  sort: Sort;
  currentProfile: object;
  isLoggedIn: boolean;
}
const initialState: InitialState = {
  sort: "newest",
  currentProfile: {},
  isLoggedIn: false,
}

export default interface AppState {
  posts: PostList;
  sort: Sort;
  upvotes: Upvote[];
  currentProfile: Profile;
  isLoggedIn: boolean;
  updateSort: (sort: Sort) => void;
  upvotePostinStore: (postId: string) => PostList;
  loadProfileIntoStore: (profile: Profile) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}
const zustandContext = createContext<AppState>();
export const Provider = zustandContext.Provider;
export const useStore = () => zustandContext.useStore();
export const initializeStore = (preloadedState = {}) => {
  return create((set: any) => ({
    ...initialState,
    ...preloadedState,
    updateSort: (sort: Sort) => set({ sort }),
    upvotePostinStore: (postId: string) => {
      set((state: AppState) => {
        const post = state.posts.find((post: Post) => post._id === postId);
        if (post) {
          post.upvotes += 1;
        }

        return { posts: state.posts };
      });
    },
    loadProfileIntoStore: (profile: Profile) => {
      set({ currentProfile: profile });
    },
    setIsLoggedIn: (isLoggedIn: boolean) => {
      set({ isLoggedIn });
    },
  }));
};

export function useCreateStore(initialState: { sort: string }) {
  // For SSR & SSG, always use a new store.
  if (typeof window === "undefined") {
    return () => initializeStore(initialState);
  }

  // For CSR, always re-use same store.
  store = store ?? initializeStore(initialState);
  // And if initialState changes, then merge states in the next render cycle.
  //
  // eslint complaining "React Hooks must be called in the exact same order in every component render"
  // is ignorable as this code runs in same order in a given environment
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useLayoutEffect(() => {
    if (initialState && store) {
      store.setState({
        ...store.getState(),
        ...initialState,
      });
    }
  }, [initialState]);

  return () => store;
}
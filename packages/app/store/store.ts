import { useLayoutEffect } from "react";
import create from "zustand";
import createContext from "zustand/context";
import AppState, { Sort, PostProps } from "@/types";

/* @type { import('zustand/index').UseStore<typeof initialState>} */
let store;

const initialState = {
  sort: "newest",
}
const zustandContext = createContext();
export const Provider = zustandContext.Provider;
export const useStore = () => zustandContext.useStore();
export const initializeStore = (preloadedState = {}) => {
  return create((set, get) => ({
    ...initialState,
    ...preloadedState,
    updateSort: (sort: Sort) => set({ sort }),
    upvotePost: (postId: string) => {
      set((state: AppState) => {
        const post = state.posts.find((post: PostProps) => post._id === postId);
        if (post) {
          post.numberOfUpvotes += 1;
        }

        return { posts: state.posts };
      });
    },
  }));
}; 

export function useCreateStore(initialState: {sort: string}) {
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
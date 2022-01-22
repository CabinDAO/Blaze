import { createContext, Context, useState, FC } from "react";
import {SortContext} from "@/types"

  const SortCtx: Context<SortContext> = createContext<SortContext>({
    sortType: { key: "", label: "" },
    setSortType: () => {},
  });

const SortProvider: FC = ({ children }) => {
  const [sortType, setSortType] = useState<SortContext["sortType"]>({ key: "newest", label: "Newest" })
  const value = { sortType, setSortType };

  
  return <SortCtx.Provider value={value}>{children}</SortCtx.Provider>
}

export default SortProvider;
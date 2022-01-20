import { createContext, Context, useState, FC } from "react";
import {SortContext} from "@/types"

export const SortCtx: Context<SortContext> = createContext<SortContext>({sortType: "newest", setSortType: () => {}});

export const SortProvider: FC = ({ children }) => {
    const [sortType, setSortType] = useState<SortContext["sortType"]>("newest");
    const changeSortType = (sortType: SortContext["sortType"]) => {
        setSortType(sortType);
    }
    return <SortCtx.Provider value={{sortType, setSortType: changeSortType}}>{children}</SortCtx.Provider>
}

export default SortProvider;
import { createContext, Context, useState, FC } from "react";
import {SortContext} from "@/types"

const SortCtx: Context<SortContext> = createContext<SortContext>({sortType: {key: "", label: ""}, changeSortType: () => {}});

export const SortProvider: FC = ({ children }) => {
    const [sortType, setSortType] = useState<SortContext["sortType"]>({
      key: "newest",
      label: "Newest",
    });
    const changeSortType = (newSortType: SortContext["sortType"]) => {
        setSortType(newSortType);
    }
    return <SortCtx.Provider value={{sortType, changeSortType}}>{children}</SortCtx.Provider>
}

export default SortCtx;
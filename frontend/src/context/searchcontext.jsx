import { children, createContext, useContext, useState } from "react";
const searchContext = createContext();
export const SearchProvider = ({children})=>{
    const [search, setSearch] = useState("");
    return(
        <searchContext.Provider value={{search,setSearch}}>
            {children}
        </searchContext.Provider>
    );
};
export const useSearch = () => useContext(searchContext);
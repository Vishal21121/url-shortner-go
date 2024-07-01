import { createContext, useContext } from "react";

const UrlContext = createContext();

const useUrlContext = () => {
  return useContext(UrlContext);
};

export { UrlContext, useUrlContext };

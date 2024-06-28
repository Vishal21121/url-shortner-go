import { createContext, useContext } from "react";

const UserContext = createContext({
  user: null,
  loginUser: () => {},
  registerUser: () => {},
  logOut: () => {},
});

const useUserContext = () => {
  return useContext(UserContext);
};

export { UserContext, useUserContext };

import React, { useEffect, useState } from "react";
import { UrlContext } from "./urlContext";

function UrlContextProvider({ children }) {
  const [urls, setUrls] = useState(null);

  const fetchUrls = async (userId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URI}/api/v1/urls/get?userId=${userId}`
      );
      const data = await response.json();
      console.log("urls", data);
      setUrls(data.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <UrlContext.Provider value={{ urls, setUrls, fetchUrls }}>
      {children}
    </UrlContext.Provider>
  );
}

export default UrlContextProvider;

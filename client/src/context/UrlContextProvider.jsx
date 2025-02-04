import React, { useEffect, useState } from "react";
import { UrlContext } from "./urlContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "./userContext";

function UrlContextProvider({ children }) {
  const [urls, setUrls] = useState(null);
  const navigate = useNavigate();

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

  const createUrl = async (value) => {
    console.log("called", value);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URI}/api/v1/urls/create`,
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(value),
        }
      );
      const data = await response.json();
      if (data.data.statusCode === 201) {
        console.log(data.data);
        let availableUrls = urls ? [...urls, data.data.data] : [data.data.data];
        setUrls(availableUrls);
        toast.success("Url created successfully", {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        navigate(`/${data.data.data._id}`);
      } else if (data.data.statusCode === 409) {
        toast.error("Please enter another aliase", {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      }
      console.log(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <UrlContext.Provider
      value={{
        urls,
        setUrls,
        fetchUrls,
        createUrl,
      }}
    >
      {children}
    </UrlContext.Provider>
  );
}

export default UrlContextProvider;

import React, { useEffect, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { UserContext } from "./userContext";

const UserContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoggedin, setIsLoggedin] = useState(false);
  const { getItem, setItem, deleteItem } = useLocalStorage();
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);

  const registerUser = async (userData) => {
    setIsRegisterLoading(true);
    if (userData.email === "") {
      toast.error("Please provide email", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      return;
    }
    if (userData.password === "") {
      toast.error("Please provide password", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      return;
    }
    if (userData.username === "") {
      toast.error("Please provide username", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URI}/api/v1/users/register`,
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );
      const data = await response.json();
      if (data.data.statusCode === 201) {
        toast.dismiss();
        toast.success("User account created successfully", {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        setUser(data.data);
        setItem("user", data.data);
        navigate("/");
      } else if (data.data.statusCode === 409) {
        toast.error(data.data.message, {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      } else if (data.data.statusCode === 422) {
        let firsElement = data.data.errors[0];
        let message = "";
        if ("username" in firsElement) {
          message = firsElement["username"];
        } else if ("email" in firsElement) {
          message = firsElement["email"];
        } else if ("password" in firsElement) {
          message = firsElement["password"];
        }
        toast.error(message, {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      }
    } catch (error) {
      console.log(error.message);
    }
    setIsRegisterLoading(false);
  };

  const login = async (userData) => {
    setIsLoginLoading(true);
    if (userData.email === "") {
      toast.error("Please provide email", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      return;
    }
    if (userData.password === "") {
      toast.error("Please provide password", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      return;
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URI}/api/v1/users/login`,
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );
      const data = await response.json();
      console.log(data);
      if (data.data.statusCode === 200) {
        toast.dismiss();
        toast.success("User logged in successfully", {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        setUser(data);
        setItem("user", data);
        navigate("/");
      } else if (data.data.statusCode === 401) {
        toast.error(data.data.message, {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      } else if (data.data.statusCode === 422) {
        let firsElement = data.errors[0];
        let message = "";
        if ("email" in firsElement) {
          message = firsElement["email"];
        } else if ("password" in firsElement) {
          message = firsElement["password"];
        }
        toast.error(message, {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      }
    } catch (error) {
      console.log(error.message);
    }
    setIsLoginLoading(false);
  };

  const logOut = async () => {
    deleteItem("user");
    setUser(null);
    toast.success("log out successfully", {
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });
    navigate("/sigin");
  };

  const fetchUserDetails = () => {
    const userData = getItem("user");
    console.log("userData", userData);
    if (userData) {
      setUser(userData);
      navigate("/");
    } else {
      navigate("/sigin");
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <UserContext.Provider
      value={{
        registerUser,
        login,
        user,
        logOut,
        isLoggedin,
        setIsLoggedin,
        isLoginLoading,
        isRegisterLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;

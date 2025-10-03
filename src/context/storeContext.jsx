import { createContext, useState, useEffect } from "react";

export const storeContext = createContext();

export const StoreProvider = ({ children }) => {
  //define variables
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [token, setToken] = useState("");
  const [books, setBooks] = useState([]);
  const [singleBook, setSingleBook] = useState(null);

  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  function isTokenExpired(token) {
    if (!token) return;

    try {
      const [, payload] = token.split(".");
      const decodedPayload = JSON.parse(atob(payload));
      return decodedPayload.exp * 1000 < Date.now();
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    //fetch token from local storage
    const localStorageToken = localStorage.getItem("bookApp_token");
    // console.log(localStorageToken);
    const tokenExpiryStatus = isTokenExpired(localStorageToken)
    if (tokenExpiryStatus === false) {
      console.log("got here");
      setToken(localStorageToken);
      setIsAuth(true);
    } else{
      setIsAuth(false);
      localStorage.removeItem("bookApp_token");
    }
  }, []);

async function fetchProfile() {
    const response = await fetch(`${apiUrl}/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    
  }

  async function fetchBooks() {
    try {
      setIsLoading(true);
      const response = await fetch(`${apiUrl}/book/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log(data);
      setBooks(data.books);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      
    }

  }
  async function fetchBook(id) {
    try {
      setIsLoading(true);
      const response = await fetch(`${apiUrl}/book/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setSingleBook(data.book);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }

  }


  //exporting states/functions/data
  const contextObj = {
    isAuth,
    setIsAuth,
    setIsLoading,
    isLoading,
    apiUrl,
    password,
    setPassword,
    email,
    setEmail,
    showPassword,
    setShowPassword,
    userName,
    setUserName,
    token,
    setToken,
    fetchBooks,
    books,
    fetchBook,
    singleBook
  };

  return (
    <storeContext.Provider value={contextObj}>{children}</storeContext.Provider>
  );
};

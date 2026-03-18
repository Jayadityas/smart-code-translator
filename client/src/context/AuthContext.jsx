/*Multiple components need to know if the user is logged in — the Navbar shows the user's name, the Login page redirects after login, and protected routes check authentication.
 Instead of passing this data through every component, we use React Context to make it available globally. */

 //To make user data available to all components ,it store it globally for which we use react context

 import { createContext, useState, useEffect } from "react";
import { getMe } from "../services/authService.js";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const userData = await getMe();
        setUser(userData);
      } catch (error) {
        localStorage.removeItem("token");
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout: logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };

//On app load, useEffect checks is there is a token in localStorage. If so, it calls getme() to check 
//if user is still logged in i.e. token is still valid and gets the user's profile.
//This keeps the user logged in even after refreshing the page


//This wraps pages requiring login. So if a user is not logged in, it redirects them to login page
//If user is logged in,  it renders normally

import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

function ProtectedRoute({ children }) {
    //read the user and loading state from AuthContext to determine if the user is authenticated and if we are still checking the auth status
  const { user, loading } = useContext(AuthContext);

  //If still authentication is being checked, it shows loading indicator
  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" />; //Is user not looged in, it redirects them to login page

  return <div className="protected-shell">{children}</div>;//If user is logged in, it renders the protected page normally
}

export default ProtectedRoute;
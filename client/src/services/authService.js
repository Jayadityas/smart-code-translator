import API from "./api.js";

const register = async (name, email, password) => {
  const response = await API.post("/auth/register", { name, email, password });
  return response.data.data;
};

const emailLogin = async (email, password) => {
  const response = await API.post("/auth/login", { email, password });
  return response.data.data;
};

const googleLogin = async (credential) => {
  const response = await API.post("/auth/google", { credential });
  return response.data.data;
};

const getMe = async () => {
  const response = await API.get("/auth/me");
  return response.data.data;
};

const logout = async () => {
  const response = await API.post("/auth/logout");
  return response.data;
};

export { register, emailLogin, googleLogin, getMe, logout };

//Each function calls the corresponding backend auth endpoint and returns only the data portion of response.
//In logout it notifies the backend - the actual token removal happens in AuthContext

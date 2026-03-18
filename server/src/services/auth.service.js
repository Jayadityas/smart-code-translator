import bcrypt from "bcryptjs";
import User from "../models/User.model.js";
import { generateToken } from "../utils/jwt.utils.js";
import { verifyGoogleToken } from "../config/google.config.js";

export const register = async (name, email, password) => {
  const existing = await User.findOne({ email });
  //Check if email is already registered
  if (existing) {
    const error = new Error("Email already registered.");
    error.statusCode = 409;
    throw error;
  }
 //hash the password and create the user
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });
  const token = generateToken(user); //Generate JWT token for the user

  return {
    token,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      picture: user.picture,
    },
  };
};


export const emailLogin = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user || !user.password) { 
    //Google SSO users won't have a password, so they should not be able to log in with email/password
    const error = new Error("Invalid email or password.");
    error.statusCode = 401;
    throw error;
  }

  //Compare the provided password with the hashed password in the database
  const isMatch = await bcrypt.compare(password, user.password);
  //If the password does not match, throw an error
  if (!isMatch) {
    const error = new Error("Invalid email or password.");
    error.statusCode = 401;
    throw error;
  }
//Update the last login time and generate a JWT token for the user
  user.lastLogin = new Date();
  await user.save();
  const token = generateToken(user);

  return {
    token,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      picture: user.picture,
    },
  };
};

//When user logs in using Google SSO , two scenarios can happen:
//1. If it is a new user then create an account for them and generate a JWT token
//2. If it is an existing user then just update the last login time and generate a new JWT token

export const googleLogin = async (credential) => {
  const googleUser = await verifyGoogleToken(credential);

  //Find the user by Google ID or email. This allows users who previously signed up with email/password to log in with Google if they use the same email.

  let user = await User.findOneAndUpdate(
    { googleId: googleUser.googleId },
    {
      googleId: googleUser.googleId,
      email: googleUser.email,
      name: googleUser.name,
      picture: googleUser.picture,
      lastLogin: new Date(),
    },
    {
      returnDocument: "after", //give me back the updated document
      upsert: true,
    },
  );

  const token = generateToken(user);

  return {
    token,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      picture: user.picture,
    },
  };
};



//Function which return the user's profile when the app loads to check is the user is still logged in
export const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select("-__v -googleId"); //Excludes the internal fields that we don't want to expose to frontend

  if (!user) {
    throw new Error("User not found");
  }

  return {
    id: user._id,
    email: user.email,
    name: user.name,
    picture: user.picture,
    createdAt: user.createdAt,
    lastLogin: user.lastLogin,
  };
};
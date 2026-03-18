import { OAuth2Client } from "google-auth-library";
//This client will be used to verify the Google ID tokens sent from the frontend
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


const verifyGoogleToken = async (credential) => {
  try {
   //asks Google: "Is this token real and was it meant for my app?" If valid, we get the user's profile info
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    //Google returns a unique user ID (sub), email, name, and profile picture URL in the payload. We return this info to be used for creating or finding the user in our database.
    return {
      googleId: payload.sub, //Google's unique user ID for this user
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    };
  } catch (error) {
    throw new Error("Invalid Google token");
  }
};

export { googleClient, verifyGoogleToken };

//backend receives the Google ID token from frontend and then do the following:
//1. Verify the token with google to ensure it is genuine and was issued for our app
//2. Extract the user's profile info (Google ID, email, name, picture) from the token payload
//3. Check if a user with the given Google ID or email already exists in our database
//4. If the user exists, update their last login time and generate a JWT token for them
//5. If the user does not exist, create a new user record in the database with the extracted profile info, and then generate a JWT token for the new user



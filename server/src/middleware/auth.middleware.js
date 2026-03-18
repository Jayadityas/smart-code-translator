import { verifyToken } from "../utils/jwt.utils.js";
import User from "../models/User.model.js";

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Please log in to access this route.",
      });
    }

    const token = authHeader.split(" ")[1]; //Extract the token from the "Bearer <token>" format
    const decoded = verifyToken(token); //Verify the token and decode the payload to get the user's ID and email
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found. Please log in again.",
      });
    }

    req.user = user; //Attach the user object to the request so that controllers can access it via req.user
    next(); //passes the control to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please log in again.",
    });
  }
};

export default authenticate;
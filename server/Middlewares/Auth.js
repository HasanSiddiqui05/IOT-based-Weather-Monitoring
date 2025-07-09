import express from "express";
import cookieParser from "cookie-parser"; 
import { getUser } from "../services/auth.js"; 

function checkAuthToken(req, res, next) {
  
  const { Auth_token } = req.cookies;

  
  if (!Auth_token) {
    return res.status(401).json({ message: "User not authorized. Token missing." });
  }

  try {
    
    const user = getUser(Auth_token);

    if (!user) {
      return res.status(401).json({ message: "User not found. Invalid token." });
    }

    req.user = user;
    next();
  } catch (error) {
    
    return res.status(401).json({ message: "Invalid token.", error: error.message });
  }
}

export default checkAuthToken;

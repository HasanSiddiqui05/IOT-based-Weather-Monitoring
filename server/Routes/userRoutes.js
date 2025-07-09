import express from 'express'
import {handleUserSignUp,
        handleUserLogIn,
        logout,
        verifyEmail,
        forgotPassword,
        resetPassword,
        checkAuth 
        } from '../Controllers/userController.js'
import checkAuthToken from '../Middlewares/Auth.js';

const router = express.Router();

router.post('/sign-up',handleUserSignUp)
router.post('/login',handleUserLogIn)
router.post("/logout", logout);

router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);
router.get("/check-auth",checkAuthToken,checkAuth);



export default router;
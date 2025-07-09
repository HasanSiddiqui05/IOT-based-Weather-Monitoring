import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import crypto from 'crypto'
import nodemailer from 'nodemailer'

dotenv.config({path:'../.env'});


const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "mydsyt@gmail.com",
      pass: "jgto lksa isdv dlka",
    },
  });

function setUser(user){
   

    return jwt.sign({
        _id: user._id,
        email:user.email
    },process.env.SECRET_KEY,{ expiresIn: '1hr' })
}

function getUser(token) {
    if (!token) return null;
  
    try {
      
      const user = jwt.verify(token, process.env.SECRET_KEY);
      return user; 
    } catch (err) {
      console.error("Token verification failed:", err.message); 
      return null; 
    }
  }


async function generateOTP(){
    return await crypto.randomInt(111111,999999).toString();
}


async function sendOTPByMail(receiverEmail, verificationToken) {
    
        const mailOptions = {
            from: "mydsyt@gmail.com",
            to: receiverEmail,
            subject: "Verify Your Account - Atmos",
            text: `verification Code : ${verificationToken}`,
        };
        await transporter.sendMail(mailOptions);
     
}

async function sendPasswordResetEmail(receiverEmail,url){
    const mailOptions = {
        from: "mydsyt@gmail.com",
        to: receiverEmail,
        subject: "Reset Password - Atmos",
        html: `<p>You requested a password reset. Click the button below to reset your password:</p>
               <a href="${url}" style="display: inline-block; padding: 10px 15px; font-size: 16px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">Reset Password</a>
               <p>If you did not request this, you can safely ignore this email.</p>`
    };

    console.log(url);
    await transporter.sendMail(mailOptions);
}




    
export {setUser,getUser,generateOTP,sendOTPByMail,sendPasswordResetEmail};
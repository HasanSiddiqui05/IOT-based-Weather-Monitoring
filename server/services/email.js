import { Resend } from 'resend';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer'
dotenv.config({path:'../.env'})

console.log(process.env.RESEND_KEY);
(async () => {
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
      const mailOptions = {
        from: "mydsyt@gmail.com",
        to: "abdullah.hussdev@gmail.com",
        subject: "Hello from Nodemailer",
        text: "This is a test email sent using Nodemailer.",
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email: ", error);
        } else {
          console.log("Email sent: ", info.response);
        }
      });
})();

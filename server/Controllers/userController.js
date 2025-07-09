import User from '../Models/userModel.js'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import {setUser,generateOTP,sendOTPByMail,sendPasswordResetEmail} from '../services/auth.js'

async function handleUserSignUp(req,res){
    const {firstName,lastName,email,password} = req.body;

    if(!firstName || !lastName || !email || !password) return res.status(400).json({message:"All fields are required"});
    
    try{

    const existingUser = await User.findOne({email})

    if(existingUser) return res.status(400).json({message:"User already exists"});

    const hashedPassword = await bcrypt.hash(password,10);
    const verificationToken = await generateOTP();
    
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000
        });
   
    
    
    await sendOTPByMail(email,verificationToken);
    

    res.status(201).json({
        success: true,
        message: "User created successfully",
        user: {
            ...user._doc,
            password: undefined,
        },
    });
    
    }catch(err){
        return res.status(500).json({message:"Internal Server Error"})
    }

}

async function handleUserLogIn(req,res){
    const {email,password} = req.body;

    if( !email || !password) return res.status(400).json({message:"All fields are required"});
    try{
        const user = await User.findOne({email});
        if(!user) return res.status(404).json({message:"Invalid Login Credentials"})
        
        if(!user.isVerified) return res.status(404).json({message:"Please your Verify Account to Login"})
            
        const isValid = await bcrypt.compare(password,user.password);

        if(!isValid) return res.status(404).json({message:"Invalid Login Credentials"})
        const token = setUser(user);
        res.cookie('Auth_token',token,
        {   httpOnly: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

		res.status(200).json({
			success: true,
			message: "Login successful",
			user: {
				...user._doc,
				password: undefined,
			},
		});
        
        
    }catch(err){
        return res.status(500).json({message:"Something went wrong"})
    }


}
 const logout = async (req, res) => {
	res.clearCookie("Auth_token");
	res.status(200).json({ success: true, message: "Logged out successfully" });
};

const verifyEmail = async (req, res) => {
	const { code } = req.body;
	try {
		const user = await User.findOne({
			verificationToken: code,
			verificationTokenExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
		}

		user.isVerified = true;
		user.verificationToken = undefined;
		user.verificationTokenExpiresAt = undefined;
		await user.save();

		

		res.status(200).json({
			success: true,
			message: "Email verified successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		console.log("error in verifyEmail ", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};


const forgotPassword = async (req, res) => {
	const { email } = req.body;
	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		// Generate reset token
		const resetToken = crypto.randomBytes(20).toString("hex");
		const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

		user.resetPasswordToken = resetToken;
		user.resetPasswordExpiresAt = resetTokenExpiresAt;

		await user.save();

		// send email
		await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

		res.status(200).json({ success: true, message: "Password reset link sent to your email" });
	} catch (error) {
		console.log("Error in forgotPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

const resetPassword = async (req, res) => {
	try {
		const { token } = req.params;
		const { password } = req.body;
        console.log('first')
		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpiresAt: { $gt: Date.now() },
		});
        console.log('second')

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
		}
        console.log('third')

		// update password
		const hashedPassword = await bcrypt.hash(password, 10);

		user.password = hashedPassword;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpiresAt = undefined;
		await user.save();

		

		res.status(200).json({ success: true, message: "Password reset successful" });
	} catch (error) {
		console.log("Error in resetPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

async function checkAuth(req, res) {
	const { email } = req.user;
  
	try {
	  
	  const user = await User.findOne({ email });
	
	  if (!user) {
		return res.status(404).json({ message: "User not found!" });
	  }
  
	
	  return res.status(200).json({ user });
	} catch (error) {
	  
	  console.error("Error in checkAuth:", error);
  
	 
	  return res.status(500).json({ message: "An error occurred while fetching the user." });
	}
  }
  


export {handleUserSignUp,handleUserLogIn,verifyEmail,resetPassword,forgotPassword,logout,checkAuth}
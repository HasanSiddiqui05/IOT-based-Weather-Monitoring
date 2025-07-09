import {REGEXP_ONLY_DIGITS} from "input-otp"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
  } from "../components/ui/input-otp"
import {toast} from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

  
import { useState,useEffect } from "react";
import { FaCloud } from "react-icons/fa6";
import { useAuth } from "../context/AuthContext";
import { RiLoader5Line } from "react-icons/ri";



function Otp() {
    const [Value, setValue] = useState("");
    const [otpError, setOtpError] = useState(false);
    const {verifyOtp,error,setError,loading,AuthState} = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (AuthState?.isVerified) {
            navigate('/login');
        }
    }, [AuthState, navigate]);
    
    const checkOtp = async (Value) => {
        setOtpError(false);
        setError(null);
    
        if (!Value) return setOtpError(true);
        if (Value.length < 6) return setOtpError(true);
    
        try {
            await verifyOtp(Value); // Updates state
            toast.success('Email Verified Successfully');
            navigate('/login'); // Navigate after ensuring the state is updated
        } catch (error) {
            console.log(error);
        }
    };
    
    
return (
        <div className='bg-gradient-to-tr from-[var(--blue)] to-[var(--white-smoke)] h-screen flex items-center justify-center px-4'>
        <div className='w-full max-w-[450px]  md:max-w-[600px] flex flex-col justify-center px-4 md:px-10 bg-white bg-opacity-40 py-4 rounded-xl'>
            <div className='text-center font-extrabold text-2xl md:text-3xl mb-6 flex items-center justify-center gap-1'>
            <FaCloud /> Atmos
            </div>
<div className="text-sm text-left mb-4 md:text-xl">
    Enter Your One-Time Password to verify your account.
</div>

    <div className="space-y-2 flex items-center justify-center text-[var(--black)] mb-4">
        <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS} value={Value} onChange={(Value) => setValue(Value)} className='flex items-center' >
            <InputOTPGroup className=''>
                <InputOTPSlot index={0} className="w-10 h-10  border border-slate-950 rounded-l-lg text-lg focus:ring-8 focus:ring-blue-800  " />
                <InputOTPSlot index={1} className="w-10 h-10  border border-slate-950 text-lg focus:ring-8 focus:ring-blue-800" />
                <InputOTPSlot index={2} className="w-10 h-10  border border-slate-950 text-lg focus:ring-8 focus:ring-blue-800" />
                <InputOTPSlot index={3} className="w-10 h-10  border border-slate-950 text-lg focus:ring-8 focus:ring-blue-800" />
                <InputOTPSlot index={4} className="w-10 h-10  border border-slate-950 text-lg focus:ring-8 focus:ring-blue-800" />
                <InputOTPSlot index={5} className="w-10 h-10  border border-slate-950 rounded-r-lg text-lg focus:ring-8 focus:ring-blue-800 " />
            </InputOTPGroup>
        </InputOTP>
       
    </div>

    {otpError && <div className=" text-sm md:text-base text-[var(--tomato)] text-center">OTP must be 6 Digits</div>}
    {error && <div className=" text-sm md:text-base text-[var(--tomato)] text-center">{error}</div>}
    <div className="flex items-center justify-center mt-4">
        <button onClick={()=>checkOtp(Value)}  className="bg-slate-950 text-white py-2 px-4 rounded-lg ">
        {loading ? (
                        <div className='flex justify-center'>
                            <RiLoader5Line className="animate-spin" /> Loading...
                        </div>
                        
                        
                        ) : (
                            <>
                            Confirm
                            </>
                        )}
            </button>
    </div>
        </div>
            </div>
        
       
      )
}


export default Otp
import { useForm } from 'react-hook-form';
import {useEffect, useState} from 'react'
import {z} from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'
import { FaCloud,FaArrowLeftLong  } from 'react-icons/fa6';
import { RiLoader5Line } from "react-icons/ri";
import { Link } from 'react-router-dom';
import { MdMarkEmailRead } from "react-icons/md";
import {useAuth} from '../context/AuthContext'
function ForgotPassword() {
  const  [isSubmitted, setisSubmitted] = useState(false);
  const {setError} = useAuth();

  useEffect(()=>{
      setError(null);
  },[])
  const schema = z.object({
    email: z.string().email({ message: 'Enter valid email' }),
  })
  const { register, handleSubmit, formState: { errors, isSubmitting} } = useForm({
    resolver: zodResolver(schema)
  });
  const {error,forgotPassword} = useAuth();
  async function onSubmit(data){
    try {
        await forgotPassword(data);
        setisSubmitted(true);
    } catch (error) {
      console.log(error);
    }finally{

    }
  };
  return (
    <>
   <div className='bg-gradient-to-tr from-[var(--blue)] to-[var(--white-smoke)] h-screen flex items-center justify-center px-4'>
  <div className='w-full max-w-[400px] flex flex-col justify-center px-8 md:px-6 bg-white bg-opacity-40 py-4 rounded-xl'>
   <div className='text-center font-extrabold text-2xl md:text-3xl mb-6 flex items-center justify-center gap-1'>
      <FaCloud /> Atmos
    </div>
    <div className='text-center text-lg md:text-xl font-bold mb-4'>Forgot Password</div>
    

   {!isSubmitted ? (
   <>
    <div className='text-center text-lg md:text-base '>Enter your email address and we'll send you a link to reset your password.</div>
    <form onSubmit={handleSubmit(onSubmit)}>
    <div className='flex justify-center mt-4 mb-2'>
    <input
          type="text"
          {...register('email')}
          placeholder='Enter email'
          className='py-2 rounded-lg px-2 focus:ring-2 focus:ring-blue-500 focus:outline-sky-600 w-full'
        />
        </div>
      {errors.email && (<div className='text-red-500'>{errors.email.message}</div>)}
      {error && (<div className='text-red-500'>{error}</div>)}
      
      <button
        type="submit"
        disabled={isSubmitting}
        className='w-full bg-slate-950 text-white mt-5 py-2 rounded-lg flex items-center justify-center'
      >
        {isSubmitting ? (<RiLoader5Line className='animate-spin' size={25}/>) : 'Send Reset Link'}
      </button>
      
    </form>
    </>
   ):(<>
      <div className='flex flex-col items-center  gap-2'>
        <div className='bg-slate-950 p-3 rounded-full flex items-center'>
        <MdMarkEmailRead color={'white'} size={30}/>
        </div>
        <div className='text-center'>If an account exits for this email, you'll receive a password reset link shortly.</div>
      </div>

   </>)} 
    

      <Link to={'/login'}>
      <div className='flex gap-2 items-center cursor-pointer justify-center mt-4' >
      <FaArrowLeftLong/> Back to Login
      </div>
      </Link>

    
  </div>
</div>

    </>

  )
}

export default ForgotPassword;
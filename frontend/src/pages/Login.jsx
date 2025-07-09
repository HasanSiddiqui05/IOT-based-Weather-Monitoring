import React, { useRef,useEffect } from 'react'
import { FaCloud } from "react-icons/fa6";
import { RiLoader5Line } from "react-icons/ri";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {useAuth} from '../context/AuthContext'
import {useNavigate,Link} from 'react-router-dom'

function Login() {

  const schema = z.object({
    email: z.string().email({ message: 'invalid email' }),
    password: z.string().min(8, 'Password must be atleast 8 characters')
  })
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema)
  });

const {login,error,setError} = useAuth();

useEffect(()=>{
  setError(null);
},[])
const navigate  = useNavigate();
  const onSubmit = async (data) => {
    setError(null);
    try {
      await login(data);
      navigate('/dashboard');
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>

<div className='bg-gradient-to-tr from-[var(--blue)] to-[var(--white-smoke)] h-screen flex items-center justify-center px-4'>
  <div className='w-full max-w-[400px] flex flex-col justify-center px-6 md:px-10 bg-white bg-opacity-40 py-4 rounded-xl'>
    <div className='text-center font-extrabold text-2xl md:text-3xl mb-6 flex items-center justify-center gap-1'>
      <FaCloud /> Atmos
    </div>
    <div className='text-center text-lg md:text-xl font-bold'>Login into your Account</div>
    <div className='text-center text-sm'>
      Don't have Access? <span className='cursor-pointer text-blue-500 underline '><Link to='/signup'>Sign Up</Link></span>
    </div>

    <form onSubmit={handleSubmit(onSubmit)} className='mt-4'>
      <div className='flex flex-col gap-2 mb-3'>
        <label htmlFor="email" className='text-left'>Email</label>
        <input
          type="text"
          {...register('email')}
          placeholder='Enter email'
          className='py-2 rounded-lg px-2 focus:ring-2 focus:ring-blue-500 focus:outline-sky-600'
        />
      </div>
      {errors.email && (<div className='text-red-500'>{errors.email.message}</div>)}

      <div className='flex flex-col gap-2 mb-3'>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          {...register('password')}
          name="password"
          id="password"
          placeholder='Enter Password'
          className='py-2 rounded-lg px-2 focus:ring-2 focus:ring-blue-500 focus:outline-sky-600'
        />
      </div>
      {errors.password && (<div className='text-red-500'>{errors.password.message}</div>)}
      {error && (<div className='text-red-500'>{error}</div>)}
      <div className='text-sm'>Forgot your password? <span className='cursor-pointer text-blue-500 underline '><Link to='/forgot-password'>Click here</Link></span></div>
      <button
        type="submit"
        disabled={isSubmitting}
        className='w-full bg-slate-950 text-white mt-5 py-2 rounded-lg flex items-center justify-center'
      >
        {isSubmitting ? (<RiLoader5Line className='animate-spin' size={25}/>) : 'Sign In'}
      </button>
    </form>
  </div>
</div>


    </>
  )
}

export default Login
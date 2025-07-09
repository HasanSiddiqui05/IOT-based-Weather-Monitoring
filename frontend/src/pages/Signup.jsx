import React, { useEffect } from 'react'
import { FaCloud,FaArrowRight } from 'react-icons/fa6'
import { useForm } from 'react-hook-form'
import {z} from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { RiLoader5Line } from "react-icons/ri";
import  {useAuth}  from '../context/AuthContext'
import {useNavigate,Link} from 'react-router-dom'

function Signup() {
    const navigate = useNavigate();
    const schema = z.object({
        firstName: z.string().min(2,"First Name must be at least 2 Characters"),
        lastName: z.string().min(2,"Last Name must be at least 2 Characters"),
        email:z.string().email(),
        password: z.string().min(8,'Password must be at least 8 characters')
    })
    const {register,handleSubmit,formState:{errors,isSubmitting}} = useForm({
        resolver:zodResolver(schema)
    })
    const {signup,error,setError} = useAuth();
    const onSubmit = async (data)=>{
       setError(null);
       try {
        await signup(data);
        navigate('/verify-otp');
       } catch (error) {
        console.log(error);
       }
    }
    useEffect(()=>{
        setError(null);
    },[])

  return (
    <>
    <div className='bg-gradient-to-tr from-[var(--blue)] to-[var(--white-smoke)] h-screen flex items-center justify-center px-4'>
        <div className='w-full max-w-[450px]  md:max-w-[600px] flex flex-col justify-center px-4 md:px-10 bg-white bg-opacity-40 py-4 rounded-xl'>
            <div className='text-center font-extrabold text-2xl md:text-3xl mb-6 flex items-center justify-center gap-1'>
            <FaCloud /> Atmos
            </div>

            <div className=' text-lg md:text-xl font-["Nunito"]  font-extrabold text-left'>
                Let's Create an account
            </div>

            <div className='text-sm md:text-base my-2 md:my-4'>
                <span className='font-bold'>Atmos</span> offers modern and interative Weather Analysis all in real-time.
            </div>


            <form action="" className='flex flex-col gap-2' onSubmit={handleSubmit(onSubmit)}>

               <div className='flex flex-col md:flex-row md:justify-between gap-2'>
                    <div className='flex flex-col gap-1'>
                        <label htmlFor="" className=''>First Name</label>
                        <input type="text" {...register('firstName')} placeholder="Enter First Name" className='rounded-lg py-1 px-2 focus:ring-blue-500 focus:outline-sky-500' />
                        {errors.firstName && <div className='text-sm text-[var(--tomato)]'>{errors.firstName.message}</div>}
                    </div>
                    <div className='flex flex-col gap-1'>
                        <label htmlFor="">Last Name</label>
                        <input type="text" {...register('lastName')} placeholder="Enter Last Name" className='rounded-lg px-2 py-1 focus:ring-blue-500 focus:outline-sky-500'/>
                        {errors.lastName && <div className='text-sm text-[var(--tomato)]'>{errors.lastName.message}</div>}
                    </div>
                </div> 

                <div className='flex flex-col gap-1'>
                        <label htmlFor="">Email</label>
                        <input type="text" {...register('email')} placeholder="Enter Email" className='rounded-lg px-2 py-1 focus:ring-blue-500 focus:outline-sky-500'/>
                        {errors.email && <div className='text-sm text-[var(--tomato)]'>{errors.email.message}</div>}
                </div>

                <div className='flex flex-col gap-1'>
                        <label htmlFor="">Password</label>
                        <input type="password" {...register('password')} placeholder="Must be at least 8 Characters." className='rounded-lg py-1 px-2 focus:ring-blue-500 focus:outline-sky-500'/>
                        {errors.password && <div className='text-sm text-[var(--tomato)]'>{errors.password.message}</div>}
                </div>
                {error && <div className='text-sm text-[var(--tomato)]'>{error}</div>}
                <div className='flex gap-2  justify-start items-baseline'>
                    <button type='submit' disabled={isSubmitting} className=' bg-slate-950 text-white mt-5 py-2 px-2 rounded-lg flex items-center gap-1 '>
                    {isSubmitting ? (
                        <>
                        
                            <RiLoader5Line className="animate-spin" /> Loading...
                        </>
                        ) : (
                            <>
                            Continue
                            <FaArrowRight />
                            </>
                        )}
                        </button>
                    <div className='text-sm md:text-base'>Already Registered? <span className='cursor-pointer text-blue-500 hover:underline '><Link to='/login'>Sign In</Link></span></div>
                </div>
            </form>


        </div>
    </div>
    </>
  )
}

export default Signup
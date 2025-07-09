import {useState,useEffect} from 'react'
import {FaCloud} from 'react-icons/fa6';
import {useNavigate, useParams} from 'react-router-dom';
import {toast} from 'react-hot-toast'
import {RiLoader5Line} from "react-icons/ri"
import {useAuth} from '../context/AuthContext'

function ResetPassword(){
    const {token} = useParams();
    const navigate = useNavigate();
    const [Password, setPassword] = useState('');
    const [confirmPassword,setConfirmPassword] = useState('');
    const [errorPassword,setErrorPassword] = useState(false);
    const [errorConfirmPassword,setErrorConfirmPassword] = useState(false);
    const {error,setError,resetPassword,loading} = useAuth();
    useEffect(()=>{
      setError(null);
    },[])
    const [resetCompleted, setResetCompleted] = useState(false);

    useEffect(() => {
      if (resetCompleted) {
          navigate('/login');
      }
    }, [resetCompleted, navigate]);

    const handleResetPassword = async (e)=>{
      e.preventDefault();
      setErrorPassword(false);
      setErrorConfirmPassword(false);

      if(Password.length < 8) {
        return setErrorPassword(true);
      }
      
      if(Password !== confirmPassword){
        return setErrorConfirmPassword(true);
      }

     try {
      console.log("Starting resetPassword");
      await resetPassword(Password, token);
      console.log("Reset password successful, navigating to login");
      toast.success('Password Reset Successful');
      setResetCompleted(true);
     } catch (error) {
      console.log(error);
     }
     
    }

   
    return (<>
    <div className='bg-gradient-to-tr from-[var(--blue)] to-[var(--white-smoke)] h-screen flex items-center justify-center px-4'>
  <div className='w-full max-w-[400px] flex flex-col justify-center px-8 md:px-6 bg-white bg-opacity-40 py-4 rounded-xl'>
   <div className='text-center font-extrabold text-2xl md:text-3xl mb-6 flex items-center justify-center gap-1'>
      <FaCloud /> Atmos
    </div>
    <div className='text-center text-lg md:text-xl font-bold mb-4'>Reset Password</div>
    <form onSubmit={(e)=>handleResetPassword(e)}>
    <div className='flex justify-center mt-4 mb-2'>
    <input
          type="password"
          placeholder='Enter New Password'
          value={Password}
          onChange={(e)=>setPassword(e.target.value)}
          className={`py-2 rounded-lg px-2 focus:ring-1 focus:ring-blue-500 focus:outline-sky-600 w-full ${errorPassword ? 'outline-red-500':'outline-none'}` }
        />


        </div>
        {errorPassword && <div className='text-[var(--tomato)]'> Password must be at least 8 characters</div>}

        <div className='flex justify-center mt-4 mb-2'>
    <input
          type="password"
          placeholder='Re-Enter New Password'
          value={confirmPassword}
          onChange={(e)=>setConfirmPassword(e.target.value)}
          className={`py-2 rounded-lg px-2 focus:ring-1 focus:ring-blue-500 focus:outline-sky-600 w-full ${errorConfirmPassword ? 'outline-red-500':'outline-none'}` }
        />
        </div>
        {errorConfirmPassword && <div className='text-[var(--tomato)]'> Password doesn't match</div>}
        {error && <div className='text-[var(--tomato)]'>{error} </div>}
        <button
        type="submit"
        className='w-full bg-slate-950 text-white mt-5 py-2 rounded-lg flex items-center justify-center'
      >
      {loading ? (<RiLoader5Line className='animate-spin' size={25}/>) : 'Reset Password'}
      </button>
    </form>

  </div>
</div>
    </>)
}

export default ResetPassword;
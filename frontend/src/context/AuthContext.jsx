import { createContext, useContext, useState,useEffect } from "react";
import axios from "axios";
import {toast} from 'react-hot-toast';

export const AuthContext = createContext();
const APIURL ='http://localhost:8000/api'
axios.defaults.withCredentials = true;
function AuthProvider({children}){
    const [AuthState,setAuthState] = useState({
        isLoggedIn:false,
        isVerified:false,
        user:null
    });

    const [error,setError] = useState(false);
    const [loading,setLoading] = useState(false);
    const [checkingAuth,setCheckingAuth] = useState(false);

    useEffect(() => {
        const initializeAuth = async () => {
          console.log("Initializing auth...");
          await checkAuth();
        };
        initializeAuth();
      }, []);
      
      useEffect(() => {
        console.log("AuthState updated:", AuthState);
      }, [AuthState]);

    const login = async (data)=>{
       setError(null);
       try{
         const response = await axios.post(`${APIURL}/user/login`,data);
         setAuthState({
            isLoggedIn:true,
            isVerified:response.data.user.isVerified,
            user:response.data.user
        })
        toast.success(`${response.data.message}`);
       }
       catch (error){
            setError(error.response.data.message);
            throw error;
       }
       
       
    }
   
    const signup= async (data)=>{
        setError(null);
        try {
            const response = await axios.post(`${APIURL}/user/sign-up`,data);
            setAuthState({
                isLoggedIn:false,
                isVerified:false,
                user: response.data.user})
        } catch (error) {
            setError(error.response.data.message || 'Error signing up');
            throw error;
        }

    }

    const verifyOtp= async (code)=>{
        setError(null);
        setLoading(true);
        try {
            const response = await axios.post(`${APIURL}/user/verify-email`,{code});
            setAuthState(prev => ({...prev,isVerified:true, user:response.data.user}));

        } catch (error) {
            setError(error.response.data.message ||  "Error verifying email");
            throw error;
        }
        finally{
            setLoading(false);
        }

        
    }

    const forgotPassword= async(email)=>{
        setError(null);
        try {
            const response = await axios.post(`${APIURL}/user/forgot-password`,email);
        } catch (error) {
            setError(error.response.data.message);
            throw error;
        }

    }

    const resetPassword= async(password,token)=>{
        setError(null);
        setLoading(true);
        try {
            const response = await axios.post(`${APIURL}/user/reset-password/${token}`,{password});
        } catch (error) {
            setError(error.response.data.message);
            throw error;
        }finally{
            setLoading(false);
        }

    }
    const checkAuth = async () => {
        console.log("Checking auth...");
        setCheckingAuth(true);
        try {
          const response = await axios.get(`${APIURL}/user/check-auth`);
          setAuthState({
            isLoggedIn: true,
            isVerified: response.data.user.isVerified,
            user: response.data.user,
          });
        } catch (error) {
          console.error("Auth check failed:", error.message);
          setAuthState({
            isLoggedIn: false,
            isVerified: false,
            user: null,
          });
        } finally {
          setCheckingAuth(false);
          console.log("Auth check completed.");
        }
      };
      

    const logout = ()=>{
        setAuthState({
            isLoggedIn:false,
            isVerified:false,
            user:null
        })
    }
   
    return ( <AuthContext.Provider value={{signup,login,logout,verifyOtp,checkAuth,AuthState,error,setError,loading,setLoading,forgotPassword,resetPassword,checkingAuth}}>
                {children}
            </AuthContext.Provider>)
}


export const useAuth = ()=> useContext(AuthContext);

export default AuthProvider;
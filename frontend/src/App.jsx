import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { RiLoader5Line } from "react-icons/ri";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Otp from './pages/Otp';
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import { useAuth } from './context/AuthContext';
import WeatherPage from './pages/WeatherPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ForecastPage from './pages/ForecastPage';

const RedirectLoggedInUsers = ({ children }) => {
  const { AuthState, checkingAuth } = useAuth();

  if (checkingAuth) {
    return null; 
  }

  if (AuthState?.isLoggedIn && AuthState?.user?.isVerified) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const ProtectedRoute = ({ children }) => {
  const { AuthState, checkingAuth } = useAuth();

  if (checkingAuth) {
    return null; // Show nothing while checking auth
  }

  if (!AuthState?.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!AuthState?.user?.isVerified) {
    return <Navigate to="/verify-otp" replace />;
  }

  return children;
};

function App() {
  const { checkingAuth } = useAuth();

  if (checkingAuth) {
    return (
      <div className="bg-gradient-to-tr from-[var(--blue)] to-[var(--white-smoke)] h-screen flex items-center justify-center px-4">
        <RiLoader5Line className="animate-spin" size={25} />
      </div>
    );
  }

  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <RedirectLoggedInUsers>
          <Login />
        </RedirectLoggedInUsers>
      ),
    },
    {
      path: '/login',
      element: (
        <RedirectLoggedInUsers>
          <Login />
        </RedirectLoggedInUsers>
      ),
    },
    {
      path: '/signup',
      element: (
        <RedirectLoggedInUsers>
          <Signup />
        </RedirectLoggedInUsers>
      ),
    },
    {
      path: '/verify-otp',
      element: (
        <RedirectLoggedInUsers>
          <Otp />
        </RedirectLoggedInUsers>
      ),
    },
    {
      path: '/forgot-password',
      element: (
        <RedirectLoggedInUsers>
          <ForgotPassword />
        </RedirectLoggedInUsers>
      ),
    },
    {
      path: '/reset-password/:token',
      element: (
        <RedirectLoggedInUsers>
          <ResetPassword />
        </RedirectLoggedInUsers>
      ),
    },
    {
      path: '/dashboard',
      element: (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      ),
      children: [
        { path: '', element: <ProtectedRoute><WeatherPage /></ProtectedRoute> },
        { path: 'analytics', element: <AnalyticsPage /> },
        { path: 'forecast', element: <ForecastPage /> },
      ],
    },
    {
      path: '*', 
      element: <Navigate to="/login" replace />, 
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;

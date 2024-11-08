import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider, BrowserRouter, Routes } from 'react-router-dom'
import Login from './components/Login'
import Verify from './components/Verify'
import Register from './components/Register'
import Profile from './components/Profile'
import EditProfile from './components/EditProfile'
import Home from './components/Home'
import Verify2FALogin from './components/Verify2FALogin'
import Generate2FA from './components/Generate2FA'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';

function App() {

  return (
    <>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
     <BrowserRouter>
     <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify/:token" element={<Verify />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/editProfile" element={<EditProfile />} />
      <Route path="/verify2fa" element={<Verify2FALogin />} />
      <Route path="/generate2fa" element={<Generate2FA />} />
     </Routes>
     </BrowserRouter>
     </GoogleOAuthProvider>
     </LocalizationProvider>
    </>
  )
}

export default App

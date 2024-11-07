import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider, BrowserRouter, Routes } from 'react-router-dom'
import Login from './components/Login'
import Verify from './components/Verify'
import Register from './components/Register'
import Profile from './components/Profile'
import EditProfile from './components/EditProfile'
import Verify2FALogin from './components/Verify2FALogin'
import Generate2FA from './components/Generate2FA'

function App() {

  return (
    <>
     <BrowserRouter>
     <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify/:token" element={<Verify />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/editProfile" element={<EditProfile />} />
      <Route path="/verify2fa" element={<Verify2FALogin />} />
      <Route path="/generate2fa" element={<Generate2FA />} />
     </Routes>
     </BrowserRouter>
    </>
  )
}

export default App

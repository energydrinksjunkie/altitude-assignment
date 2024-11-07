import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider, BrowserRouter, Routes } from 'react-router-dom'
import Login from './components/Login'
import Verify from './components/Verify'
import Register from './components/Register'
import Profile from './components/Profile'

function App() {

  return (
    <>
     <BrowserRouter>
     <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify/:token" element={<Verify />} />
      <Route path="/profile" element={<Profile />} />
     </Routes>
     </BrowserRouter>
    </>
  )
}

export default App

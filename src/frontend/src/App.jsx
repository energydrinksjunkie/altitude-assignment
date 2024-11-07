import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom'
import Login from './components/Login'

const router = createBrowserRouter (
  createRoutesFromElements(
    <Route path="login" element={<Login />} />
  )
)

function App() {

  return (
    <>
     <RouterProvider router={router} />
    </>
  )
}

export default App

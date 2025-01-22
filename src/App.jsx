import { Route, Routes, Navigate, useNavigate } from 'react-router-dom'
import './App.css'
import NavBar from './components/NavBar/NavBar'
import Home from './pages/Home'
import Signin from './pages/auth/Signin'
import Signup from './pages/auth/Signup'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import ProfileUpdate from './pages/ProfileUpdate'
import NewItem from './pages/NewItem'
import ChatPage from './pages/Chat'
import SinglePage from './pages/SinglePage'
import EditItem from './pages/EditItem'
import { useEffect, useState } from 'react'
import { getProfile } from './components/services/userService'
import client from './components/services/config'

const ProtectedRoute = ({ isLoggedIn, children }) => {
  return isLoggedIn ? children : <Navigate to="/auth/signin" replace />
}

function App() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const getUserProfile = async () => {
    try {
      const token = localStorage.getItem('authToken')
      if (!token) {
        setUser(null)
        setIsLoggedIn(false)
        return
      }

      const cachedUser = JSON.parse(localStorage.getItem('user'))
      if (cachedUser) {
        setUser(cachedUser)
        setIsLoggedIn(true)
        return
      }

      const data = await getProfile()
      setUser(data)
      localStorage.setItem('user', JSON.stringify(data))
      setIsLoggedIn(true)
    } catch (error) {
      setUser(null)
      setIsLoggedIn(false)
      console.error('Error fetching user profile:', error)
    }
  }

  const logOut = async () => {
    try {
      await client.post('/auth/signout')
      localStorage.clear()
      setUser(null)
      setIsLoggedIn(false)
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
      localStorage.clear()
      setUser(null)
      setIsLoggedIn(false)
      navigate('/')
    }
  }

  useEffect(() => {
    getUserProfile()
  }, [])

  return (
    <>
      <header>
        <NavBar logOut={logOut} user={user} />
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/:id"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <SinglePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Profile logOut={logOut} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profileUpdate"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <ProfileUpdate currentUser={user} setCurrentUser={setUser} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/new-item"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <NewItem currentUser={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/items/:id"
            element={<SinglePage currentUser={user} />}
          />
          <Route
            path="/auth/signup"
            element={<Signup getUserProfile={getUserProfile} />}
          />
          <Route
            path="/auth/signin"
            element={<Signin getUserProfile={getUserProfile} />}
          />
          <Route
            path="/edit-item/:id"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <EditItem currentUser={user} />
              </ProtectedRoute>
            }
          />
          <Route path="/chat/:id" element={<ChatPage />} />
        </Routes>
      </main>
    </>
  )
}

export default App

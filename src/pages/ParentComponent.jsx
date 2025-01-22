import { useState, useEffect } from 'react'
import ProfileUpdate from './ProfileUpdate'
import client from '../components/services/config'

const ParentComponent = () => {
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await client.get('/user/profile')
        setCurrentUser(response.data)
      } catch (error) {
        console.error('Error fetching current user:', error)
      }
    }

    fetchCurrentUser()
  }, [])

  if (!currentUser) return <p>Loading...</p>

  return (
    <div>
      <ProfileUpdate
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
      />
    </div>
  )
}

export default ParentComponent

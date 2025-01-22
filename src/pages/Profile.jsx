import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import client from '../components/services/config'

const Profile = ({ logOut }) => {
  const [user, setUser] = useState(null)
  const [chats, setChats] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserProfileAndChats = async () => {
      try {
        const profileResponse = await client.get('/user/profile')
        setUser(profileResponse.data)

        const chatsResponse = await client.get('/chat') // Correct route
        setChats(chatsResponse.data.data)
      } catch (err) {
        setError('Failed to load profile or chats. Please try again.')
        console.error('Error fetching profile or chats:', err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfileAndChats()
  }, [])

  if (loading) return <p>Loading...</p>
  if (error) return <p style={{ color: 'red' }}>{error}</p>

  return (
    <main>
      <h1>Profile</h1>
      <div>
        <img
          src={user.avatar || '/noavatar.jpg'}
          alt="Profile"
          style={{ width: '150px', height: '150px', borderRadius: '50%' }}
        />
        <p>
          <strong>Username:</strong> {user.username}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <Link to="/ProfileUpdate">
          <button>Update Profile</button>
        </Link>
        <button onClick={logOut} style={{ marginLeft: '10px' }}>
          Signout
        </button>
      </div>

      <section>
        <h2>Your Chats</h2>
        {chats.length > 0 ? (
          chats.map((chat) => (
            <div key={chat._id}>
              <p>
                <strong>Participants:</strong>{' '}
                {chat.userIDs.map((u) => u.username).join(', ')}
              </p>
              <Link to={`/chat/${chat._id}`}>
                <button>Open Chat</button>
              </Link>
            </div>
          ))
        ) : (
          <p>No chats available.</p>
        )}
      </section>
    </main>
  )
}

export default Profile

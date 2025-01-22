import { useState, useEffect } from 'react'
import client from '../components/services/config'
import UploadWidget from '../components/UploadWidget'

const ProfileUpdate = ({ currentUser, setCurrentUser }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  })

  const [avatar, setAvatar] = useState(currentUser?.avatar || '')

  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username || '',
        email: currentUser.email || '',
        password: ''
      })
      setAvatar(currentUser.avatar || '')
    }
  }, [currentUser])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password || undefined,
        avatar
      }

      const response = await client.put(`/user/${currentUser._id}`, payload)

      if (response.status === 200) {
        console.log('Profile updated successfully!')
        const updatedUser = await client.get('/user/profile')
        setCurrentUser(updatedUser.data)

        setFormData({
          username: updatedUser.data.username || '',
          email: updatedUser.data.email || '',
          password: ''
        })
        setAvatar(updatedUser.data.avatar || '')
        alert('Profile updated successfully!')
      }
    } catch (error) {
      console.error(
        'Error updating profile:',
        error.response?.data || error.message
      )
    }
  }

  return (
    <main>
      <h1>Update Your Profile</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <img
            src={avatar || '/noavatar.jpg'}
            alt="Avatar Preview"
            className="avatar"
            style={{ width: '100px', height: '100px', borderRadius: '50%' }}
          />
          <UploadWidget
            uwConfig={{
              cloudName: 'dvlvwy9zp',
              uploadPreset: 'marketing',
              folder: 'avatars',
              multiple: false,
              maxImageFileSize: 2000000
            }}
            setImages={(newAvatar) => setAvatar(newAvatar)} // Single image handling
          />
        </div>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your username"
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter new password (optional)"
          />
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </main>
  )
}

export default ProfileUpdate

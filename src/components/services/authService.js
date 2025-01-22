import client from './config'

export const signUp = async (data) => {
  const response = await client.post('/auth/signup', data)
  const token = response.data.token
}

export const signIn = async (data) => {
  const response = await client.post('/auth/signin', data)
  const token = response.data.token
  localStorage.setItem('authToken', token)
}

export const logOut = async () => {
  try {
    await client.post('/auth/signout')
    localStorage.removeItem('authToken')
    localStorage.removeItem('userId')
    setUser(null)
    alert('Logged out successfully!')
  } catch (err) {
    console.error('Error logging out:', err.message)
    alert('Failed to log out. Please try again.')
  }
}

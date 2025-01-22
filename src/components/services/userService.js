import client from './config'

export const getProfile = async () => {
  const response = await client.get('/user/profile')
  const user = response.data
  localStorage.setItem('userId', user._id)
  return user
}

export const getChats = async () => {
  const response = await client.get('/chat')
  return response.data
}

import client from './config'

export const signUp = async (data) => {
  const response = await client.post('/auth/signup', data)
  const token = response.data.token
  localStorage.setItem('authToken', token)
}

export const signIn = async (data) => {
  const response = await client.post('/auth/signin', data)
  const token = response.data.token
  localStorage.setItem('authToken', token)
}

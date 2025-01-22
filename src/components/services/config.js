import axios from 'axios'

const client = axios.create({
  baseURL: import.meta.env.VITE_REACT_Back_End_URL || 'http://localhost:3000',
  withCredentials: true
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      console.error('Unauthorized. Redirecting to login.')
      localStorage.removeItem('authToken')
      window.location.href = '/auth/signin'
    } else {
      console.error(
        'API Error:',
        error?.response?.status,
        error?.response?.data?.message || error.message
      )
    }
    return Promise.reject(error)
  }
)

export default client

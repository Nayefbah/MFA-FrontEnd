import axios from 'axios'

const client = axios.create({
  baseURL: import.meta.env.VITE_BACK_END_URL
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      console.error('Unauthorized.')
      localStorage.removeItem('authToken')
    }
    return Promise.reject(error)
  }
)
export default client

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signIn } from '../../components/services/authService'

const initialFormData = {
  username: '',
  password: ''
}

const Signin = ({ getUserProfile }) => {
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({ username: '', password: '' })
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await signIn(formData)
      await getUserProfile()
      navigate('/')
    } catch (error) {
      if (error.response?.status === 401) {
        setMessage('Invalid username or password.')
      } else {
        setMessage(
          error.response?.data?.error || 'An unexpected error occurred.'
        )
      }
    }
  }

  const isFormInvalid = () => {
    return !(formData.username && formData.password)
  }

  return (
    <main>
      <h1>Log In</h1>
      {message && <p style={{ color: 'red' }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
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
          />
        </div>
        <button disabled={isFormInvalid()}>Log In</button>
        <Link to="/" className="button-link">
          Cancel
        </Link>
      </form>
    </main>
  )
}

export default Signin

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signUp } from '../../components/services/authService'

const initialFormData = {
  username: '',
  email: '',
  password: '',
  passwordConf: ''
}

const Signup = ({ getUserProfile }) => {
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState(initialFormData)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const validateForm = () => {
    if (!formData.username) return 'Username is required.'
    if (!/\S+@\S+\.\S+/.test(formData.email)) return 'Invalid email format.'
    if (formData.password.length < 6)
      return 'Password must be at least 6 characters.'
    if (formData.password !== formData.passwordConf)
      return 'Passwords do not match.'
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validationError = validateForm()
    if (validationError) {
      setMessage(validationError)
      return
    }

    setIsLoading(true)
    try {
      await signUp(formData)
      await getUserProfile()
      setFormData(initialFormData)
      navigate('/dashboard')
    } catch (error) {
      setMessage(
        error.response?.data?.error || 'An error occurred. Please try again.'
      )
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const isFormInvalid = () => {
    return !(
      formData.username &&
      formData.email &&
      formData.password &&
      formData.password === formData.passwordConf
    )
  }

  return (
    <main>
      <h1>Create an Account</h1>
      {message && <p className="error-message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            id="username"
            value={formData.username}
            name="username"
            placeholder="Username"
            onChange={handleChange}
          />
        </div>
        <div>
          <input
            type="email"
            id="email"
            value={formData.email}
            name="email"
            placeholder="Email"
            onChange={handleChange}
          />
        </div>
        <div>
          <input
            type="password"
            id="password"
            value={formData.password}
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />
        </div>
        <div>
          <input
            type="password"
            id="confirm"
            value={formData.passwordConf}
            name="passwordConf"
            placeholder="Confirm Password"
            onChange={handleChange}
          />
        </div>
        <section>
          <button disabled={isFormInvalid() || isLoading}>
            {isLoading ? 'Submitting...' : 'Sign Up'}
          </button>
          <Link to="/" className="button-link">
            Cancel
          </Link>
          <div>
            <Link to="/auth/signin">Do you have an account?</Link>
          </div>
        </section>
      </form>
    </main>
  )
}

export default Signup

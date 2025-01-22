import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import client from '../components/services/config'
import './SinglePage.css'

const SinglePage = () => {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isSeller, setIsSeller] = useState(false)
  const [error, setError] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0) // Track the current image index
  const navigate = useNavigate()

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await client.get(`/items/${id}`)
        const fetchedItem = response.data
        setItem(fetchedItem)

        const userId = localStorage.getItem('userId') // Get the logged-in user's ID

        console.log('Logged-in User ID (localStorage):', userId)
        console.log('Item Seller ID:', fetchedItem.sellerId._id)

        // Check if the logged-in user is the seller
        if (userId && String(userId) === String(fetchedItem.sellerId._id)) {
          setIsSeller(true)
        } else if (!userId) {
          navigate('/') // Redirect to homepage if not logged in
        }
      } catch (err) {
        console.error('Error fetching item:', err)
        setError('Failed to fetch item. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchItem()
  }, [id, navigate])

  const handleEdit = () => {
    navigate(`/edit-item/${id}`) // Navigate to the Edit page
  }

  const handleDelete = async () => {
    try {
      await client.delete(`/items/${id}`)
      alert('Item deleted successfully.')
      navigate('/dashboard') // Redirect to the dashboard after deletion
    } catch (err) {
      console.error('Error deleting item:', err)
      alert('Failed to delete the item. Please try again.')
    }
  }

  const handleChat = async () => {
    try {
      const response = await client.post('/chat', {
        receiverId: item.sellerId._id // Send the seller's ID to the backend
      })

      // Navigate to the chat page using the chat ID
      navigate(`/chat/${response.data._id}`)
    } catch (err) {
      console.error('Error starting chat:', err)
      alert('Failed to start chat with the seller.')
    }
  }

  const handleSignIn = () => {
    navigate('/auth/signin') // Navigate to the sign-in page
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>
  if (!item) return <div>Item not found</div>

  const isLoggedIn = !!localStorage.getItem('authToken') // Check if the user is logged in

  return (
    <div className="single-page-container">
      <h1>{item.title}</h1>

      {/* Seller Information */}
      <p>
        <strong>Seller:</strong> {item.sellerId?.username || 'Unknown'}
      </p>

      {/* Image Slider */}
      <div className="slider-container">
        {item.images && item.images.length > 0 ? (
          <div>
            <button
              className="slider-button prev"
              onClick={() =>
                setCurrentIndex((prev) =>
                  prev === 0 ? item.images.length - 1 : prev - 1
                )
              }
            >
              &#10094; {/* Left arrow */}
            </button>
            <img
              src={item.images[currentIndex]} // Show the current image
              alt={`Image of ${item.title}`}
              className="slider-image"
            />
            <button
              className="slider-button next"
              onClick={() =>
                setCurrentIndex((prev) =>
                  prev === item.images.length - 1 ? 0 : prev + 1
                )
              }
            >
              &#10095; {/* Right arrow */}
            </button>
          </div>
        ) : (
          <p>No images available</p>
        )}
      </div>

      <p>
        <strong>Price:</strong> ${item.price}
      </p>
      <p>
        <strong>Category:</strong> {item.category}
      </p>
      <p>
        <strong>Description:</strong> {item.description}
      </p>

      {isSeller ? (
        <div className="seller-actions">
          <button className="edit-button" onClick={handleEdit}>
            Edit Item
          </button>
          <button className="delete-button" onClick={handleDelete}>
            Delete Item
          </button>
        </div>
      ) : isLoggedIn ? (
        <button className="chat-button" onClick={handleChat}>
          Chat with Seller
        </button>
      ) : (
        <button className="signin-button" onClick={handleSignIn}>
          Sign in to Chat
        </button>
      )}
    </div>
  )
}

export default SinglePage

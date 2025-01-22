import { useEffect, useState } from 'react'
import client from '../components/services/config'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'

const Home = () => {
  const [items, setItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true)
        const userId = localStorage.getItem('userId')

        const response = await client.get('/items')
        const allFetchedItems = response.data.items

        if (userId) {
          const filteredItems = allFetchedItems.filter(
            (item) => item.sellerId !== userId
          )
          setItems(filteredItems)
          setFilteredItems(filteredItems)
        } else {
          setItems(allFetchedItems)
          setFilteredItems(allFetchedItems)
        }
      } catch (err) {
        console.error('Error fetching items:', err)
        setError('Failed to load items. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [])

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase()
    setSearchQuery(query)

    const filtered = items.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
    )
    setFilteredItems(filtered)
  }

  const handleNavigateToSinglePage = (itemId) => {
    navigate(`/dashboard/${itemId}`) // Navigate to the Single Page
  }

  const handleChatWithSeller = async (sellerId) => {
    try {
      const response = await client.post('/chat', { receiverId: sellerId }) // Correct endpoint
      const chatId = response.data.data._id // Extract chat ID from response
      navigate(`/chat/${chatId}`) // Navigate to the chat page
    } catch (err) {
      console.error('Error starting chat with seller:', err.message)
      alert('Failed to start chat with the seller. Please try again.')
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>
  if (filteredItems.length === 0) return <div>No items found</div>

  return (
    <div className="dashboard">
      <h1>Home</h1>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by title or category..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      <div className="card-container">
        {filteredItems.map((item) => (
          <div key={item._id} className="card">
            <h3 className="card-title">{item.title}</h3>
            <img
              src={item.images?.[0] || 'https://via.placeholder.com/150'}
              alt={item.title}
              className="card-image"
              onClick={() => handleNavigateToSinglePage(item._id)} // Navigate to single page
            />
            <p className="card-description">{item.description}</p>
            <p className="card-price">{item.price} BD</p>

            {/* Chat with Seller Button */}
            <button
              onClick={() => handleChatWithSeller(item.sellerId)}
              className="chat-button"
            >
              Chat with Seller
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home

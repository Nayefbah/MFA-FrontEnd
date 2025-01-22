import { useEffect, useState } from 'react'
import client from '../components/services/config'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'

const Dashboard = () => {
  const [myItems, setMyItems] = useState([]) // Items being sold by the logged-in user
  const [filteredItems, setFilteredItems] = useState([]) // Filtered items after search
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('') // Search query
  const navigate = useNavigate()

  useEffect(() => {
    const fetchMyItems = async () => {
      try {
        setLoading(true)

        // Get the logged-in user's ID from localStorage
        const user = JSON.parse(localStorage.getItem('user'))
        const userId = user?._id

        if (!userId) {
          navigate('/auth/signin') // Redirect to login if no user
          return
        }

        // Fetch items sold by the logged-in user
        const response = await client.get(`/items?userId=${userId}`)
        const fetchedItems = response.data.items || []
        const userItems = fetchedItems.filter(
          (item) => item.sellerId === userId
        )

        setMyItems(userItems) // Set items belonging to the logged-in user
        setFilteredItems(userItems) // Set initial filtered items
      } catch (err) {
        console.error('Error fetching your items:', err)
        setError('Failed to load your items. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchMyItems()
  }, [navigate])

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase()
    setSearchQuery(query)

    // Filter items by title or category
    const filtered = myItems.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
    )
    setFilteredItems(filtered)
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>
  if (filteredItems.length === 0)
    return <div>You are not selling any items.</div>

  return (
    <div className="dashboard">
      <h1>My Items</h1>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by title or category..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {/* Item Cards */}
      <div className="card-container">
        {filteredItems.map((item) => (
          <div
            key={item._id}
            className="card"
            onClick={() => navigate(`/dashboard/${item._id}`)} // Navigate to item details
          >
            <h3 className="card-title">{item.title}</h3>
            <img
              src={item.images?.[0] || 'https://via.placeholder.com/150'}
              alt={item.title}
              className="card-image"
            />
            <p className="card-description">{item.description}</p>
            <p className="card-price">{item.price} BD</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard

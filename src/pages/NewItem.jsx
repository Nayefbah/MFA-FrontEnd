import { useState } from 'react'
import client from '../components/services/config'
import UploadWidget from '../components/UploadWidget'
import { useNavigate } from 'react-router-dom'

const NewItem = ({ currentUser }) => {
  const [images, setImages] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: 'electronics',
    condition: 'new',
    description: ''
  })
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleImagesUpdate = (newImage) => {
    setImages((prev) => {
      // Ensure newImage is valid and update state
      const updatedImages = Array.isArray(prev)
        ? [...prev, newImage]
        : [newImage]
      return updatedImages.filter(
        (img) => typeof img === 'string' && img.startsWith('http')
      ) // Only valid URLs
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!currentUser) {
      setMessage('You must be logged in to post an item.')
      return
    }

    try {
      const payload = { ...formData, images }
      const response = await client.post('/items', payload)

      if (response.status === 201) {
        setMessage('Item posted successfully!')
        setFormData({
          title: '',
          price: '',
          category: 'electronics',
          condition: 'new',
          description: ''
        })
        setImages([])
        navigate('/' + response.data.id)
      }
    } catch (error) {
      console.error(
        'Error posting item:',
        error.response?.data || error.message
      )
      setMessage('Failed to post the item. Please try again.')
    }
  }

  return (
    <main className="form-container">
      <h1>Create a New Item</h1>
      {message && <p className="form-message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter item title"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Enter item price"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="electronics">Electronics</option>
            <option value="vehicles">Vehicles</option>
            <option value="tools">Tools</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="condition">Condition:</label>
          <select
            id="condition"
            name="condition"
            value={formData.condition}
            onChange={handleChange}
          >
            <option value="new">New</option>
            <option value="used">Used</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter item description"
            required
          />
        </div>
        <div className="image-preview">
          {Array.isArray(images) &&
            images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Preview ${index}`}
                className="image-preview-thumbnail"
              />
            ))}
        </div>
        <div className="form-group">
          <UploadWidget
            uwConfig={{
              cloudName: 'dvlvwy9zp',
              uploadPreset: 'marketing',
              folder: 'items',
              multiple: true,
              maxImageFileSize: 2000000
            }}
            setImages={handleImagesUpdate} // Use the updated function
          />
        </div>
        <button type="submit" className="form-submit-button">
          Post Item
        </button>
      </form>
    </main>
  )
}

export default NewItem

import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import client from '../components/services/config'
import UploadWidget from '../components/UploadWidget'

const EditItem = ({ currentUser }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: '',
    condition: '',
    description: '',
    images: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await client.get(`/items/${id}`)
        const item = response.data

        if (currentUser?._id !== item.sellerId._id) {
          alert('You are not authorized to edit this item.')
          navigate('/')
          return
        }

        // Sanitize server response
        const sanitizedImages = (item.images || []).filter(
          (image) => typeof image === 'string' && image.startsWith('http')
        )

        setFormData({
          title: item.title,
          price: item.price,
          category: item.category,
          condition: item.condition,
          description: item.description,
          images: sanitizedImages
        })
      } catch (err) {
        console.error('Error fetching item:', err)
        setError('Failed to fetch item.')
      } finally {
        setLoading(false)
      }
    }

    fetchItem()
  }, [id, currentUser, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleNewImages = (newImages) => {
    setFormData((prev) => {
      const validNewImages = (
        Array.isArray(newImages) ? newImages : [newImages]
      ).filter((img) => typeof img === 'string' && img.startsWith('http'))

      const updatedImages = [...prev.images, ...validNewImages]
      return {
        ...prev,
        images: updatedImages
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const sanitizedImages = formData.images.filter(
      (image) => typeof image === 'string' && image.startsWith('http')
    )

    try {
      await client.put(`/items/${id}`, {
        ...formData,
        images: sanitizedImages
      })

      alert('Item updated successfully!')
      navigate('/dashboard')
    } catch (err) {
      console.error('Error updating item:', err)
      alert('Failed to update the item. Please try again.')
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return (
    <div className="form-container">
      <h1>Edit Item</h1>
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
            required
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
            required
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
        <div className="form-group">
          <label>Current Images:</label>
          <div className="image-preview">
            {formData.images
              .filter(
                (image) => typeof image === 'string' && image.startsWith('http')
              )
              .map((image, index) => (
                <div key={index} style={{ position: 'relative' }}>
                  <img
                    src={image}
                    alt={`Preview ${index}`}
                    className="image-preview-thumbnail"
                    onError={(e) => {
                      e.target.src = '' // Replace with a default placeholder if needed
                    }}
                  />
                  <button
                    type="button"
                    className="remove-image-button"
                    onClick={() => handleRemoveImage(index)}
                  >
                    &times;
                  </button>
                </div>
              ))}
          </div>
        </div>
        <div className="form-group">
          <label>Upload New Images:</label>
          <UploadWidget
            uwConfig={{
              cloudName: 'dvlvwy9zp',
              uploadPreset: 'marketing',
              folder: 'items',
              multiple: true,
              maxImageFileSize: 2000000
            }}
            setImages={handleNewImages}
          />
        </div>
        <button type="submit" className="form-submit-button">
          Save Changes
        </button>
      </form>
    </div>
  )
}

export default EditItem

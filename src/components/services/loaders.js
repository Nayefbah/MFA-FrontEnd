import client from './config'

// Single Page Loader
export const singlePageLoader = async ({ params }) => {
  const res = await client.post(`/items/${params.id}`)
  return res.data
}

// Profile Page Loader
export const profilePageLoader = async () => {
  const response = await fetch('/api/chats', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })

  if (!response.ok) {
    throw new Error('Failed to fetch chats!')
  }

  const chatResponse = await response.json()
  return { chatResponse }
}

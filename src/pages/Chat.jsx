import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import client from '../components/services/config'
import './Chat.css' // Import the CSS file

const ChatPage = () => {
  const { id } = useParams() // Get chat ID from URL
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const response = await client.get(`/chat/${id}`) // Fetch chat details
        const chat = response.data.data
        setMessages(chat.messages) // Set chat messages
      } catch (err) {
        console.error('Error fetching chat:', err.message)
        setError('Failed to fetch chat messages.')
      }
    }

    fetchChat()
  }, [id])

  const sendMessage = async () => {
    try {
      const response = await client.post(`/chat/${id}/send-message`, {
        text: newMessage
      }) // Send new message
      setMessages((prev) => [...prev, response.data]) // Add new message to state
      setNewMessage('')
    } catch (err) {
      console.error('Error sending message:', err.message)
      setError('Failed to send message.')
    }
  }

  if (error) return <p style={{ color: 'red' }}>{error}</p>

  return (
    <div className="chat-container">
      <h1>Chat</h1>
      <div className="messages-container">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <span className="username">{msg.sender?.username || 'You'}:</span>
            <span className="text">{msg.text}</span>
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  )
}

export default ChatPage

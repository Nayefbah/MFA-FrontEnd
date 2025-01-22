import React from 'react'

const Chat = ({ chats }) => {
  return (
    <div className="chatList">
      {chats.map((chat) => (
        <div key={chat._id} className="chatItem">
          <img
            src={chat.userIDs[0]?.avatar || '/default-avatar.png'}
            alt={chat.userIDs[0]?.username}
            className="avatar"
          />
          <div>
            <h4>{chat.userIDs[0]?.username}</h4>
            <p>{chat.lastMessage || 'No messages yet.'}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Chat

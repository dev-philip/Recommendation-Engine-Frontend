import React, { useState } from 'react';
import './ChatBox.css';

const ChatBox = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = () => {
    if (input.trim() !== '') {
      setMessages([...messages, { text: input, user: 'You' }]);
      setInput('');
    }
  };

  return (
    <div className="chat-box">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className="message">
            <span className="user">{message.user}:</span> {message.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={handleInputChange}
        />
        <button onClick={handleSubmit}>Send</button>
        <button onClick={handleSubmit}>Upload</button>
      </div>
    </div>
  );
};

export default ChatBox;

import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:3000');

function App() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    socket.on('chat message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message) {
      socket.emit('chat message', message);
      setMessage('');
    }
  };

  const register = async (e) => {
    e.preventDefault();
    const response = await fetch('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    if (response.status === 201) alert('User registered');
  };

  const login = async (e) => {
    e.preventDefault();
    const response = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (response.status === 200) {
      const { token } = await response.json();
      localStorage.setItem('token', token);
      alert('User logged in');
      setUser(true); // Simulate a logged-in user
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="app">
      {!user ? (
        <div className="auth-container">
          <div className="form-container">
            <h2>Login</h2>
            <form onSubmit={login}>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
              <button type="submit">Login</button>
            </form>
          </div>
          <div className="form-container">
            <h2>Register</h2>
            <form onSubmit={register}>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
              <button type="submit">Register</button>
            </form>
          </div>
        </div>
      ) : (
        <div className="chat-container">
          <ul className="messages">
            {messages.map((msg, index) => (
              <li key={index} className="message">{msg}</li>
            ))}
          </ul>
          <form className="input-form" onSubmit={sendMessage}>
            <input className="input" value={message} onChange={(e) => setMessage(e.target.value)} />
            <button className="send-button" type="submit">Send</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;

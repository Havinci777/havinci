import { useState, useEffect, useRef } from 'react';
import './App.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('https://havinci-production.up.railway.app', {
          credentials: 'include'
        });
        const data = await response.json();
        
        if (data.authenticated) {
          setIsAuthenticated(true);
          setUser(data.user);
          
          // Add welcome message
          setMessages([
            { 
              role: 'assistant', 
              content: 'Hello! I\'m Havinci, your email intelligence assistant. Ask me anything about your emails, and I\'ll help you find the information you need.' 
            }
          ]);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      }
    };
    
    checkAuthStatus();
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle login
  const handleLogin = () => {
    window.location.href = 'http://localhost:3000/auth/google';
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch('http://localhost:3000/auth/logout', {
        credentials: 'include'
      });
      setIsAuthenticated(false);
      setUser(null);
      setMessages([]);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message to chat
    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Send query to backend
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ query: input })
      });
      
      const data = await response.json();
      
      // Add assistant response to chat
      const assistantMessage: Message = { role: 'assistant', content: data.response };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message
      const errorMessage: Message = { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error processing your request. Please try again.' 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Havinci</h1>
        {isAuthenticated && user && (
          <div className="user-info">
            <span>{user.name}</span>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </div>
        )}
      </header>
      
      <main className="app-main">
        {!isAuthenticated ? (
          <div className="login-container">
            <h2>Email Intelligence Assistant</h2>
            <p>Connect your Gmail account to get started.</p>
            <button onClick={handleLogin} className="login-button">
              Login with Google
            </button>
          </div>
        ) : (
          <>
            <div className="messages-container">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
                >
                  <div className="message-content">{message.content}</div>
                </div>
              ))}
              {isLoading && (
                <div className="message assistant-message">
                  <div className="message-content loading">
                    <div className="loading-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <form onSubmit={handleSubmit} className="input-form">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your emails..."
                disabled={isLoading}
              />
              <button type="submit" disabled={isLoading || !input.trim()}>
                Send
              </button>
            </form>
          </>
        )}
      </main>
      
      <footer className="app-footer">
        <p>Havinci - Email Intelligence Assistant</p>
      </footer>
    </div>
  );
}

export default App;

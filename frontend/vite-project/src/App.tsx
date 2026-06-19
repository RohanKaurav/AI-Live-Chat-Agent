
import { useState, useRef, useEffect,type FormEvent } from 'react';
import { Send } from 'lucide-react';
import { sendMessage } from './api/chat';
import './App.css'; 

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

function App() {

  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'ai', text: 'Hello! Welcome to Spur Store. How can I help you today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>(
    localStorage.getItem('chatSessionId') || undefined
  );
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessageText = inputValue.trim();
    setInputValue('');
    
  
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: userMessageText,
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      
      const response = await sendMessage(userMessageText, sessionId);
      
      if (response.sessionId && response.sessionId !== sessionId) {
        setSessionId(response.sessionId);
        localStorage.setItem('chatSessionId', response.sessionId);
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: response.reply,
      };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'Sorry, I am having trouble connecting to the server right now. Please try again later.',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        Spur Support
      </div>
      
      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        
        {isLoading && (
          <div className="message ai typing-indicator">
            Agent is typing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-area" onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Type your message..." 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isLoading}
        />
        <button type="submit" disabled={!inputValue.trim() || isLoading}>
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}

export default App;

'use client';

import { useState, useRef, useEffect } from 'react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! I am your space travel assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message to state
    const userMsg = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Call API to get bot reply
    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation: messages.concat(userMsg) })
      });
      
      const data = await res.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Add bot reply to state
      const botReply = { sender: 'bot', text: data.reply };
      setMessages(prev => [...prev, botReply]);
    } catch (err) {
      console.error('Chatbot error:', err);
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: 'Sorry, I encountered an error. Please try again later.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-primary/90 hover:bg-primary text-black p-3 rounded-full shadow-lg transition-transform transform hover:scale-105 neon-border"
        aria-label="Toggle chat"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat widget */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 sm:w-96 bg-gray-800/90 backdrop-blur-md rounded-lg shadow-2xl z-50 flex flex-col border border-primary/20 overflow-hidden">
          <div className="p-3 bg-gray-900 border-b border-gray-700 flex justify-between items-center">
            <h3 className="text-white font-semibold flex items-center">
              <span className="text-primary">🛰️</span>
              <span className="ml-2">Space Assistant</span>
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto max-h-[50vh]">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`mb-3 ${
                  msg.sender === 'user' ? 'text-right' : 'text-left'
                }`}
              >
                <div
                  className={`inline-block px-4 py-2 rounded-lg ${
                    msg.sender === 'user'
                      ? 'bg-primary/20 text-white'
                      : 'bg-gray-700 text-white'
                  }`}
                >
                  {msg.text}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {msg.sender === 'user' ? 'You' : 'Assistant'}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="text-left mb-3">
                <div className="inline-block px-4 py-2 rounded-lg bg-gray-700 text-white">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Assistant is typing...
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-3 border-t border-gray-700 bg-gray-800">
            <div className="flex space-x-2">
              <textarea
                className="flex-1 bg-gray-700 text-white p-2 rounded resize-none outline-none focus:ring-1 focus:ring-primary"
                placeholder="Type a message..."
                rows="2"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className={`px-4 py-2 bg-primary text-black rounded ${
                  isLoading || !input.trim()
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-primary/80'
                }`}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 
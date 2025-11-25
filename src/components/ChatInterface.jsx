import React, { useState, useRef, useEffect } from 'react';

const ChatInterface = ({ messages, onSendMessage, loading }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !loading) {
      onSendMessage(input);
      setInput('');
    }
  };

  const quickActions = [
    { label: 'Color Magic', icon: '🎨', prompt: 'Can you show me this design in different color options? Give me the most stunning palettes!' },
    { label: 'All Angles', icon: '🔄', prompt: 'Can you generate views from different angles? I want to see every detail!' },
    { label: 'Fabric Vibes', icon: '✨', prompt: 'What fabric would work best for this design? Give me options that feel amazing!' },
    { label: 'Teach Me', icon: '💡', prompt: 'How do I make this? Break it down for me step by step!' },
  ];

  const handleQuickAction = (prompt) => {
    if (!loading) {
      onSendMessage(prompt);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-card shadow-md">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12 text-text-secondary">
            <div className="text-6xl mb-4 animate-float">💕</div>
            <p className="text-xl font-bold gradient-text">Hey bestie! Ready to create?</p>
            <p className="text-sm mt-2">Upload your sketch and let's make something amazing together! ✨</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  msg.role === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-surface text-text-primary'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="text-2xl mb-2">🤖</div>
                )}
                <div className="whitespace-pre-wrap">{msg.content}</div>
                {msg.timestamp && (
                  <div className={`text-xs mt-2 ${
                    msg.role === 'user' ? 'text-white/70' : 'text-text-secondary'
                  }`}>
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-surface rounded-lg p-4 max-w-[80%]">
              <div className="flex items-center space-x-2">
                <div className="animate-bounce">🤖</div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-100"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-200"></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length > 0 && (
        <div className="border-t border-border p-4 bg-gradient-to-r from-pink-50 to-purple-50">
          <p className="text-xs font-bold gradient-text mb-3 uppercase tracking-wider">✨ Quick Vibes</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action.prompt)}
                disabled={loading}
                className="px-3 py-2 bg-white hover:bg-gradient-to-r hover:from-pink-100 hover:to-purple-100
                         rounded-button text-sm font-semibold transition-all duration-300
                         disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center justify-center space-x-1 border-2 border-border
                         hover:border-primary hover:shadow-md hover:scale-105"
              >
                <span>{action.icon}</span>
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="border-t border-border p-4 bg-white">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What's on your mind? Ask me anything! 💭"
            className="input-field flex-1"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed px-6"
          >
            {loading ? '...' : '✨ Send'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;

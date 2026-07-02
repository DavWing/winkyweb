'use client';

import { useState, useRef, useEffect } from 'react';
import { Conversation } from '@/lib/types';
import AISuggestions from './AISuggestions';

interface ChatWindowProps {
  conversation: Conversation;
}

const channelIcons: Record<string, string> = {
  email: '📧',
  whatsapp: '💬',
  wechat: '🔐',
};

const channelLabels: Record<string, string> = {
  email: 'Email',
  whatsapp: 'WhatsApp',
  wechat: 'WeChat',
};

export default function ChatWindow({ conversation }: ChatWindowProps) {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    console.log('Sending message:', message);
    setMessage('');
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffMinutes = Math.floor((now.getTime() - messageDate.getTime()) / 60000);

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return messageDate.toLocaleDateString();
  };

  return (
    <div className="flex-1 flex flex-col hidden md:flex bg-white">
      {/* Chat Header */}
      <div className="border-b border-[#e4f2fc] p-4 bg-gradient-to-r from-[#fcedf2]/50 to-[#e4f2fc]/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">
              {channelIcons[conversation.customer.preferredChannel]}
            </div>
            <div>
              <h2 className="font-bold text-gray-900">
                {conversation.customer.name}
              </h2>
              <p className="text-sm text-gray-600">
                {channelLabels[conversation.customer.preferredChannel]} •{' '}
                {conversation.customer.language === 'zh' ? '中文' : 'English'}
              </p>
            </div>
          </div>
          <a
            href={`/customer/${conversation.customerId}`}
            className="text-sm bg-[#e4f2fc] hover:bg-[#d4e5f5] text-gray-900 px-3 py-1 rounded-lg transition-colors"
          >
            View Profile
          </a>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation.messages.map((msg, index) => {
          const isCustomer = msg.sender === 'customer';
          const showDate =
            index === 0 ||
            new Date(conversation.messages[index - 1].timestamp).toDateString() !==
              new Date(msg.timestamp).toDateString();

          return (
            <div key={msg.id}>
              {showDate && (
                <div className="flex items-center space-x-2 my-4">
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <span className="text-xs text-gray-500">
                    {new Date(msg.timestamp).toLocaleDateString()}
                  </span>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>
              )}

              <div className={`flex ${isCustomer ? 'justify-start' : 'justify-end'}`}>
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    isCustomer
                      ? 'bg-gray-100 text-gray-900'
                      : 'bg-[#fcedf2] text-gray-900'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {msg.content}
                  </p>
                  <p className="text-xs text-gray-600 mt-1 text-right">
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* AI Suggestions */}
      <AISuggestions customerId={conversation.customerId} />

      {/* Input Area */}
      <div className="border-t border-[#e4f2fc] p-4 bg-gray-50">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-[#e4f2fc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fcedf2]"
          />
          <button
            type="submit"
            className="bg-[#fcedf2] hover:bg-[#f9dce5] text-gray-900 px-6 py-2 rounded-lg transition-colors font-medium"
          >
            Send
          </button>
        </form>
        <p className="text-xs text-gray-600 mt-2 text-center">
          💡 Tip: Use the AI suggestions below to get draft messages
        </p>
      </div>
    </div>
  );
}

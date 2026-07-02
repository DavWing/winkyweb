'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { Conversation } from '@/lib/types';
import { getConversations, getConversation } from '@/lib/db';
import ConversationList from '@/components/ConversationList';
import ChatWindow from '@/components/ChatWindow';

function InboxContent() {
  const searchParams = useSearchParams();
  const selectedCustomerId = searchParams.get('customer');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const convos = getConversations();
    setConversations(convos);

    if (selectedCustomerId) {
      const convo = getConversation(selectedCustomerId);
      if (convo) {
        setSelectedConversation(convo);
      }
    } else if (convos.length > 0) {
      setSelectedConversation(convos[0]);
    }

    setLoading(false);
  }, [selectedCustomerId]);

  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-br from-[#fcedf2] to-[#e4f2fc] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#e4f2fc] border-t-[#fcedf2] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-[#fcedf2] to-[#e4f2fc]">
      {/* Header */}
      <header className="bg-white border-b border-[#e4f2fc] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">💬 Unified Inbox</h1>
              <p className="text-sm text-gray-600 mt-1">Email • WhatsApp • WeChat</p>
            </div>
            <a
              href="/"
              className="bg-[#e4f2fc] hover:bg-[#d4e5f5] text-gray-900 px-4 py-2 rounded-lg transition-colors font-medium text-sm"
            >
              ← Back to Dashboard
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Conversation List */}
        <ConversationList
          conversations={conversations}
          selectedConversation={selectedConversation}
          onSelectConversation={setSelectedConversation}
        />

        {/* Chat Window */}
        {selectedConversation ? (
          <ChatWindow conversation={selectedConversation} />
        ) : (
          <div className="flex-1 hidden md:flex items-center justify-center bg-white">
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">No conversation selected</h2>
              <p className="text-gray-600">Select a conversation from the list to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function InboxPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen bg-gradient-to-br from-[#fcedf2] to-[#e4f2fc] flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#e4f2fc] border-t-[#fcedf2] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <InboxContent />
    </Suspense>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { DashboardOverview, FollowUpSuggestion } from '@/lib/types';
import { getDashboardOverview } from '@/lib/db';
import DashboardCard from '@/components/DashboardCard';
import FollowUpList from '@/components/FollowUpList';
import InboxButton from '@/components/InboxButton';

export default function Home() {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = getDashboardOverview();
    setOverview(data);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fcedf2] to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#e4f2fc] border-t-[#fcedf2] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fcedf2] to-white flex items-center justify-center">
        <p className="text-red-600">Failed to load dashboard</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fcedf2] via-white to-[#e4f2fc]">
      {/* Header */}
      <header className="bg-white border-b border-[#e4f2fc] shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome, Winky! 👋</h1>
              <p className="text-gray-600 mt-1">
                {overview.todayFollowUps.length} customers to follow up with today
              </p>
            </div>
            <InboxButton unreadCount={overview.unreadMessages} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <DashboardCard
            title="Total Customers"
            value={overview.totalCustomers}
            icon="👥"
            color="bg-[#e4f2fc]"
          />
          <DashboardCard
            title="Today's Follow-ups"
            value={overview.todayFollowUps.length}
            icon="📋"
            color="bg-[#fcedf2]"
            highlight={overview.todayFollowUps.length > 0}
          />
          <DashboardCard
            title="Unread Messages"
            value={overview.unreadMessages}
            icon="💬"
            color="bg-blue-100"
            highlight={overview.unreadMessages > 0}
          />
          <DashboardCard
            title="Active Conversations"
            value={Object.values(overview.conversationsByChannel).reduce((a, b) => a + b, 0)}
            icon="📞"
            color="bg-pink-100"
          />
        </div>

        {/* Channel Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-[#e4f2fc] p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Messages by Channel</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-[#fcedf2] to-white rounded-lg border border-[#e4f2fc]">
              <div className="text-3xl">💬</div>
              <div>
                <p className="text-sm text-gray-600">WhatsApp</p>
                <p className="text-2xl font-bold text-gray-900">{overview.conversationsByChannel.whatsapp || 0}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-[#e4f2fc] to-white rounded-lg border border-[#e4f2fc]">
              <div className="text-3xl">🔐</div>
              <div>
                <p className="text-sm text-gray-600">WeChat</p>
                <p className="text-2xl font-bold text-gray-900">{overview.conversationsByChannel.wechat || 0}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-100 to-white rounded-lg border border-[#e4f2fc]">
              <div className="text-3xl">📧</div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-2xl font-bold text-gray-900">{overview.conversationsByChannel.email || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Follow-ups */}
        {overview.todayFollowUps.length > 0 ? (
          <FollowUpList followUps={overview.todayFollowUps} />
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-[#e4f2fc] p-8 text-center">
            <div className="text-6xl mb-4">✨</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">All caught up!</h3>
            <p className="text-gray-600">No follow-ups scheduled for today. Check your inbox for new messages!</p>
          </div>
        )}
      </main>
    </div>
  );
}

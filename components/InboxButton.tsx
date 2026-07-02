'use client';

import Link from 'next/link';

interface InboxButtonProps {
  unreadCount: number;
}

export default function InboxButton({ unreadCount }: InboxButtonProps) {
  return (
    <Link
      href="/inbox"
      className="relative inline-flex items-center space-x-2 bg-[#fcedf2] hover:bg-[#f9dce5] text-gray-900 px-4 py-2 rounded-lg transition-colors font-medium"
    >
      <span>💬 Inbox</span>
      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Link>
  );
}

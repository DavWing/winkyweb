'use client';

import { useState } from 'react';
import { FollowUpSuggestion } from '@/lib/types';

interface FollowUpCardProps {
  followUp: FollowUpSuggestion;
  isExpanded: boolean;
  onExpand: () => void;
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

export default function FollowUpCard({
  followUp,
  isExpanded,
  onExpand,
}: FollowUpCardProps) {
  const [draftMessage, setDraftMessage] = useState<string | null>(null);
  const [loadingDraft, setLoadingDraft] = useState(false);

  const handleGenerateDraft = async () => {
    setLoadingDraft(true);
    try {
      const response = await fetch('/api/ai-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: followUp.customerId,
          type: 'follow-up-message',
        }),
      });
      const data = await response.json();
      setDraftMessage(data.content);
    } catch (error) {
      console.error('Failed to generate draft:', error);
      setDraftMessage('Failed to generate message. Please try again.');
    } finally {
      setLoadingDraft(false);
    }
  };

  const handleCopyMessage = () => {
    if (draftMessage) {
      navigator.clipboard.writeText(draftMessage);
      alert('Message copied to clipboard!');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#e4f2fc] overflow-hidden transition-all">
      {/* Card Header */}
      <button
        onClick={onExpand}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-4 flex-1 text-left">
          <div className="text-3xl">{channelIcons[followUp.channel]}</div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-900 text-lg">{followUp.customerName}</h4>
            <p className="text-sm text-gray-600 mt-1">{followUp.reason}</p>
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                {channelLabels[followUp.channel]}
              </span>
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                {followUp.lastContactDaysAgo}d ago
              </span>
            </div>
          </div>
        </div>
        <div className="text-gray-400">
          {isExpanded ? '▼' : '▶'}
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-[#e4f2fc] bg-gradient-to-br from-[#fcedf2]/30 to-[#e4f2fc]/30 px-6 py-4 space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-700">Suggested Action:</p>
            <p className="text-sm text-gray-600">{followUp.suggestedAction}</p>
          </div>

          {/* AI Draft Message */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-700">💡 AI-Suggested Message:</p>
              {!draftMessage && (
                <button
                  onClick={handleGenerateDraft}
                  disabled={loadingDraft}
                  className="text-xs bg-[#fcedf2] hover:bg-[#f9dce5] text-gray-900 px-3 py-1 rounded-full transition-colors disabled:opacity-50"
                >
                  {loadingDraft ? '⏳ Generating...' : 'Generate'}
                </button>
              )}
            </div>

            {loadingDraft && (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-[#fcedf2] border-t-gray-900 rounded-full animate-spin"></div>
                <span className="text-sm text-gray-600">Generating message...</span>
              </div>
            )}

            {draftMessage && (
              <div className="bg-white border border-[#e4f2fc] rounded p-4">
                <p className="text-sm text-gray-900 whitespace-pre-wrap">{draftMessage}</p>
                <div className="flex space-x-2 mt-3">
                  <button
                    onClick={handleCopyMessage}
                    className="flex-1 text-xs bg-[#fcedf2] hover:bg-[#f9dce5] text-gray-900 px-3 py-2 rounded transition-colors font-medium"
                  >
                    📋 Copy Message
                  </button>
                  <button
                    onClick={() => setDraftMessage(null)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <a
              href={`/inbox?customer=${followUp.customerId}`}
              className="flex-1 text-center bg-[#e4f2fc] hover:bg-[#d4e5f5] text-gray-900 px-4 py-2 rounded-lg transition-colors font-medium text-sm"
            >
              📨 Open Chat
            </a>
            <button className="flex-1 bg-[#fcedf2] hover:bg-[#f9dce5] text-gray-900 px-4 py-2 rounded-lg transition-colors font-medium text-sm">
              ✓ Mark Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

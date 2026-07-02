'use client';

import { useState } from 'react';

interface AISuggestionsProps {
  customerId: string;
}

export default function AISuggestions({ customerId }: AISuggestionsProps) {
  const [expanded, setExpanded] = useState(false);
  const [draftReply, setDraftReply] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateDraft = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          type: 'draft-reply',
        }),
      });
      const data = await response.json();
      setDraftReply(data.content);
    } catch (error) {
      console.error('Failed to generate draft:', error);
      setDraftReply('Failed to generate message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUseDraft = () => {
    if (draftReply) {
      // In a real app, this would populate the message input
      navigator.clipboard.writeText(draftReply);
      alert('Draft copied to clipboard!');
    }
  };

  const handleClearDraft = () => {
    setDraftReply(null);
  };

  return (
    <div className="border-t border-[#e4f2fc] bg-gradient-to-r from-[#fcedf2]/20 to-[#e4f2fc]/20 p-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between text-left mb-2"
      >
        <span className="font-semibold text-gray-900 flex items-center space-x-2">
          <span>✨ AI Suggestions</span>
        </span>
        <span className="text-gray-600">{expanded ? '▼' : '▶'}</span>
      </button>

      {expanded && (
        <div className="space-y-3 mt-3">
          {!draftReply ? (
            <button
              onClick={handleGenerateDraft}
              disabled={loading}
              className="w-full bg-[#fcedf2] hover:bg-[#f9dce5] text-gray-900 px-4 py-2 rounded-lg transition-colors font-medium text-sm disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-900 border-t-[#fcedf2] rounded-full animate-spin"></div>
                  <span>Generating reply...</span>
                </>
              ) : (
                <>
                  <span>💬</span>
                  <span>Generate Reply Draft</span>
                </>
              )}
            </button>
          ) : (
            <div className="bg-white border border-[#e4f2fc] rounded-lg p-3 space-y-2">
              <div className="max-h-40 overflow-y-auto">
                <p className="text-sm text-gray-900 whitespace-pre-wrap">
                  {draftReply}
                </p>
              </div>
              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <button
                  onClick={handleUseDraft}
                  className="flex-1 text-xs bg-[#e4f2fc] hover:bg-[#d4e5f5] text-gray-900 px-3 py-1 rounded transition-colors font-medium"
                >
                  📋 Copy Draft
                </button>
                <button
                  onClick={handleClearDraft}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded transition-colors"
                >
                  ✕ Clear
                </button>
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-900">
              💡 <strong>Tip:</strong> Our AI generates context-aware replies considering the customer's
              status, preferred language, and communication channel.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { FollowUpSuggestion } from '@/lib/types';
import FollowUpCard from './FollowUpCard';

interface FollowUpListProps {
  followUps: FollowUpSuggestion[];
}

export default function FollowUpList({ followUps }: FollowUpListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const highPriority = followUps.filter(f => f.urgency === 'high');
  const mediumPriority = followUps.filter(f => f.urgency === 'medium');
  const lowPriority = followUps.filter(f => f.urgency === 'low');

  return (
    <div className="space-y-6">
      {/* High Priority */}
      {highPriority.length > 0 && (
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="h-3 w-3 rounded-full bg-red-500"></div>
            <h3 className="text-lg font-bold text-gray-900">🔴 Urgent Follow-ups</h3>
            <span className="text-sm bg-red-100 text-red-700 px-2 py-1 rounded-full">
              {highPriority.length}
            </span>
          </div>
          <div className="space-y-3">
            {highPriority.map(followUp => (
              <FollowUpCard
                key={followUp.customerId}
                followUp={followUp}
                isExpanded={expandedId === followUp.customerId}
                onExpand={() =>
                  setExpandedId(expandedId === followUp.customerId ? null : followUp.customerId)
                }
              />
            ))}
          </div>
        </div>
      )}

      {/* Medium Priority */}
      {mediumPriority.length > 0 && (
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
            <h3 className="text-lg font-bold text-gray-900">🟡 Regular Follow-ups</h3>
            <span className="text-sm bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
              {mediumPriority.length}
            </span>
          </div>
          <div className="space-y-3">
            {mediumPriority.map(followUp => (
              <FollowUpCard
                key={followUp.customerId}
                followUp={followUp}
                isExpanded={expandedId === followUp.customerId}
                onExpand={() =>
                  setExpandedId(expandedId === followUp.customerId ? null : followUp.customerId)
                }
              />
            ))}
          </div>
        </div>
      )}

      {/* Low Priority */}
      {lowPriority.length > 0 && (
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <h3 className="text-lg font-bold text-gray-900">🟢 Check-in Needed</h3>
            <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full">
              {lowPriority.length}
            </span>
          </div>
          <div className="space-y-3">
            {lowPriority.map(followUp => (
              <FollowUpCard
                key={followUp.customerId}
                followUp={followUp}
                isExpanded={expandedId === followUp.customerId}
                onExpand={() =>
                  setExpandedId(expandedId === followUp.customerId ? null : followUp.customerId)
                }
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import { Conversation } from '@/lib/types';

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
}

const channelIcons: Record<string, string> = {
  email: '📧',
  whatsapp: '💬',
  wechat: '🔐',
};

export default function ConversationList({
  conversations,
  selectedConversation,
  onSelectConversation,
}: ConversationListProps) {
  const sortedConversations = [...conversations].sort((a, b) => {
    const timeA = a.lastMessage?.timestamp.getTime() ?? 0;
    const timeB = b.lastMessage?.timestamp.getTime() ?? 0;
    return timeB - timeA;
  });

  return (
    <div className="w-full md:w-80 bg-white border-r border-[#e4f2fc] flex flex-col overflow-hidden">
      {/* Search Bar */}
      <div className="p-4 border-b border-[#e4f2fc]">
        <input
          type="text"
          placeholder="Search conversations..."
          className="w-full px-4 py-2 bg-gray-100 rounded-lg text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#fcedf2]"
        />
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto">
        {sortedConversations.length === 0 ? (
          <div className="p-4 text-center text-gray-600">
            No conversations yet
          </div>
        ) : (
          sortedConversations.map(conversation => (
            <button
              key={conversation.customerId}
              onClick={() => onSelectConversation(conversation)}
              className={`w-full px-4 py-3 text-left border-b border-gray-100 transition-colors ${
                selectedConversation?.customerId === conversation.customerId
                  ? 'bg-[#fcedf2] border-[#e4f2fc]'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="text-2xl">
                  {channelIcons[conversation.customer.preferredChannel]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {conversation.customer.name}
                    </h3>
                    {conversation.unreadCount > 0 && (
                      <span className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 truncate mt-1">
                    {conversation.lastMessage?.content || 'No messages yet'}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-gray-500">
                      {conversation.customer.preferredChannel === 'wechat' && '🔐 WeChat'}
                      {conversation.customer.preferredChannel === 'whatsapp' && '💬 WhatsApp'}
                      {conversation.customer.preferredChannel === 'email' && '📧 Email'}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

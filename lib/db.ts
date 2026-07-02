import { Customer, Message, Conversation, FollowUpSuggestion } from './types';

// Mock data - in production this would be a real database
const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Chen Wei',
    whatsapp: '+86 138 1234 5678',
    wechat: 'chenweidesign',
    preferredChannel: 'wechat',
    language: 'zh',
    status: 'hot',
    lastContact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    nextFollowUp: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    notes: 'Visited showroom on June 30. Interested in dining set. Needs dimension drawing.',
    createdAt: new Date('2024-06-30'),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@gmail.com',
    whatsapp: '+1 415 555 0123',
    preferredChannel: 'email',
    language: 'en',
    status: 'warm',
    lastContact: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    nextFollowUp: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    notes: 'Building a new house. Interested in bedroom furniture. Timeline: Sep-Oct construction.',
    createdAt: new Date('2024-06-15'),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: '3',
    name: 'Liu Ming',
    wechat: 'liuming_1990',
    whatsapp: '+86 138 9876 5432',
    preferredChannel: 'wechat',
    language: 'zh',
    status: 'purchased',
    lastContact: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
    nextFollowUp: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    notes: 'Delivered sofa on June 1. Pending delivery follow-up.',
    createdAt: new Date('2024-06-01'),
    updatedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
  },
  {
    id: '4',
    name: 'Michael Zhang',
    email: 'michael.zhang@company.com',
    whatsapp: '+1 510 555 0456',
    preferredChannel: 'whatsapp',
    language: 'en',
    status: 'prospect',
    lastContact: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
    notes: 'Office showroom visit. Looking for office chairs and desks.',
    createdAt: new Date('2024-06-24'),
    updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
  },
  {
    id: '5',
    name: 'Lisa Wong',
    email: 'lisa.wong@email.com',
    wechat: 'lisawong2024',
    preferredChannel: 'wechat',
    language: 'zh',
    status: 'hot',
    lastContact: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    nextFollowUp: new Date(),
    notes: 'Came in yesterday. Very interested in bedroom set. Needs layout drawing.',
    createdAt: new Date('2024-07-01'),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
];

const mockMessages: Message[] = [
  {
    id: 'm1',
    customerId: '1',
    channel: 'wechat',
    sender: 'customer',
    content: '你好，我对你们的餐桌很感兴趣。能给我发一下尺寸吗？',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    read: false,
  },
  {
    id: 'm2',
    customerId: '1',
    channel: 'wechat',
    sender: 'winky',
    content: '好的！我稍后给您发送详细尺寸和布置效果图。',
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: 'm3',
    customerId: '2',
    channel: 'email',
    sender: 'customer',
    content: 'Hi Winky, thanks for the bedroom furniture suggestions. We are still planning the space. Will reach out next month!',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: 'm4',
    customerId: '3',
    channel: 'wechat',
    sender: 'customer',
    content: '沙发已经收到了，非常满意！谢谢！',
    timestamp: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: 'm5',
    customerId: '5',
    channel: 'wechat',
    sender: 'customer',
    content: '嗨，昨天看的床很喜欢。今天可以发给我房间平面图吗？',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    read: false,
  },
  {
    id: 'm6',
    customerId: '4',
    channel: 'whatsapp',
    sender: 'customer',
    content: 'Hi Winky! Still interested in those office chairs. Do you have any new designs?',
    timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    read: true,
  },
];

export function getCustomers(): Customer[] {
  return mockCustomers.map(c => ({
    ...c,
    lastContact: new Date(c.lastContact),
    nextFollowUp: c.nextFollowUp ? new Date(c.nextFollowUp) : undefined,
    createdAt: new Date(c.createdAt),
    updatedAt: new Date(c.updatedAt),
  }));
}

export function getCustomer(id: string): Customer | undefined {
  return getCustomers().find(c => c.id === id);
}

export function getConversations(): Conversation[] {
  const customers = getCustomers();
  const messages = mockMessages.map(m => ({
    ...m,
    timestamp: new Date(m.timestamp),
  }));

  return customers.map(customer => {
    const customerMessages = messages.filter(m => m.customerId === customer.id);
    const unreadCount = customerMessages.filter(m => !m.read && m.sender === 'customer').length;
    const lastMessage = customerMessages.sort((a, b) =>
      b.timestamp.getTime() - a.timestamp.getTime()
    )[0];

    return {
      customerId: customer.id,
      customer,
      messages: customerMessages.sort((a, b) =>
        a.timestamp.getTime() - b.timestamp.getTime()
      ),
      lastMessage,
      unreadCount,
    };
  }).filter(c => c.messages.length > 0 || c.customer.status === 'hot' || c.customer.status === 'warm');
}

export function getConversation(customerId: string): Conversation | undefined {
  const customer = getCustomer(customerId);
  if (!customer) return undefined;

  const customerMessages = mockMessages
    .filter(m => m.customerId === customerId)
    .map(m => ({
      ...m,
      timestamp: new Date(m.timestamp),
    }));

  const unreadCount = customerMessages.filter(m => !m.read && m.sender === 'customer').length;
  const lastMessage = customerMessages.sort((a, b) =>
    b.timestamp.getTime() - a.timestamp.getTime()
  )[0];

  return {
    customerId: customer.id,
    customer,
    messages: customerMessages.sort((a, b) =>
      a.timestamp.getTime() - b.timestamp.getTime()
    ),
    lastMessage,
    unreadCount,
  };
}

export function getTodayFollowUps(): FollowUpSuggestion[] {
  const customers = getCustomers();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return customers
    .filter(c => {
      if (!c.nextFollowUp) return false;
      const followUpDate = new Date(c.nextFollowUp);
      followUpDate.setHours(0, 0, 0, 0);
      return followUpDate <= today;
    })
    .map(c => {
      const daysSinceContact = Math.floor(
        (today.getTime() - new Date(c.lastContact).getTime()) / (1000 * 60 * 60 * 24)
      );

      let reason = '';
      let urgency: 'high' | 'medium' | 'low' = 'medium';

      if (c.status === 'hot') {
        reason = 'High interest customer - needs dimension/layout drawings';
        urgency = 'high';
      } else if (c.status === 'warm') {
        reason = 'Potential customer - building house soon, needs nurturing';
        urgency = 'medium';
      } else if (c.status === 'purchased') {
        reason = 'Delivery follow-up - check satisfaction';
        urgency = 'medium';
      } else {
        reason = 'Regular follow-up to maintain engagement';
        urgency = 'low';
      }

      return {
        customerId: c.id,
        customerName: c.name,
        channel: c.preferredChannel,
        reason,
        urgency,
        lastContactDaysAgo: daysSinceContact,
        suggestedAction: `Check in with ${c.name} about their furniture purchase`,
      };
    })
    .sort((a, b) => {
      const urgencyOrder = { high: 0, medium: 1, low: 2 };
      return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
    });
}

export function getDashboardOverview() {
  const customers = getCustomers();
  const conversations = getConversations();
  const todayFollowUps = getTodayFollowUps();

  const unreadMessages = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  const channelCounts: Record<string, number> = {
    email: 0,
    whatsapp: 0,
    wechat: 0,
  };

  conversations.forEach(c => {
    const channel = c.customer.preferredChannel;
    channelCounts[channel]++;
  });

  return {
    totalCustomers: customers.length,
    todayFollowUps,
    unreadMessages,
    conversationsByChannel: channelCounts,
  };
}

export function markMessageAsRead(messageId: string): void {
  const message = mockMessages.find(m => m.id === messageId);
  if (message) {
    message.read = true;
  }
}

export type MessageChannel = 'email' | 'whatsapp' | 'wechat';
export type CustomerStatus = 'prospect' | 'hot' | 'warm' | 'cold' | 'purchased' | 'pending_delivery';
export type Language = 'en' | 'zh';

export interface Message {
  id: string;
  customerId: string;
  channel: MessageChannel;
  sender: 'customer' | 'winky';
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  whatsapp?: string;
  wechat?: string;
  preferredChannel: MessageChannel;
  language: Language;
  status: CustomerStatus;
  lastContact: Date;
  nextFollowUp?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Conversation {
  customerId: string;
  customer: Customer;
  messages: Message[];
  lastMessage?: Message;
  unreadCount: number;
}

export interface FollowUpSuggestion {
  customerId: string;
  customerName: string;
  channel: MessageChannel;
  reason: string;
  urgency: 'high' | 'medium' | 'low';
  lastContactDaysAgo: number;
  suggestedAction: string;
}

export interface DraftMessage {
  customerId: string;
  channel: MessageChannel;
  content: string;
  tone: 'professional' | 'friendly' | 'casual';
  language: Language;
}

export interface DashboardOverview {
  totalCustomers: number;
  todayFollowUps: FollowUpSuggestion[];
  unreadMessages: number;
  conversationsByChannel: Record<MessageChannel, number>;
}

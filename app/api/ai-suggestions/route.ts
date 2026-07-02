import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getConversation, getCustomer } from '@/lib/db';

const client = new Anthropic();

export async function POST(request: NextRequest) {
  try {
    const { customerId, type } = await request.json();

    if (!customerId || !type) {
      return NextResponse.json(
        { error: 'customerId and type are required' },
        { status: 400 }
      );
    }

    const customer = getCustomer(customerId);
    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    const conversation = getConversation(customerId);

    if (type === 'draft-reply') {
      return await generateDraftReply(customer, conversation);
    } else if (type === 'follow-up-message') {
      return await generateFollowUpMessage(customer, conversation);
    } else {
      return NextResponse.json(
        { error: 'Invalid type' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('AI suggestion error:', error);
    return NextResponse.json(
      { error: 'Failed to generate suggestion' },
      { status: 500 }
    );
  }
}

async function generateDraftReply(customer: any, conversation: any) {
  const lastMessage = conversation?.messages[conversation.messages.length - 1];

  if (!lastMessage) {
    return NextResponse.json(
      { error: 'No messages to reply to' },
      { status: 400 }
    );
  }

  const prompt = `You are Winky, a professional furniture salesperson in the furniture industry.

Customer: ${customer.name}
Customer Language: ${customer.language === 'zh' ? 'Chinese' : 'English'}
Customer Status: ${customer.status} (${getStatusDescription(customer.status)})
Channel: ${customer.preferredChannel}
Previous Context: ${customer.notes || 'No notes'}

Last Message from Customer: ${lastMessage.content}

Generate a friendly, professional reply message that:
1. Directly addresses the customer's last message
2. Is appropriate for the ${customer.preferredChannel} channel
3. Uses ${customer.language === 'zh' ? 'Chinese (Simplified)' : 'English'}
4. Is concise but warm
5. Moves the sale forward or provides helpful information

For furniture industry context:
- If they asked about dimensions, offer to send technical drawings
- If they're building a house, acknowledge timeline and offer design consultation
- If they're interested in delivery follow-up, express care for their satisfaction
- If they're a prospect, ask qualifying questions

Return ONLY the message content, no labels or explanation.`;

  const message = await client.messages.create({
    model: 'claude-opus-4-1-20250805',
    max_tokens: 300,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const draftContent = message.content[0].type === 'text' ? message.content[0].text : '';

  return NextResponse.json({
    content: draftContent,
    channel: customer.preferredChannel,
    language: customer.language,
  });
}

async function generateFollowUpMessage(customer: any, conversation: any) {
  const daysAgo = Math.floor(
    (new Date().getTime() - new Date(customer.lastContact).getTime()) / (1000 * 60 * 60 * 24)
  );

  const prompt = `You are Winky, a professional furniture salesperson in the furniture industry.

Customer: ${customer.name}
Customer Language: ${customer.language === 'zh' ? 'Chinese' : 'English'}
Customer Status: ${customer.status} (${getStatusDescription(customer.status)})
Channel: ${customer.preferredChannel}
Days Since Last Contact: ${daysAgo}
Context: ${customer.notes || 'No specific notes'}

Generate a brief, friendly follow-up message that:
1. Is appropriate for their current status (${customer.status})
2. Uses ${customer.language === 'zh' ? 'Chinese (Simplified)' : 'English'}
3. Is suitable for ${customer.preferredChannel}
4. Is authentic and personal, not salesy
5. References their specific furniture interest if known

Status-specific guidelines:
- hot: Urgently follow up on their specific request (dimensions, samples, etc)
- warm: Check in warmly about their project timeline
- prospect: Gentle reminder about products they viewed
- purchased: Check satisfaction and offer delivery assistance

Return ONLY the message content, no labels or explanation.`;

  const message = await client.messages.create({
    model: 'claude-opus-4-1-20250805',
    max_tokens: 250,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const followUpContent = message.content[0].type === 'text' ? message.content[0].text : '';

  return NextResponse.json({
    content: followUpContent,
    channel: customer.preferredChannel,
    language: customer.language,
    type: 'follow-up',
  });
}

function getStatusDescription(status: string): string {
  const descriptions: Record<string, string> = {
    hot: 'Very interested, ready to buy, needs follow-up',
    warm: 'Interested, still deciding, potential future sale',
    prospect: 'New lead, exploring options',
    purchased: 'Already bought from us',
    pending_delivery: 'Waiting for delivery',
    cold: 'Low interest currently',
  };
  return descriptions[status] || status;
}

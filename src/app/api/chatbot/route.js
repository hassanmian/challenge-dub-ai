import { NextResponse } from 'next/server';
import { getChatResponse } from '@/lib/claude';

export async function POST(request) {
  try {
    const { conversation } = await request.json();
    
    if (!conversation || !Array.isArray(conversation)) {
      return NextResponse.json(
        { error: 'Invalid request: conversation array is required' },
        { status: 400 }
      );
    }
    
    // Format messages for Claude API
    const messages = conversation.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    }));
    
    // Add a system message at the beginning
    messages.unshift({
      role: 'system',
      content: 'You are a friendly and knowledgeable space travel assistant. Provide helpful information about space travel destinations, spacecraft, and booking processes. Keep responses concise, informative, and exciting. Use a futuristic, optimistic tone.'
    });
    
    // Get response from Claude
    const reply = await getChatResponse(messages);
    
    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chatbot API error:', error);
    return NextResponse.json(
      { error: 'Error: unable to get response at this time.' },
      { status: 500 }
    );
  }
} 
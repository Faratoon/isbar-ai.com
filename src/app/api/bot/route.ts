import {NextRequest, NextResponse} from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {message, model} = body;

    if (!message) {
      return NextResponse.json({error: 'Message is required'}, {status: 400});
    }

    // Proxy to OpenRouter or Groq
    const apiKey = process.env.OPENROUTER_API_KEY || process.env.GROQ_API_KEY;
    const provider = process.env.OPENROUTER_API_KEY ? 'openrouter' : 'groq';
    const baseUrl = provider === 'openrouter'
      ? 'https://openrouter.ai/api/v1'
      : 'https://api.groq.com/openai/v1';

    const selectedModel = model || 'nousresearch/hermes-3-llama-3.1-405b:free';

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [
          {role: 'system', content: 'You are Isbar AI, a helpful Somali AI assistant. You respond in Somali and English. Be helpful, clear, and concise.'},
          {role: 'user', content: message},
        ],
      }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({error: 'AI request failed'}, {status: 500});
  }
}

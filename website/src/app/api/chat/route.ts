import { NextRequest, NextResponse } from 'next/server';
import { OpenRouterClient, ToolManager, ToolCall, ToolResult } from '@/lib/openrouter/openrouter';
import { getAllTools, getAllToolFunctions } from '@/lib/openrouter/tools';

export async function POST(request: NextRequest) {
  try {
    const { message, model = 'x-ai/grok-4-fast:free' } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Initialize OpenRouter client and tool manager
    const client = new OpenRouterClient({
      apiKey: process.env.OPENROUTER_API_KEY || '',
      defaultModel: model,
    });

    const toolManager = new ToolManager();
    const tools = getAllTools();
    const toolFunctions = getAllToolFunctions();

    // Register all tools
    tools.forEach(tool => toolManager.registerTool(tool));

    // Initial chat completion request
    const completion = await client.chatCompletion({
      model,
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI assistant with access to various tools. Use tools when appropriate to help the user.',
        },
        {
          role: 'user',
          content: message,
        },
      ],
      tools: tools,
      temperature: 0.7,
    });

    const responseMessage = completion.choices[0]?.message;
    let finalContent = responseMessage?.content || '';

    // Handle tool calls if present
    if (responseMessage?.tool_calls) {
      const toolCalls = responseMessage.tool_calls as ToolCall[];
      const toolResults: ToolResult[] = [];

      // Execute each tool call
      for (const toolCall of toolCalls) {
        const result = await toolManager.executeTool(toolCall, toolFunctions);
        toolResults.push(result);
      }

      // Get final response with tool results
      const finalCompletion = await client.chatCompletion({
        model,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI assistant with access to various tools. Use tools when appropriate to help the user.',
          },
          {
            role: 'user',
            content: message,
          },
          responseMessage,
          ...toolResults.map(result => ({
            role: 'tool' as const,
            content: result.content,
            tool_call_id: result.tool_call_id,
          })),
        ],
        tools: tools,
        temperature: 0.7,
      });

      finalContent = finalCompletion.choices[0]?.message?.content || finalContent;
    }

    return NextResponse.json({
      response: finalContent,
      model: model,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'Chat API is running',
    timestamp: new Date().toISOString(),
    availableTools: getAllTools().map(tool => tool.function.name),
  });
}
import { NextRequest, NextResponse } from 'next/server';
import { OpenRouterClient, ToolManager, ToolCall, ToolResult } from '@/lib/openrouter/openrouter';
import { getAllTools, getAllToolFunctions } from '@/lib/openrouter/tools';

export async function POST(request: NextRequest) {
  try {
    const { messages, persona = 'general', model = 'x-ai/grok-4-fast:free' } = await request.json();

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages are required' },
        { status: 400 }
      );
    }

    let systemPrompt = 'You are a helpful AI assistant with access to various tools. Use tools when appropriate to help the user.';
    if (persona === 'casino-butler') {
      systemPrompt = 'You are Casino Butler, an AI assistant specialized in organizing basic casino games such as coin flips, dice rolls, roulette, and simple lotteries. You must use on-chain Pyth Entropy randomness via available tools to fairly calculate winners and outcomes. Always ensure games are fair, explain the rules clearly, and confirm user bets before proceeding. Do not gamble real money without explicit confirmation.';
    }

    // Initialize OpenRouter client and tool manager
    const client = new OpenRouterClient({
      apiKey: process.env.OPENROUTER_API_KEY || '',
      defaultModel: model,
    });

    const toolManager = new ToolManager();
    const tools = getAllTools();
    const toolFunctionsArray = getAllToolFunctions();
    const toolFunctions = tools.reduce((acc, tool, index) => {
      acc[tool.function.name] = toolFunctionsArray[index];
      return acc;
    }, {} as Record<string, Function>);

    // Register all tools
    tools.forEach(tool => toolManager.registerTool(tool));

    // Initial chat completion request with full conversation history
    const completion = await client.chatCompletion({
      model,
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        ...messages,
      ],
      tools: tools,
      temperature: 0.7,
    });

    const responseMessage = completion.choices[0]?.message;
    let finalContent = responseMessage?.content || '';

    const toolLogs: { name: string; arguments: any; result: string }[] = [];

    // Handle tool calls if present
    if (responseMessage?.tool_calls) {
      const toolCalls = responseMessage.tool_calls as ToolCall[];
      const toolResults: ToolResult[] = [];

      // Execute each tool call
      for (const toolCall of toolCalls) {
        const result = await toolManager.executeTool(toolCall, toolFunctions);
        toolLogs.push({
          name: toolCall.function.name,
          arguments: toolCall.function.arguments,
          result: result.content,
        });
        toolResults.push(result);
      }

      // Get final response with tool results
      const finalCompletion = await client.chatCompletion({
        model,
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          ...messages,
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
      toolLogs,
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
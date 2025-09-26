/**
 * OpenRouter Utils
 * Base utilities for OpenRouter API integration and tool calling
 */

export interface OpenRouterConfig {
  apiKey: string;
  baseUrl?: string;
  defaultModel?: string;
}

export interface ToolDefinition {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: {
      type: "object";
      properties: Record<string, any>;
      required?: string[];
    };
  };
}

export interface ToolCall {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string;
  };
}

export interface ToolResult {
  tool_call_id: string;
  content: string;
}

export class OpenRouterClient {
  private config: OpenRouterConfig;
  private baseUrl: string;

  constructor(config: OpenRouterConfig) {
    this.config = config;
    this.baseUrl = config.baseUrl || 'https://openrouter.ai/api/v1';
  }

  /**
   * Make a request to OpenRouter API
   */
  async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    const headers = {
      'Authorization': `Bearer ${this.config.apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://github.com/your-repo/moni',
      'X-Title': 'Moni Project',
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Create chat completion with tool calling support
   */
  async chatCompletion(params: {
    model: string;
    messages: Array<{
      role: 'system' | 'user' | 'assistant' | 'tool';
      content: string;
      tool_calls?: ToolCall[];
      tool_call_id?: string;
    }>;
    tools?: ToolDefinition[];
    temperature?: number;
    max_tokens?: number;
  }) {
    return this.makeRequest('/chat/completions', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /**
   * Get available models
   */
  async getModels() {
    return this.makeRequest('/models');
  }
}

/**
 * Utility functions for tool management
 */
export class ToolManager {
  private tools: Map<string, ToolDefinition> = new Map();

  /**
   * Register a tool
   */
  registerTool(tool: ToolDefinition) {
    this.tools.set(tool.function.name, tool);
  }

  /**
   * Get all registered tools
   */
  getTools(): ToolDefinition[] {
    return Array.from(this.tools.values());
  }

  /**
   * Get a specific tool by name
   */
  getTool(name: string): ToolDefinition | undefined {
    return this.tools.get(name);
  }

  /**
   * Execute a tool call
   */
  async executeTool(toolCall: ToolCall, availableTools: Record<string, Function>): Promise<ToolResult> {
    const toolName = toolCall.function.name;
    const toolFunction = availableTools[toolName];

    if (!toolFunction) {
      throw new Error(`Tool "${toolName}" not found`);
    }

    try {
      const args = JSON.parse(toolCall.function.arguments);
      const result = await toolFunction(args);

      return {
        tool_call_id: toolCall.id,
        content: JSON.stringify(result),
      };
    } catch (error) {
      return {
        tool_call_id: toolCall.id,
        content: JSON.stringify({
          error: error instanceof Error ? error.message : 'Unknown error',
        }),
      };
    }
  }
}

/**
 * Default configuration
 */
export const defaultConfig: Partial<OpenRouterConfig> = {
  baseUrl: 'https://openrouter.ai/api/v1',
  defaultModel: 'x-ai/grok-4-fast:free',
};

/**
 * Create a new OpenRouter client instance
 */
export function createOpenRouterClient(config: OpenRouterConfig): OpenRouterClient {
  return new OpenRouterClient(config);
}

/**
 * Create a new tool manager instance
 */
export function createToolManager(): ToolManager {
  return new ToolManager();
}
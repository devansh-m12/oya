/**
 * OpenRouter Module
 * Main entry point for OpenRouter integration
 */

// Core client and utilities
export * from './openrouter';

// Tool definitions and functions
export * from './tools';

// Re-export commonly used types
import type { OpenRouterConfig, ToolDefinition, ToolCall, ToolResult } from './openrouter';
import type { CalculatorParams } from './tools/calculator';
import type { FileOperationParams } from './tools/filesystem';

export type {
  OpenRouterConfig,
  ToolDefinition,
  ToolCall,
  ToolResult,
  CalculatorParams,
  FileOperationParams,
};
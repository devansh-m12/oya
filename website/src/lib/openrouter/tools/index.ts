/**
 * Tools Index
 * Export all available tools and their definitions
 */

import { calculatorToolDefinition, calculator } from './calculator';
import { filesystemToolDefinition, filesystem } from './filesystem';

// Available tools registry
export const availableTools = {
  calculator,
  filesystem,
};

export const toolDefinitions = [
  calculatorToolDefinition,
  filesystemToolDefinition,
];

// Helper function to get all tools as OpenRouter format
export function getAllTools() {
  return toolDefinitions;
}

// Helper function to get all tool functions
export function getAllToolFunctions() {
  return availableTools;
}
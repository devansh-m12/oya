/**
 * Tools Index
 * Export all available tools and their definitions
 */

import { calculatorToolDefinition, calculator } from './calculator';
import { filesystemToolDefinition, filesystem } from './filesystem';


const allTools = {
  calculator,
  filesystem
};

const factories = Object.values(allTools);

// Available tools registry
export const availableTools = factories
  .filter(f => f && typeof f === 'function')
  .map(f => f().tool);

// Tool definitions registry
export const toolDefinitions = factories
  .filter(f => f && typeof f === 'function')
  .map(f => f().definition);

// Helper function to get all tools as OpenRouter format
// Helper function to get all tools as OpenRouter format
export function getAllTools() {
  return toolDefinitions;
}

// Helper function to get all tool functions
export function getAllToolFunctions() {
  return availableTools;
}
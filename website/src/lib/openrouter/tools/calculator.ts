import { ToolDefinition } from '../openrouter';

/**
 * Calculator Tool
 * A basic tool for performing mathematical calculations
 */

export interface CalculatorParams {
  operation: 'add' | 'subtract' | 'multiply' | 'divide';
  a: number;
  b: number;
}

export const calculatorToolDefinition: ToolDefinition = {
  type: "function",
  function: {
    name: "calculator",
    description: "Perform basic arithmetic operations (add, subtract, multiply, divide)",
    parameters: {
      type: "object",
      properties: {
        operation: {
          type: "string",
          enum: ["add", "subtract", "multiply", "divide"],
          description: "The arithmetic operation to perform",
        },
        a: {
          type: "number",
          description: "First number",
        },
        b: {
          type: "number",
          description: "Second number",
        },
      },
      required: ["operation", "a", "b"],
    },
  },
};

export async function calculator(params: CalculatorParams): Promise<{ result: number }> {
  const { operation, a, b } = params;

  switch (operation) {
    case 'add':
      return { result: a + b };
    case 'subtract':
      return { result: a - b };
    case 'multiply':
      return { result: a * b };
    case 'divide':
      if (b === 0) {
        throw new Error("Cannot divide by zero");
      }
      return { result: a / b };
    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
}
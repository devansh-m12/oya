import { ToolDefinition } from '../openrouter';
import { getRandomNumber } from '../../random';

/**
 * Random Number Tool
 * Requests a random number from the blockchain oracle
 */

export interface RandomParams {
  // No parameters required
}

export const randomToolDefinition: ToolDefinition = {
  type: "function",
  function: {
    name: "getRandomNumber",
    description: "Request an on-chain random number from the oracle. This operation involves a blockchain transaction and may take up to 60 seconds to complete.",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
  },
};

export const randomTool = getRandomNumber;

export const random = () => {
  return {
    tool: randomTool,
    definition: randomToolDefinition
  }
}
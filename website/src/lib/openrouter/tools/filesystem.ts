import { ToolDefinition } from '../openrouter';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';

/**
 * File System Tool
 * A tool for basic file operations
 */

export interface FileOperationParams {
  operation: 'read' | 'write' | 'exists';
  path: string;
  content?: string;
}

export const filesystemToolDefinition: ToolDefinition = {
  type: "function",
  function: {
    name: "filesystem",
    description: "Perform basic file system operations (read, write, check existence)",
    parameters: {
      type: "object",
      properties: {
        operation: {
          type: "string",
          enum: ["read", "write", "exists"],
          description: "The file operation to perform",
        },
        path: {
          type: "string",
          description: "File path relative to project root",
        },
        content: {
          type: "string",
          description: "Content to write (required for write operation)",
        },
      },
      required: ["operation", "path"],
    },
  },
};

export async function filesystemTool(params: FileOperationParams): Promise<any> {
  const { operation, path } = params;
  const fullPath = join(process.cwd(), path);

  switch (operation) {
    case 'read':
      if (!existsSync(fullPath)) {
        throw new Error(`File not found: ${path}`);
      }
      const content = readFileSync(fullPath, 'utf-8');
      return {
        path,
        content,
        operation: 'read',
      };

    case 'write':
      if (!params.content) {
        throw new Error("Content is required for write operation");
      }

      // Ensure directory exists
      const dir = dirname(fullPath);
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }

      writeFileSync(fullPath, params.content, 'utf-8');
      return {
        path,
        operation: 'write',
        success: true,
      };

    case 'exists':
      const exists = existsSync(fullPath);
      return {
        path,
        exists,
        operation: 'exists',
      };

    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
}
export const filesystem = () => {
  return {
    tool: filesystemTool,
    definition: filesystemToolDefinition
  }
}
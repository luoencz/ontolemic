/**
 * Shared types for Inner Cosmos API communication
 */

export interface CodeRequest {
  code: string;
  timeout?: number;
}

export interface CodeResponse {
  success: boolean;
  output: string;
  error?: string | null;
  execution_time: number;
}

export interface WebSocketMessage {
  code: string;
}

export interface WebSocketResponse {
  success: boolean;
  output: string;
  error?: string | null;
} 
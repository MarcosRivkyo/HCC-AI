export type MessageType = "user" | "assistant";

export interface ChatMessage {
  type: MessageType;
  content: string;
}

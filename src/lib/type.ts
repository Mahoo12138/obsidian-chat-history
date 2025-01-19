export interface Message {
    id: string
    role: "user" | "notification" | (string)
    content: string
    createdAt?: Date
    attachments?: Attachment[]
    toolInvocations?: ToolInvocation[]
}

interface Attachment {
    name?: string
    contentType?: string
    url: string
}

type ToolInvocation = PartialToolCall | ToolCall | ToolResult


interface PartialToolCall {
    state: "partial-call"
    toolName: string
  }
  
  interface ToolCall {
    state: "call"
    toolName: string
  }
  
  interface ToolResult {
    state: "result"
    toolName: string
    result: any
  }
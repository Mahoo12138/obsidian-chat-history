export interface Chat {
  meta: MetaInfo
  title: string
  description?: string
  createdAt: Date
  messages: Message[]
  status: "active" | "archived" | "deleted",
}

interface MetaInfo {
  version: string,
  theme: string,
  [key: string]: any
}

export interface Message {
  id: string
  role: "user" | "notification" | "me"
  content: MessageContent
  createdAt?: Date
  attachments?: Attachment[]
  toolInvocations?: ToolInvocation[]
}

export type MessageContent = string | ContentBlock | ContentBlock[]

export interface ContentBlock {
  type: "text" | "image" | "quote"
  value: string
  source?: string    // 适用于引用类型
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
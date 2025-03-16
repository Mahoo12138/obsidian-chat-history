import { Message, Chat, MessageContent } from "@/lib/type";
import { MessageItem } from "../ui/MessageItem";
import { MessageEditor } from "../ui/Editor";
import { useCallback, useEffect, useState } from "react";

export function ChatPanel({
	chat: { message, ...other },
	onSave,
}: {
	chat: Chat;
	onSave: (content: Chat) => void;
}) {
	console.log('ChatPanel', message, other);
	const [chat, setChat] = useState(other);
	const [msg, setMsg] = useState(message);
	const [editingMessage, setEditingMessage] = useState<Message | null>(null);

	// 新增编辑处理函数
	const handleEditMessage = useCallback((message: Message) => {
		setEditingMessage(message);
	}, []);

	// 修改保存处理函数
	const handleSaveMessage = useCallback(
		(id: string | undefined, payload: { content: MessageContent, createAt: Date }) => {
			if (editingMessage?.id && editingMessage.id === id) {
				setMsg((prev) =>
					prev.map((m) =>
						m.id === editingMessage.id ? { ...m, ...payload } : m
					)
				);
				setEditingMessage(null);
			} else {
				// 处理新消息逻辑（根据实际需求调整）
				const newMessage: Message = {
					id: crypto.randomUUID(), // 生成唯一ID
					role: "user",
					content: payload.content,
					createdAt: payload.createAt || new Date(),
				};
				setMsg((prev) => [...prev, newMessage]);
			}
		},
		[editingMessage, onSave]
	);
	useEffect(() => {
		onSave({ ...chat, message: msg });
	}, [msg, chat]);

	return (
		<div>
			<main>
				<div>
					{msg.map((message) => (
						<MessageItem message={message} key={message.id}>
							<button
								onClick={() => handleEditMessage(message)}
								style={{
									padding: "4px",
									background: "transparent",
									border: "none",
									cursor: "pointer",
								}}
							>
								✏️
							</button>
						</MessageItem>
					))}
				</div>
				<div>
					<MessageEditor
						key={editingMessage?.id || "new"} // 强制刷新编辑器
						message={editingMessage}
						onSave={handleSaveMessage}
					/>
				</div>
			</main>
		</div>
	);
}

export default ChatPanel;

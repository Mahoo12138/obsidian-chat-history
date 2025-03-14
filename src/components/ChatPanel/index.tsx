import { Message } from "@/lib/type";
import { MessageItem } from "../ui/MessageItem";
import { MessageEditor } from "../ui/Editor";

export function App({ messages }: { messages: Message[] }) {
	return (
		<div>
			<main>
				<div>
					{messages.map((message) => (
						<MessageItem message={message} />
					))}
				</div>
				<div>
					<MessageEditor
						onSave={(content) => console.log('Saved:', content)}
					/>
				</div>
			</main>
		</div>
	);
}

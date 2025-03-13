import { Message } from "@/lib/type";
import { MessageItem } from '../ui/MessageItem';

export function App({ messages }: { messages: Message[] }) {
	return (
		<div>
			<main>
				<div>{
					messages.map((message) =>
						<MessageItem message={message} />
					)
				}</div>
			</main>
		</div>
	);
}

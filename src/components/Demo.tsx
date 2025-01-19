import { Chat } from "./ui/chat";
import { Message } from './ui/chat-message';
export function App() {
	const messages: Message[] = [
		{
			id: '22',
			role: 'user',
			content: 'Hello World'
		},
		{
			id: '23',
			role: 'assistant',
			content: 'Hello World2'
		},
		{
			id: '22',
			role: 'user',
			content: 'Hello World'
		},
		{
			id: '22',
			role: 'user',
			content: 'Hello World'
		},
		{
			id: '25',
			role: 'assistant',
			content: 'Hello World2'
		},
		{
			id: '25',
			role: 'assistant',
			content: 'Hello World2'
		},
		{
			id: '25',
			role: 'assistant',
			content: 'Hello World2'
		},
		{
			id: '25',
			role: 'assistant',
			content: 'Hello World2'
		},
		{
			id: '26',
			role: 'assistant',
			content: 'Hello World2'
		}
	]
	return (
		<div className="bg-background-primary h-full p-8 flex flex-col">
			<main className="space-y-6 flex-1">
				<Chat
					className="h-full"
					messages={messages}
					input={'Please Input'}
					handleInputChange={() => { }}
					handleSubmit={()=>{}}
					isGenerating={false}
					stop={()=> {}}
				/>
			</main>
		</div>
	);
}

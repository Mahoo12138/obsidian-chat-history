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
			id: '24',
			role: 'assistant',
			content: 'Hello World2'
		}
	]
	return (
		<div className="bg-background-primary min-h-screen p-8">
			<header className="mb-8">
				<h1 className="rounded-full">My Application</h1>
				<p className="text-text-muted text-ui-small">
					Welcome to your new app
				</p>
			</header>

			<main className="space-y-6">
				<Chat
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

import { ChatMessage } from '~/store/chat-store';

type Props = {
	message: ChatMessage;
	friendId: string;
};

const MessageItem = ({ message, friendId }: Props) => {
	const isSent = message.sender_id !== friendId;

	return (
		<div key={message.id} className={`flex gap-3 ${isSent ? 'flex-row-reverse' : 'flex-row'}`}>
			<div className={`flex max-w-[70%] flex-col gap-1 ${isSent ? 'items-end' : 'items-start'}`}>
				{message.type === 'text' && message.content && (
					<div className={`rounded-2xl px-4 py-2 ${isSent ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
						<p className="text-sm">{message.content}</p>
					</div>
				)}
				{message.type === 'image' && message.image && (
					<div className="overflow-hidden rounded-2xl">
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img src={message.image} alt="Sent image" className="max-h-96 w-auto object-cover" />
					</div>
				)}
				{message.type === 'video' && message.video && (
					<div className="overflow-hidden rounded-2xl">
						<video src={message.video} controls className="max-h-96 w-auto" />
					</div>
				)}
				<span className="text-muted-foreground px-2 text-[10px]">
					{new Date(message.created_at).toLocaleTimeString('en-US', {
						hour: 'numeric',
						minute: '2-digit',
						hour12: true,
					})}
				</span>
			</div>
		</div>
	);
};

export default MessageItem;

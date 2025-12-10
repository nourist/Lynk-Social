interface ChatWindowProps {
	selectedId: string;
}

const ChatWindow = ({ selectedId }: ChatWindowProps) => {
	return <div className="text-muted-foreground p-4">Chat with ID: {selectedId}</div>;
};

export default ChatWindow;

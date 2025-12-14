import * as PopoverPrimitive from '@radix-ui/react-popover';
import { ArrowUp, ImageIcon, Paperclip, Smile, Video, X } from 'lucide-react';
import { useState } from 'react';
import useSWR from 'swr';

import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { EmojiPicker, EmojiPickerContent, EmojiPickerSearch } from '~/components/ui/emoji-picker';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea } from '~/components/ui/input-group';
import { Popover, PopoverTrigger } from '~/components/ui/popover';
import { Spinner } from '~/components/ui/spinner';
import { useMediaUpload } from '~/hooks/use-media-upload';
import { createClient } from '~/lib/supabase/client';
import { getCurrentUser } from '~/services/auth';
import { createMessage } from '~/services/chat';

interface FileItemProps {
	type: 'image' | 'video';
	name: string;
	onClose: () => void;
}

const FileItem = ({ type, name, onClose }: FileItemProps) => {
	return (
		<Badge variant="secondary" className="border-border h-7 rounded-sm">
			{type == 'image' ? <ImageIcon className="size-3" /> : <Video className="size-3" />}

			<div className="mr-2 ml-1 max-w-20 overflow-hidden text-nowrap text-ellipsis">{name}</div>
			<button onClick={onClose}>
				<X className="size-3" />
			</button>
		</Badge>
	);
};

interface ChatInputProps {
	receiverId: string;
}

const ChatInput = ({ receiverId }: ChatInputProps) => {
	const [value, setValue] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { files, fileInputRef, handleFileChange, removeFile, reset } = useMediaUpload();

	const supabase = createClient();
	const { data: currentUser, error } = useSWR('current-user', getCurrentUser);

	if (!currentUser && error) {
		throw error;
	}

	const onSubmit = async () => {
		if (!currentUser) {
			console.error('No current user');
			return;
		}

		if (!receiverId) {
			console.error('No receiver selected');
			return;
		}

		if (isSubmitting) {
			return;
		}

		if (value.trim().length == 0 && files.length == 0) {
			return;
		}

		setIsSubmitting(true);

		try {
			// 1. Create text message if there's content
			if (value.trim()) {
				await createMessage({
					receiverId,
					type: 'text',
					content: value.trim(),
				});
			}

			// 2. Upload files and create messages for each (in parallel)
			if (files.length > 0) {
				await Promise.all(
					files.map(async (mediaFile) => {
						const bucket = mediaFile.type === 'video' ? 'videos' : 'images';
						const extension = mediaFile.file.name.split('.').pop();
						const fileName = `${currentUser.id}-${Date.now()}-${Math.random().toString(36).substring(7)}.${extension}`;
						const filePath = `${currentUser.id}/${fileName}`;

						// Upload to storage
						const { data: uploadData, error: uploadError } = await supabase.storage.from(bucket).upload(filePath, mediaFile.file, { contentType: mediaFile.file.type });

						if (uploadError) {
							throw uploadError;
						}

						// Get public URL
						const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(uploadData.path);
						const url = publicUrlData.publicUrl;

						// Create message with media URL
						await createMessage({
							receiverId,
							type: mediaFile.type,
							image: mediaFile.type === 'image' ? url : null,
							video: mediaFile.type === 'video' ? url : null,
						});
					}),
				);
			}
			// Reset form
			setValue('');
			reset();
		} catch (error) {
			console.error('Error sending message:', error);
			// You might want to show a toast notification here
		} finally {
			setIsSubmitting(false);
		}
	};

	const handlePaperclipClick = () => {
		fileInputRef.current?.click();
	};

	return (
		<div className="absolute right-6 bottom-6 left-6 flex items-center gap-2 max-sm:right-3 max-sm:left-3">
			<input type="file" multiple className="hidden" ref={fileInputRef} onChange={handleFileChange} accept="image/*,video/*" />
			<Button variant="secondary" className="rounded-full" size="icon-lg" onClick={handlePaperclipClick}>
				<Paperclip />
			</Button>
			<Popover>
				<PopoverTrigger asChild>
					<Button variant="secondary" className="rounded-full" size="icon-lg">
						<Smile />
					</Button>
				</PopoverTrigger>
				<PopoverPrimitive.Portal>
					<PopoverPrimitive.Content>
						<EmojiPicker
							className="h-[326px] border"
							onEmojiSelect={({ emoji }) => {
								setValue((prev) => prev + emoji);
							}}
						>
							<EmojiPickerSearch />
							<EmojiPickerContent />
						</EmojiPicker>
					</PopoverPrimitive.Content>
				</PopoverPrimitive.Portal>
			</Popover>
			<InputGroup className="bg-card w-full rounded-full">
				<InputGroupTextarea
					value={value}
					onKeyDown={(e) => {
						if (e.code === 'Enter' && e.shiftKey === false) {
							e.preventDefault();
							onSubmit();
						}
					}}
					onChange={(e) => setValue(e.target.value)}
					className="ml-2 min-h-11! py-3"
					placeholder="Enter message..."
				/>
				<InputGroupAddon align="inline-end">
					<InputGroupButton
						disabled={isSubmitting || (value.trim().length == 0 && files.length == 0)}
						size="icon-sm"
						className="rounded-full"
						variant="default"
						onClick={onSubmit}
					>
						{isSubmitting ? <Spinner /> : <ArrowUp />}
					</InputGroupButton>
				</InputGroupAddon>
			</InputGroup>
			<div className="absolute right-0 bottom-13 left-24 flex flex-wrap gap-2 max-md:bottom-14">
				{files.map((file, index) => (
					<FileItem key={`${file.file.name}-${index}`} type={file.type} name={file.file.name} onClose={() => removeFile(index)} />
				))}
			</div>
		</div>
	);
};

export default ChatInput;

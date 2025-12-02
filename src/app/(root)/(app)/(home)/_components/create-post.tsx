'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ImagePlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import useSWR from 'swr';
import * as z from 'zod';

import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog';
import { Field, FieldError, FieldLabel } from '~/components/ui/field';
import { Input } from '~/components/ui/input';
import { Skeleton } from '~/components/ui/skeleton';
import { Textarea } from '~/components/ui/textarea';
import UserAvatar from '~/components/user-avatar';
import { useImageAndVideoUpload } from '~/hooks/use-image-and-video-upload';
import { createClient } from '~/lib/supabase/client';
import { getCurrentUser } from '~/services/auth';
import { createPost } from '~/services/blog';

const formSchema = z.object({
	title: z.string().min(1, 'Title must be at least 1 characters.').max(100, 'Title must be at most 100 characters.'),
	description: z.string(),
});

const CreatePost = () => {
	const router = useRouter();
	const { data: user, error } = useSWR('current-user', getCurrentUser);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: '',
			description: '',
		},
	});

	const {
		file,
		fileType,
		error: uploadError,
		setError: setUploadError,
		isDragging,
		fileInputRef,
		reset,
		handleInputChange,
		handleDrop,
		handleDragLeave,
		handleDragOver,
	} = useImageAndVideoUpload({
		imageExtensions: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'],
		videoExtensions: ['mp4', 'mov', 'avi', 'mkv', 'webm'],
		invalidTypeMessage: 'Only image or video files are supported.',
	});
	const [open, setOpen] = useState(false);

	if (!user && error) {
		throw error;
	}

	async function onSubmit(data: z.infer<typeof formSchema>) {
		if (!user) {
			setUploadError('User information not found.');
			return;
		}

		setUploadError(null);

		try {
			let imageUrl: string | null = null;
			let videoUrl: string | null = null;

			if (file) {
				if (!fileType) {
					setUploadError('Only image or video files are supported.');
					return;
				}

				const supabase = createClient();
				const bucket = fileType === 'video' ? 'videos' : 'images';

				const extension = file.name.split('.').pop();
				const fileName = `${user.id}-${Date.now()}.${extension}`;
				const filePath = `${user.id}/${fileName}`;

				const { data: uploadData, error: uploadErrorResult } = await supabase.storage.from(bucket).upload(filePath, file, { contentType: file.type });

				if (uploadErrorResult) {
					throw uploadErrorResult;
				}

				const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(uploadData.path);
				const url = publicUrlData.publicUrl;

				if (fileType === 'image') {
					imageUrl = url;
				} else if (fileType === 'video') {
					videoUrl = url;
				}
			}

			await createPost({
				title: data.title,
				description: data.description,
				imageUrl,
				videoUrl,
			});

			form.reset();
			reset();
			setOpen(false);
		} catch (err) {
			if (err instanceof Error) {
				setUploadError(err.message);
			} else {
				setUploadError('An error occurred while creating the post.');
			}
		}

		window.location.reload();
	}

	return (
		<Card className="flex flex-row items-center gap-3 px-6 py-4">
			{user ? <UserAvatar user={user} className="size-10" /> : <Skeleton className="size-10 rounded-full" />}
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<button className="bg-accent/80 hover:bg-accent text-accent-foreground/80 h-10 flex-1 rounded-full px-4 text-left">What are you thinking?</button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Create post</DialogTitle>
					</DialogHeader>
					<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
						<Controller
							name="title"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel>Title</FieldLabel>
									<Input placeholder="Enter title..." {...field} aria-invalid={fieldState.invalid} />
									{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
								</Field>
							)}
						/>
						<Controller
							name="description"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel>Description</FieldLabel>
									<Textarea placeholder="Enter description..." {...field} aria-invalid={fieldState.invalid} />
									{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
								</Field>
							)}
						/>
						<Field>
							<FieldLabel>Media</FieldLabel>
							<div className="space-y-2">
								<div
									className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-4 py-8 text-center transition-colors ${
										isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/40 bg-muted/40 hover:bg-muted/60'
									}`}
									onClick={() => fileInputRef.current?.click()}
									onDragOver={handleDragOver}
									onDragLeave={handleDragLeave}
									onDrop={handleDrop}
								>
									<div className="bg-background/80 mb-3 flex size-12 items-center justify-center rounded-full">
										<ImagePlus className="text-muted-foreground size-6" />
									</div>
									<p className="text-sm font-medium">Click to select</p>
									<p className="text-muted-foreground text-xs">or drag and drop file here</p>
									{file && (
										<div className="text-muted-foreground mt-2 w-full text-xs">
											Selected file:{' '}
											<span className="inline-block max-w-full overflow-hidden align-bottom font-medium text-ellipsis whitespace-nowrap">{file.name}</span>
										</div>
									)}
								</div>
								<input ref={fileInputRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleInputChange} />
								{uploadError && <p className="text-destructive mt-1 text-sm">{uploadError}</p>}
							</div>
						</Field>
						<DialogFooter>
							<Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
								Create
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</Card>
	);
};

export default CreatePost;

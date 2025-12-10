'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Camera } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { mutate } from 'swr';
import * as z from 'zod';

import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { Field, FieldError, FieldLabel } from '~/components/ui/field';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import UserAvatar from '~/components/user-avatar';
import { useImageUpload } from '~/hooks/use-image-upload';
import { createClient } from '~/lib/supabase/client';
import { updateCurrentUserProfile } from '~/services/user';
import type { Tables } from '~/types/database.type';

type Props = {
	user: Tables<'users'>;
};

const formSchema = z.object({
	name: z.string().min(2, 'Name must be at least 2 characters.').max(100, 'Name must be at most 100 characters.'),
	bio: z.string().max(240, 'Bio must be at most 240 characters.').optional(),
});

type FormValues = z.infer<typeof formSchema>;

type BucketType = 'avatars' | 'thumbnails';

const SettingsForm = ({ user }: Props) => {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const avatarUpload = useImageUpload({ initialUrl: user.avatar });
	const thumbnailUpload = useImageUpload({ initialUrl: user.thumbnail });

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: user.name ?? '',
			bio: user.bio ?? '',
		},
	});

	const uploadImageFile = async (file: File, bucket: BucketType) => {
		const supabase = createClient();

		const extension = file.name.split('.').pop() || file.type.split('/').pop() || 'png';
		const fileName = `${user.id}-${bucket}-${Date.now()}.${extension}`;
		const filePath = `${user.id}/${fileName}`;

		const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, { contentType: file.type });

		if (error) {
			throw error;
		}

		const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(data.path);

		return publicUrlData.publicUrl;
	};

	const onSubmit = async (values: FormValues) => {
		setIsSubmitting(true);

		try {
			let avatarUrl = user.avatar;
			let thumbnailUrl = user.thumbnail;

			if (avatarUpload.file) {
				avatarUrl = await uploadImageFile(avatarUpload.file, 'avatars');
			}

			if (thumbnailUpload.file) {
				thumbnailUrl = await uploadImageFile(thumbnailUpload.file, 'thumbnails');
			}

			const updated = await updateCurrentUserProfile({
				name: values.name.trim(),
				bio: (values.bio ?? '').trim(),
				avatar: avatarUrl,
				thumbnail: thumbnailUrl,
			});

			mutate('current-user', updated, false);
			form.reset({
				name: updated.name ?? '',
				bio: updated.bio ?? '',
			});

			avatarUpload.reset(updated.avatar);
			thumbnailUpload.reset(updated.thumbnail);
			toast.success('Profile updated successfully.');
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error('Failed to update profile.');
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	const displayName = form.watch('name') || user.name;

	return (
		<Card className="flex-1 p-6">
			<div className="flex flex-col gap-1 pb-4">
				<h1 className="text-2xl font-semibold">Settings</h1>
				<p className="text-muted-foreground text-sm">Update your public profile information.</p>
			</div>
			<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
				<Controller
					name="name"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel>Name</FieldLabel>
							<Input className="bg-muted" placeholder="Enter your name" {...field} aria-invalid={fieldState.invalid} />
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>
				<Controller
					name="bio"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel>Bio</FieldLabel>
							<Textarea className="bg-muted wrap-break-word" placeholder="Tell people about yourself" {...field} aria-invalid={fieldState.invalid} />

							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>
				<div className="grid gap-6 md:grid-cols-2">
					<Field>
						<div className="flex flex-col gap-2">
							<FieldLabel>Thumbnail</FieldLabel>
							<div className="group bg-muted/30 relative h-36 overflow-hidden rounded-lg border">
								{thumbnailUpload.preview ? (
									/* eslint-disable-next-line @next/next/no-img-element */
									<img src={thumbnailUpload.preview} alt="Thumbnail preview" className="h-full w-full object-cover" />
								) : (
									<div className="text-muted-foreground flex h-full items-center justify-center text-sm">No thumbnail</div>
								)}
								<button
									type="button"
									onClick={thumbnailUpload.openPicker}
									className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 transition group-hover:opacity-100 hover:opacity-100"
									aria-label="Change thumbnail"
								>
									<Camera className="size-5" />
								</button>
								<input ref={thumbnailUpload.inputRef} type="file" accept="image/*" className="hidden" onChange={thumbnailUpload.handleChange} />
							</div>
						</div>
					</Field>
					<Field>
						<div className="space-y-2">
							<FieldLabel>Avatar</FieldLabel>
							<div className="group relative inline-flex">
								<UserAvatar user={{ name: displayName, avatar: avatarUpload.preview }} className="size-36" />
								<button
									type="button"
									onClick={avatarUpload.openPicker}
									className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition group-hover:opacity-100 hover:opacity-100"
									aria-label="Change avatar"
								>
									<Camera className="size-5" />
								</button>
								<input ref={avatarUpload.inputRef} type="file" accept="image/*" className="hidden" onChange={avatarUpload.handleChange} />
							</div>
						</div>
					</Field>
				</div>
				<div className="flex justify-end">
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? 'Saving...' : 'Save changes'}
					</Button>
				</div>
			</form>
		</Card>
	);
};

export default SettingsForm;

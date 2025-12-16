'use client';

import { type ChangeEvent, useRef, useState } from 'react';

type FileType = 'image' | 'video';

export interface MediaFile {
	file: File;
	type: FileType;
	previewUrl: string;
}

type UseMediaUploadOptions = {
	imageExtensions?: string[];
	videoExtensions?: string[];
	maxFiles?: number;
};

export const useMediaUpload = (options: UseMediaUploadOptions = { maxFiles: 20 }) => {
	const { imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'], videoExtensions = ['mp4', 'mov', 'avi', 'mkv', 'webm'], maxFiles = 10 } = options;

	const [files, setFiles] = useState<MediaFile[]>([]);
	const [error, setError] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const getFileType = (file: File): FileType | null => {
		if (file.type.startsWith('image/')) return 'image';
		if (file.type.startsWith('video/')) return 'video';

		const ext = file.name.split('.').pop()?.toLowerCase();
		if (ext && imageExtensions.includes(ext)) return 'image';
		if (ext && videoExtensions.includes(ext)) return 'video';

		return null;
	};

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		setError(null);
		const selectedFiles = Array.from(event.target.files || []);

		if (files.length + selectedFiles.length > maxFiles) {
			setError(`You can only upload up to ${maxFiles} files.`);
			return;
		}

		const newFiles: MediaFile[] = [];

		for (const file of selectedFiles) {
			const type = getFileType(file);
			if (!type) {
				continue; // Skip unsupported files
			}
			newFiles.push({
				file,
				type,
				previewUrl: URL.createObjectURL(file), // Create preview URL
			});
		}

		setFiles((prev) => [...prev, ...newFiles]);

		// Reset input so the same file can be selected again if needed
		if (event.target) {
			event.target.value = '';
		}
	};

	const removeFile = (index: number) => {
		setFiles((prev) => {
			const newFiles = [...prev];
			const removed = newFiles.splice(index, 1)[0];
			if (removed) {
				URL.revokeObjectURL(removed.previewUrl); // Cleanup
			}
			return newFiles;
		});
	};

	const reset = () => {
		files.forEach((f) => URL.revokeObjectURL(f.previewUrl));
		setFiles([]);
		setError(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	return {
		files,
		error,
		fileInputRef,
		handleFileChange,
		removeFile,
		reset,
	};
};

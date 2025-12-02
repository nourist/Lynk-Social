'use client';

import { useRef, useState, type ChangeEvent, type DragEvent } from 'react';

type FileType = 'image' | 'video';

type UseImageAndVideoUploadOptions = {
	imageExtensions?: string[];
	videoExtensions?: string[];
	invalidTypeMessage?: string;
};

export const useImageAndVideoUpload = (options: UseImageAndVideoUploadOptions = {}) => {
	const {
		imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'],
		videoExtensions = ['mp4', 'mov', 'avi', 'mkv', 'webm'],
		invalidTypeMessage = 'Only image or video files are supported.',
	} = options;
	const [fileType, setFileType] = useState<FileType | null>(null);
	const [file, setFile] = useState<File | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const reset = () => {
		setFile(null);
		setFileType(null);
		setError(null);
		setIsDragging(false);
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	const handleSelectedFile = (selectedFile: File | null) => {
		setFile(selectedFile);
		setError(null);

		if (!selectedFile) {
			setFileType(null);
			return;
		}

		const mimeType = selectedFile.type;
		if (mimeType.startsWith('image/')) {
			setFileType('image');
			return;
		}

		if (mimeType.startsWith('video/')) {
			setFileType('video');
			return;
		}

		const ext = selectedFile.name.split('.').pop()?.toLowerCase();
		if (ext && imageExtensions.includes(ext)) {
			setFileType('image');
		} else if (ext && videoExtensions.includes(ext)) {
			setFileType('video');
		} else {
			setFileType(null);
			setError(invalidTypeMessage);
		}
	};

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		const selectedFile = event.target.files?.[0] ?? null;
		handleSelectedFile(selectedFile);
	};

	const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation();
		setIsDragging(true);
	};

	const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation();
		setIsDragging(false);
	};

	const handleDrop = (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation();
		setIsDragging(false);

		const droppedFile = event.dataTransfer.files?.[0];
		if (droppedFile) {
			handleSelectedFile(droppedFile);
			if (fileInputRef.current) {
				fileInputRef.current.files = event.dataTransfer.files;
			}
		}
	};

	return {
		file,
		fileType,
		error,
		isDragging,
		fileInputRef,
		setError,
		reset,
		handleSelectedFile,
		handleInputChange,
		handleDragOver,
		handleDragLeave,
		handleDrop,
	};
};



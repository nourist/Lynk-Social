'use client';

import { type ChangeEvent, useRef, useState } from 'react';

type Options = {
	initialUrl?: string | null;
};

export const useImageUpload = ({ initialUrl = null }: Options = {}) => {
	const [file, setFile] = useState<File | null>(null);
	const [preview, setPreview] = useState<string | null>(initialUrl);
	const inputRef = useRef<HTMLInputElement | null>(null);

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const nextFile = event.target.files?.[0] ?? null;
		setFile(nextFile);

		if (nextFile) {
			setPreview(URL.createObjectURL(nextFile));
		} else {
			setPreview(initialUrl ?? null);
		}
	};

	const openPicker = () => {
		inputRef.current?.click();
	};

	const reset = (nextUrl?: string | null) => {
		setFile(null);
		setPreview(nextUrl ?? initialUrl ?? null);
		if (inputRef.current) {
			inputRef.current.value = '';
		}
	};

	return {
		file,
		preview,
		inputRef,
		handleChange,
		openPicker,
		reset,
	};
};

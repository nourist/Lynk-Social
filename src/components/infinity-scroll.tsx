import { useEffect, useRef } from 'react';

interface InfiniteScrollProps {
	loadMore: () => void; // hàm load thêm data
	hasMore: boolean; // còn dữ liệu không
	children: React.ReactNode;
	align?: 'start' | 'end';
}

export default function InfiniteScroll({ loadMore, hasMore, children, align = 'end' }: InfiniteScrollProps) {
	const sentinelRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!hasMore) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) loadMore();
			},
			{ threshold: 1 },
		);

		if (sentinelRef.current) observer.observe(sentinelRef.current);

		return () => observer.disconnect();
	}, [hasMore, loadMore]);

	return (
		<>
			{align == 'start' && <div ref={sentinelRef} className="h-1" />}
			{children}
			{align == 'end' && <div ref={sentinelRef} className="h-1" />}
		</>
	);
}

export default function Loading() {
	return (
		<div className="w-full h-dvh flex items-center justify-center bg-white/80 dark:bg-black/80">
			<div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-orange-500" />
		</div>
	);
}

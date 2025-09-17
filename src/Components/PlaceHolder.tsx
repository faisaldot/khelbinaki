import { LoadingSpinner } from "./LoadingSpinner";

export function PageLoader() {
	return (
		<div className="flex items-center justify-center min-h-[400px]">
			<div className="text-center space-y-4">
				<LoadingSpinner size="lg" />
				<p className="text-muted-foreground">Loading...</p>
			</div>
		</div>
	);
}
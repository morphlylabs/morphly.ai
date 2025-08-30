import { HeroPrompt } from '@/components/hero-prompt';
import { Stats } from './_components/stats';
import { Suspense } from 'react';
import { StatsLoader } from './_components/stats-loader';

export default function HomePage() {
	return (
		<div className="min-h-screen">
			<div className="container mx-auto space-y-8 px-4 py-8">
				{/* Live Generator Section */}
				<HeroPrompt />

				<Suspense fallback={<StatsLoader />}>
					<Stats />
				</Suspense>
			</div>
		</div>
	);
}

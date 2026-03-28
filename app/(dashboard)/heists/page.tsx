"use client";

import { useHeists } from "@/hooks";
import HeistCard from "@/components/HeistCard";
import HeistCardSkeleton from "@/components/HeistCardSkeleton";

const GRID = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3";

function SkeletonGrid() {
  return (
    <div className={GRID}>
      {Array.from({ length: 3 }).map((_, i) => (
        <HeistCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default function HeistsPage() {
  const active = useHeists("active");
  const assigned = useHeists("assigned");

  if (active.loading || assigned.loading) {
    return (
      <div className="page-content">
        <section>
          <h2>Your Active Heists</h2>
          <SkeletonGrid />
        </section>
        <section className="mt-8">
          <h2>Heists You&apos;ve Assigned</h2>
          <SkeletonGrid />
        </section>
      </div>
    );
  }

  const error = active.error || assigned.error;
  if (error) {
    return (
      <div className="page-content">
        <p>Error loading heists: {error}</p>
      </div>
    );
  }

  return (
    <div className="page-content">
      <section>
        <h2>Your Active Heists</h2>
        {active.heists.length > 0 ? (
          <div className={GRID}>
            {active.heists.map((heist) => (
              <HeistCard key={heist.id} heist={heist} />
            ))}
          </div>
        ) : (
          <p className="text-body mt-3">No active heists right now.</p>
        )}
      </section>
      <section className="mt-8">
        <h2>Heists You&apos;ve Assigned</h2>
        {assigned.heists.length > 0 ? (
          <div className={GRID}>
            {assigned.heists.map((heist) => (
              <HeistCard key={heist.id} heist={heist} />
            ))}
          </div>
        ) : (
          <p className="text-body mt-3">No assigned heists right now.</p>
        )}
      </section>
    </div>
  );
}

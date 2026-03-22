"use client";

import { useHeists } from "@/hooks";
import Loader from "@/components/Loader";

export default function HeistsPage() {
  const active = useHeists("active");
  const assigned = useHeists("assigned");
  const expired = useHeists("expired");

  if (active.loading || assigned.loading || expired.loading) {
    return (
      <div className="page-content">
        <Loader />
      </div>
    );
  }

  const error = active.error || assigned.error || expired.error;
  if (error) {
    return (
      <div className="page-content">
        <p>Error loading heists: {error}</p>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="active-heists">
        <h2>Your Active Heists</h2>
        {active.heists.map((heist) => (
          <p key={heist.id}>{heist.title}</p>
        ))}
      </div>
      <div className="assigned-heists">
        <h2>Heists You&apos;ve Assigned</h2>
        {assigned.heists.map((heist) => (
          <p key={heist.id}>{heist.title}</p>
        ))}
      </div>
      <div className="expired-heists">
        <h2>All Expired Heists</h2>
        {expired.heists.map((heist) => (
          <p key={heist.id}>{heist.title}</p>
        ))}
      </div>
    </div>
  );
}

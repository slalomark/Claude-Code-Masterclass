// this page should be used only as a splash page to decide where a user should be navigated to
// when logged in --> to /heists
// when not logged in --> to /login

import { Clock8 } from "lucide-react";

export default function Home() {
  return (
    <div className="center-content">
      <div className="page-content">
        <h1>
          P<Clock8 className="logo" strokeWidth={2.75} />
          cket Heist
        </h1>
        <div>Chaos, delegated.</div>
        <div>混乱、委任済み。</div>
        <p>
          Welcome to Pocket Heist — the ultimate workplace challenge platform.
          Assign sneaky missions to your colleagues, complete daring tasks, and
          climb the leaderboard. Think you have what it takes to pull off the
          perfect heist?
        </p>
      </div>
    </div>
  );
}

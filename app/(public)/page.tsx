import Link from "next/link";
import { Clock8, Target, Users, Trophy } from "lucide-react";
import styles from "./splash.module.css";

export default function Home() {
  return (
    <div className={styles.scene}>
      {/* ── hero ── */}
      <section className={styles.hero}>
        <div className={styles.glow} />

        <div className={styles.logoMark}>
          <Clock8 className={styles.logoIcon} strokeWidth={2.5} />
        </div>

        <h1 className={styles.title}>Pocket Heist</h1>
        <p className={styles.tagline}>Chaos, delegated</p>
        <p className={styles.taglineJp}>混乱、委任済み。</p>

        <p className={styles.description}>
          The ultimate workplace challenge platform. Assign sneaky missions to
          your colleagues, complete daring tasks, and climb the leaderboard.
        </p>

        <div className={styles.cta}>
          <Link href="/signup" className={styles.registerBtn}>
            Register
          </Link>
          <Link href="/login" className={styles.loginLink}>
            Already have an account? Log in
          </Link>
        </div>
      </section>

      {/* ── features ── */}
      <section className={styles.features}>
        <div className={styles.card}>
          <Target className={styles.cardIcon} size={28} strokeWidth={1.5} />
          <h3 className={styles.cardTitle}>Assign Heists</h3>
          <p className={styles.cardDesc}>
            Create covert missions and assign them to unsuspecting colleagues.
            Set a 48-hour deadline and watch the chaos unfold.
          </p>
        </div>

        <div className={styles.card}>
          <Users className={styles.cardIcon} size={28} strokeWidth={1.5} />
          <h3 className={styles.cardTitle}>Build Your Crew</h3>
          <p className={styles.cardDesc}>
            Every agent gets a codename. Recruit your crew, delegate tasks, and
            see who can pull off the impossible.
          </p>
        </div>

        <div className={styles.card}>
          <Trophy className={styles.cardIcon} size={28} strokeWidth={1.5} />
          <h3 className={styles.cardTitle}>Claim Glory</h3>
          <p className={styles.cardDesc}>
            Complete missions before the deadline to earn success. Fail, and
            your record speaks for itself.
          </p>
        </div>
      </section>

      {/* ── footer ── */}
      <footer className={styles.footer}>
        <p className={styles.footerText}>Think you have what it takes?</p>
      </footer>
    </div>
  );
}

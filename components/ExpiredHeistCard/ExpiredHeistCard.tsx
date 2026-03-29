import { CircleX, User, Calendar } from "lucide-react";
import { Heist } from "@/types/firestore";
import styles from "./ExpiredHeistCard.module.css";

interface ExpiredHeistCardProps {
  heist: Heist;
}

export default function ExpiredHeistCard({ heist }: ExpiredHeistCardProps) {
  return (
    <div
      className={styles.card}
      role="group"
      aria-label={`${heist.title} — failed heist`}
    >
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <CircleX
            size={16}
            className={styles.failIcon}
            data-testid="fail-icon"
            aria-hidden="true"
          />
          <span className={styles.title}>{heist.title}</span>
        </div>
        <div className={styles.headerRight}>
          <Calendar size={12} className={styles.metaIcon} aria-hidden="true" />
          <time
            className={styles.dateLabel}
            dateTime={heist.deadline.toISOString().split("T")[0]}
          >
            {heist.deadline.toLocaleDateString()}
          </time>
          <span className={styles.badge}>FAILED</span>
        </div>
      </div>
      <div className={styles.meta}>
        <div className={styles.metaRow}>
          <User size={12} className={styles.metaIcon} aria-hidden="true" />
          <span className={styles.metaLabel}>To:</span>
          <span className={styles.toValue}>{heist.assignedToCodename}</span>
        </div>
        <div className={styles.metaRow}>
          <User size={12} className={styles.metaIcon} aria-hidden="true" />
          <span className={styles.metaLabel}>By:</span>
          <span className={styles.byValue}>{heist.createdByCodename}</span>
        </div>
      </div>
    </div>
  );
}

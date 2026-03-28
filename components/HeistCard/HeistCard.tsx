import Link from "next/link";
import { Clock, User, Calendar } from "lucide-react";
import { Heist } from "@/types/firestore";
import styles from "./HeistCard.module.css";

interface HeistCardProps {
  heist: Heist;
}

export default function HeistCard({ heist }: HeistCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Link href={`/heists/${heist.id}`} className={styles.title}>
          {heist.title}
        </Link>
        <Clock size={16} className={styles.clockIcon} />
      </div>
      <div className={styles.meta}>
        <div className={styles.metaRow}>
          <User size={12} className={styles.metaIcon} />
          <span className={styles.metaLabel}>To:</span>
          <span className={styles.toValue}>{heist.assignedToCodename}</span>
        </div>
        <div className={styles.metaRow}>
          <User size={12} className={styles.metaIcon} />
          <span className={styles.metaLabel}>By:</span>
          <span className={styles.byValue}>{heist.createdByCodename}</span>
        </div>
        <div className={styles.metaRow}>
          <Calendar size={12} className={styles.metaIcon} />
          <span className={styles.metaLabel}>
            {heist.deadline.toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}

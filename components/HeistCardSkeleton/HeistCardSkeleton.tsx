import styles from "./HeistCardSkeleton.module.css";

export default function HeistCardSkeleton() {
  return (
    <div className={styles.skeleton} role="status" aria-label="Loading">
      <div className={styles.header}>
        <div className={`${styles.bar} ${styles.barTitle}`} data-skeleton />
        <div className={`${styles.bar} ${styles.barIcon}`} data-skeleton />
      </div>
      <div className={styles.meta}>
        <div className={`${styles.bar} ${styles.barMeta}`} data-skeleton />
        <div className={`${styles.bar} ${styles.barMeta}`} data-skeleton />
        <div className={`${styles.bar} ${styles.barMeta}`} data-skeleton />
      </div>
    </div>
  );
}

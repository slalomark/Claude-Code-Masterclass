"use client";

import { Clock8 } from "lucide-react";
import styles from "./Loader.module.css";

export default function Loader() {
  return (
    <div
      className="center-content items-center"
      role="status"
      aria-label="Loading"
    >
      <Clock8 className={styles.spinner} size={48} strokeWidth={2.75} />
    </div>
  );
}

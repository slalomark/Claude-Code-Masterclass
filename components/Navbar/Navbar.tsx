"use client";

import { Clock8, Plus } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/lib/UserContext";
import { logout } from "@/lib/logout";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { user } = useUser();

  return (
    <div className={styles.siteNav}>
      <nav>
        <header>
          <h1>
            <Link href="/heists">
              P<Clock8 className={styles.logo} size={14} strokeWidth={2.75} />
              cket Heist
            </Link>
          </h1>
          <div>Tiny missions. Big office mischief.</div>
        </header>
        <ul>
          {user && (
            <li>
              <button onClick={() => logout()} className={styles.logoutBtn}>
                Logout
              </button>
            </li>
          )}
          <li>
            <Link href="/heists/create" className="btn flex items-center gap-2">
              <Plus size={20} />
              Create New Heist
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

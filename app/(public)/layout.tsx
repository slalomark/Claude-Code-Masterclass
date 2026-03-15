"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/UserContext";
import Loader from "@/components/Loader";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/heists");
    }
  }, [user, loading, router]);

  if (loading || user) return <Loader />;

  return <main className="public">{children}</main>;
}

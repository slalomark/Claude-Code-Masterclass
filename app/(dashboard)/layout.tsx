"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/UserContext";
import Navbar from "@/components/Navbar";
import Loader from "@/components/Loader";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) return <Loader />;

  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}

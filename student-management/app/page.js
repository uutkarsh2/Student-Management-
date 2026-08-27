"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login");
  }, [router]);

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="text-center">

        <div className="text-5xl mb-4">
          🎓
        </div>

        <h1 className="text-2xl font-bold text-slate-800">
          Student Management
        </h1>

        <p className="text-slate-500 mt-2">
          Loading...
        </p>

      </div>
    </main>
  );
}
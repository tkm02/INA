"use client";

import { Storage } from "@/lib/storage";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const data = Storage.getData();
    if (data.profile?.pin) {
      router.replace("/auth/login");
    } else {
      router.replace("/onboarding");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-[#00569E]/30 border-t-[#00569E] rounded-full animate-spin" />
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ChatAutoRefresh() {
  const router = useRouter();

  useEffect(() => {
    // Silently refresh the Server Component data every 3 seconds
    // This allows incoming messages to instantly populate without refreshing the page!
    const intervalId = setInterval(() => {
      router.refresh();
    }, 3000);

    return () => clearInterval(intervalId);
  }, [router]);

  return null;
}

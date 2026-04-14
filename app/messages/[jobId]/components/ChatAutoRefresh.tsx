"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ChatAutoRefresh({ jobId }: { jobId: string }) {
  const router = useRouter();

  useEffect(() => {
    // 1. Fallback Polling: Ensure chat updates even if Supabase Realtime is disabled in the database
    const intervalId = setInterval(() => {
      router.refresh();
    }, 3000);

    // 2. Instant Sync: WebSocket connection
    const supabase = createClient();
    const channel = supabase
      .channel('messages-insert')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `job_id=eq.${jobId}`
        },
        () => {
          // Instantly refresh exactly when a new message arrives over WebSocket
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      clearInterval(intervalId);
      supabase.removeChannel(channel);
    };
  }, [router, jobId]);

  return null;
}

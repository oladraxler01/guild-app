"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ChatAutoRefresh({ jobId }: { jobId: string }) {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    // Subscribe to new messages linked to this job_id
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
        (payload) => {
          // Instantly refresh exactly when a new message arrives over WebSocket
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router, jobId]);

  return null;
}

"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import ChatInput from "./ChatInput";

interface Message {
  id: string;
  job_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

interface RealtimeChatUIProps {
  initialMessages: Message[];
  jobId: string;
  currentUserId: string;
  otherParty: {
    first_name: string;
    last_name?: string;
    avatar_url?: string;
  } | null;
}

export default function RealtimeChatUI({ 
  initialMessages, 
  jobId, 
  currentUserId, 
  otherParty 
}: RealtimeChatUIProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);
  
  const otherPartyFirstName = otherParty?.first_name || "Unknown";

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Supabase Realtime Subscription
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel('realtime-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `job_id=eq.${jobId}`
        },
        (payload) => {
          const newMessage = payload.new as Message;
          
          setMessages((prev) => {
            // Prevent duplicates caused by optimistic updates combining with the real realtime event
            if (prev.some(m => m.id === newMessage.id)) return prev;
            
            // Wait, optimistic messages have a temp ID that won't match. We can check by content & sender just in case?
            // Actually, best to just filter out temporary optimistic messages if we want, or let React rerender.
            // A simple implementation pushes the new message and filters out optimistics.
            return [...prev.filter(m => !m.id.startsWith("temp-")), newMessage];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [jobId]);

  // Optimistic UI Handler
  const handleOptimisticSend = (content: string) => {
    const tempMsg: Message = {
      id: `temp-${Date.now()}`,
      job_id: jobId,
      sender_id: currentUserId,
      content,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempMsg]);
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 flex flex-col hide-scrollbar bg-[#fef3ff]/30">
        {messages && messages.length > 0 ? (
          messages.map((msg) => {
            const isMine = msg.sender_id === currentUserId;
            const isOptimistic = msg.id.startsWith("temp-");

            if (isMine) {
              return (
                <div key={msg.id} className={`flex flex-col items-end gap-1 self-end max-w-[85%] ${isOptimistic ? "opacity-70" : ""}`}>
                  <div className="bg-[#702ae1] text-white p-4 rounded-xl rounded-br-none text-sm shadow-sm leading-relaxed">
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-[#69537b] mr-1">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {isOptimistic && " • Sending..."}
                  </span>
                </div>
              );
            } else {
              return (
                <div key={msg.id} className="flex items-end gap-3 max-w-[85%]">
                  <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-[#f5e2ff] flex items-center justify-center font-bold text-xs">
                    {otherParty?.avatar_url ? (
                      <img src={otherParty.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      otherPartyFirstName.charAt(0)
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="bg-[#edd3ff] p-4 rounded-xl rounded-bl-none text-[#3a264b] text-sm leading-relaxed">
                      {msg.content}
                    </div>
                    <span className="text-[10px] text-[#69537b] ml-1">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            }
          })
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center opacity-50">
            <span className="material-symbols-outlined text-4xl mb-2">forum</span>
            <p className="text-sm">Say hello to get the conversation started!</p>
          </div>
        )}
        <div ref={bottomRef} className="h-1" />
      </div>

      <ChatInput jobId={jobId} onOptimisticSend={handleOptimisticSend} />
    </>
  );
}

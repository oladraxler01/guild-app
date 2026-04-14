"use client";

import { useRef, useTransition } from "react";
import { sendMessage } from "../actions";

interface ChatInputProps {
  jobId: string;
}

export default function ChatInput({ jobId }: ChatInputProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    const boundSendMessage = sendMessage.bind(null, formData, jobId);
    startTransition(() => {
      boundSendMessage();
      formRef.current?.reset();
    });
  };

  return (
    <footer className="w-full shrink-0 p-4 border-t border-[#bda3d1]/30 bg-white" style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}>
      <form ref={formRef} action={handleSubmit} className="flex items-center gap-3 bg-[#faecff] p-2 rounded-full border border-[#bda3d1]/30">
        <button type="button" className="p-2 hover:bg-[#f5e2ff] rounded-full text-[#69537b] transition-colors flex items-center justify-center">
          <span className="material-symbols-outlined">add</span>
        </button>
        <input 
          type="text" 
          name="content"
          required
          autoComplete="off"
          disabled={isPending}
          placeholder="Type a message..." 
          className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 px-2 text-[#3a264b] outline-none" 
        />
        <button 
          type="submit" 
          disabled={isPending}
          className="p-3 bg-[#702ae1] text-white rounded-full hover:shadow-lg transition-all active:scale-90 flex items-center justify-center disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[18px]">send</span>
        </button>
      </form>
    </footer>
  );
}

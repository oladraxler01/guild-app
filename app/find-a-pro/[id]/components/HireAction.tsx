"use client";

import { useState } from "react";
import { HireModal } from "./HireModal";

interface HireActionProps {
  proId: string;
}

export function HireAction({ proId }: HireActionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="w-full py-4 rounded-full tonal-gradient text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
      >
        <span className="material-symbols-outlined text-[18px]">calendar_month</span>
        Hire Now
      </button>

      <HireModal 
        proId={proId} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}

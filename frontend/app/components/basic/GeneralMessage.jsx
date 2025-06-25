"use client";

import { cn } from "@/utils/mergeCss";

function GeneralMessage({ message, className }) {
  return (
    <div className={cn("flex justify-center items-center h-[40vh]", className)}>
      <p className="font-bold text-center text-[#003883]">{message}</p>
    </div>
  );
}

export { GeneralMessage };

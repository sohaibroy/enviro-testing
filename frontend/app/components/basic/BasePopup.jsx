import React, { useEffect, useRef } from "react";
import { cn } from "@/utils/mergeCss";

const BasePopup = ({
  isOpen,
  onClose,
  onActivityClicked,
  activityText,
  activityButtonHidden,
  title,
  children,
  className,
}) => {
  const isMounted = useRef(false);

  activityButtonHidden == null ? true : activityButtonHidden;

  useEffect(() => {
    isMounted.current = isOpen;

    if (isOpen) {
      document.body.classList.add("overflow-y-hidden");
    } else {
      document.body.classList.remove("overflow-y-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-y-hidden");
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className={`fixed top-0 left-0 w-full h-full bg-black/50 z-50 flex items-center justify-center ${
        isOpen ? "overflow-hidden" : ""
      }`}
    >
      <div
        className={cn(
          "bg-white shadow-2xl p-[2rem] flex flex-col rounded-xl m-[2rem] max-w-[60rem] gap-[2rem]",
          className
        )}
      >
        <h1 className="text-2xl font-bold text-enviro_blue py-[.5rem]">
          {title || "Popup Page"}
        </h1>
        {children}
        <div className="flex justify-between">
          <button
            className="bg-transparent underline w-[6rem] flex justify-center p-2 text-enviro_orange font-bold transition-all hover:scale-[101%]"
            onClick={() => {
              onClose();
            }}
          >
            Cancel
          </button>
          <button
            hidden={activityButtonHidden}
            className="bg-enviro_blue p-2 shadow-2xl rounded-md w-[6rem] font-bold text-center transition-all hover:scale-[101%] text-white"
            onClick={() => {
              onActivityClicked();
            }}
          >
            {activityText || "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BasePopup;

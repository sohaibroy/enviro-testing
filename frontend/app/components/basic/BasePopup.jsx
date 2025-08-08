import React, { useEffect } from "react";
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
  useEffect(() => {
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

  // Hide the primary button unless BOTH activityText and onActivityClicked are provided,
  // or if activityButtonHidden was explicitly set to true.
  const isActivityHidden =
    activityButtonHidden ?? !(activityText && typeof onActivityClicked === "function");

  return (
    <div
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className={cn(
        "fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-black/50",
        isOpen ? "overflow-hidden" : ""
      )}
    >
      <div
        className={cn(
          "m-[2rem] flex max-w-[60rem] flex-col gap-[2rem] rounded-xl bg-white p-[2rem] shadow-2xl",
          className
        )}
      >
        <h1 className="py-[.5rem] text-2xl font-bold text-enviro_blue">
          {title || "Popup Page"}
        </h1>

        {/* Body */}
        {children}

        {/* Footer */}
        <div className="flex justify-between">
          <button
            className="flex w-[6rem] justify-center p-2 font-bold text-enviro_orange underline transition-all hover:scale-[101%] bg-transparent"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>

          {/* Primary action button (hidden by logic above) */}
          <button
            hidden={isActivityHidden}
            className="w-[6rem] rounded-md bg-enviro_blue p-2 text-center font-bold text-white shadow-2xl transition-all hover:scale-[101%]"
            onClick={onActivityClicked}
            type="button"
          >
            {activityText || "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BasePopup;

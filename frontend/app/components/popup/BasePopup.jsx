import React from "react";

const BasePopup = ({
  isOpen,
  onClose,
  onActivityClicked,
  activityText,
  title,
  children,
}) => {
  if (!isOpen) return null;

  return (
    // make the overlay go above the hamburger menu and the side nav (change z-index to z-[9999] from previous z-50)
    <div
      className={`fixed top-0 left-0 w-full h-full bg-black/50 z-[9999] flex items-center justify-center ${isOpen ? "overflow-hidden" : ""
        }`}
    >
      <div className="bg-white shadow-2xl p-[2rem] flex flex-col m-[2rem] gap-[2rem]">
        <h1 className="text-2xl font-bold text-[#003883] py-[.5rem]">
          {title || "Popup Page"}
        </h1>
        {children}
        <div className="flex justify-between">
          <button
            className="bg-transparent underline w-[6rem] flex justify-center p-2 text-[#ee7d11] font-bold transition-all hover:scale-[101%]"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-[#003883] p-2 shadow-2xl w-[6rem] font-bold text-center transition-all hover:scale-[101%] text-white"
            onClick={onActivityClicked}
          >
            {activityText || "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BasePopup;

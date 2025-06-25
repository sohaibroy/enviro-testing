import React from "react";

const NotificationPopup = ({
    isOpen,
    onActivityClicked,
    activityText,
    title,
    children,
}) => {
    if (!isOpen) return null;

    return (
        <div
            className={`fixed top-0 left-0 w-full h-full bg-black/50 z-50 flex items-center justify-center ${isOpen ? "overflow-hidden" : ""
                }`}
        >
            <div className="bg-white shadow-2xl p-[2rem] flex flex-col m-[2rem] gap-[2rem]">
                <h1 className="text-2xl font-bold text-[#003883] py-[.5rem]">
                    {title || "Popup Page"}
                </h1>
                {children}
                <div className="flex center">

                    <button
                        className="bg-[#EE7D11] p-2 shadow-2xl w-[6rem] font-bold text-center transition-all hover:scale-[101%] text-white"
                        onClick={onActivityClicked}
                    >
                        {activityText || "Continue"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotificationPopup;

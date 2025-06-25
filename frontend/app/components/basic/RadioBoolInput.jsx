"use client";

import { cn } from "@/utils/mergeCss";

function RadioBoolInput({ title, className, value, onChange, errorMessage }) {
  const errorHidden =
    errorMessage?.length > 0 && typeof errorMessage !== "undefined";
  return (
    <div className={cn("flex flex-col w-full md:w-[49%]", className)}>
      <p className="font-bold text-[#003883]">{title || "Radio Bool"}</p>
      <div className="flex gap-6 my-auto">
        <div className="flex gap-2">
          <label htmlFor="activeRadio" className="text-gray-700 cursor-pointer">
            Active
          </label>
          <input
            type="radio"
            id="activeRadio"
            className="form-radio focus:ring-blue-400 cursor-pointer"
            value={1}
            checked={value === 1}
            onChange={() => onChange(1)}
          />
        </div>
        <div className="flex gap-2">
          <label
            htmlFor="inactiveRadio"
            className="text-gray-700 cursor-pointer"
          >
            Inactive
          </label>
          <input
            type="radio"
            id="inactiveRadio"
            className="form-radio focus:ring-blue-400 cursor-pointer"
            value={0}
            checked={value === 0}
            onChange={() => onChange(0)}
          />
        </div>
      </div>
      <p hidden={!errorHidden} className="text-red-400 text-xs">
        {errorMessage}
      </p>
    </div>
  );
}

export { RadioBoolInput };

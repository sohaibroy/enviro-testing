"use client";

import React from "react";
import { useRouter } from "next/navigation";

const MethodCard = ({ method }) => {
  const router = useRouter();

  const defaultTurnaroundTime = method.turn_around_times.find(
    (time) => time.is_default_price === 1
  );
  const { turnaround_time, price } = defaultTurnaroundTime || {};

  const handleSelect = () => {
    sessionStorage.setItem("selectedAnalyteId", method.analyte_id); 
    sessionStorage.setItem("selectedMethodId", method.method_id);  
    router.push(`/quantity-selection/${method.method_id}`);
  };

  return (
    <div className="bg-white shadow-2xl border-[.1rem] w-[20rem] h-[30rem] p-[1.25rem] flex flex-col items-center justify-between rounded-xl hover:transition-all hover:scale-[101%] hover:translate-y-[-.5rem] duration-300">
      <div className="flex flex-col gap-[.75rem] w-full text-sm">
        <h2 className="text-2xl text-center font-bold mb-2 text-[#003883]">
          {method.method_name}
        </h2>
        <p className="flex gap-3 justify-between text-gray-900 whitespace-normal">
          <strong className="font-bold">Matrix:</strong>
          <span className="whitespace-normal ">{method.matrix}</span>
        </p>
        <p className="flex gap-3 justify-between text-gray-900 whitespace-normal">
          <strong className="font-bold">Media:</strong>
          <span className="whitespace-normal">{method.media}</span>
        </p>
        <p className="flex gap-3 justify-between text-gray-900 whitespace-normal">
          <strong className="font-bold">Measurement:</strong>
          <span className="whitespace-normal">{method.measurement}</span>
        </p>
        <p className="flex gap-3 justify-between text-gray-900 whitespace-normal">
          <strong className="font-bold">Sample Rate:</strong>
          <span className="whitespace-normal">{method.sample_rate}</span>
        </p>
        <p className="flex gap-3 justify-between text-gray-900 whitespace-normal">
          <strong className="font-bold">Limit of Quantification:</strong>
          <span className="whitespace-normal">
            {method.limit_of_quantification}
          </span>
        </p>
        {defaultTurnaroundTime && (
          <p className="flex gap-3 justify-between pb-3 text-gray-900 whitespace-normal">
            <strong className="font-bold">Price:</strong>
            <span className="whitespace-normal">
              ${price} ({turnaround_time})
            </span>
          </p>
        )}
      </div>
      <button
        onClick={handleSelect}
        className="bg-[#ee7d11] text-center text-white p-[.5rem] w-full font-semibold rounded-md hover:transition-all flex justify-center hover:scale-[101%]"
      >
        Select Method
      </button>
    </div>
  );
};

export { MethodCard };

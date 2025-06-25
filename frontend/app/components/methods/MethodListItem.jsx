"use client";

import React, { useState } from "react";
import { BaseListItem } from "../basic/BaseListItem";
import { MethodUpdatePopup } from "./MethodUpdatePopup";
import { ManageTurnAroundTimesPopup } from "../turn-around-times/ManageTurnAroundTimesPopup";

function MethodListItem({ method, fetchMethods, analyte }) {
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isTurnAroundTimesOpen, setIsTurnAroundTimesOpen] = useState(false);

  const handleUpdateOpen = () => setIsUpdateOpen(true);
  const handleUpdateClose = () => {
    fetchMethods();
    setIsUpdateOpen(false);
  };

  const handleTurnAroundTimesOpen = () => setIsTurnAroundTimesOpen(true);
  const handleTurnAroundTimesClose = () => {
    fetchMethods();
    setIsTurnAroundTimesOpen(false);
  };

  return (
    <BaseListItem>
      <div className="flex flex-wrap w-full">
        <p
          className={`text-xl font-bold mb-2 w-full ${
            method.is_active ? "text-green-500" : "text-red-500"
          }`}
        >
          {method.is_active ? "Active" : "Inactive"}
        </p>
        <p className="text-xl font-semibold mb-2 w-full mr-[.25rem]">
          {method.method_name}
        </p>
        <div className="w-full h-[.125rem] bg-gray-200 my-[1rem]" />
        <p className="text-xl font-semibold mb-2  w-full md:w-1/2">
          <span className="font-normal mr-[.25rem]">Matrix:</span>
          {method.matrix}
        </p>
        <p className="text-xl font-semibold mb-2  w-full md:w-1/2">
          <span className="font-normal mr-[.25rem]">Media:</span>
          {method.media}
        </p>
        <p className="text-xl font-semibold mb-2 w-full md:w-1/2">
          <span className="font-normal mr-[.25rem]">Measurement:</span>
          {method.measurement}
        </p>
        <p className="text-xl font-semibold mb-2 w-full md:w-1/2">
          <span className="font-normal mr-[.25rem]">Sample Rate:</span>
          {method.sample_rate || "N/A"}
        </p>
        <p className="text-xl font-semibold mb-2 w-full md:w-1/2">
          <span className="font-normal mr-[.25rem]">
            Limit Of Quantification:
          </span>
          {method.limit_of_quantification}
        </p>
        <p className="text-xl font-semibold mb-2 w-full">
          <span className="font-normal mr-[.25rem]">Comment:</span>
          {method.general_comments || "N/A"}
        </p>
      </div>
      <div className="flex flex-col justify-evenly gap-1 ml-[1rem]">
        <button
          onClick={handleTurnAroundTimesOpen}
          className={`bg-[#003883] w-[12rem] flex justify-center rounded-md p-2 text-white shadow-2xl font-bold ${
            method.is_active && analyte.is_active
              ? "transition-all hover:scale-[101%]"
              : "bg-gray-400"
          }`}
          disabled={!method.is_active && !analyte.is_active}
        >
          Turn Around Times
        </button>
        <button
          className="bg-[#003883] w-[12rem] flex justify-center p-2 rounded-md text-white shadow-2xl font-bold transition-all hover:scale-[101%]"
          onClick={handleUpdateOpen}
        >
          Edit
        </button>
      </div>
      <MethodUpdatePopup
        method={method}
        title={`Update Method For ${analyte.analyte_name}`}
        isOpen={isUpdateOpen}
        onClose={handleUpdateClose}
      />
      <ManageTurnAroundTimesPopup
        method={method}
        title={`Manage Turn Around Times For ${method.method_name}`}
        isOpen={isTurnAroundTimesOpen}
        onClose={handleTurnAroundTimesClose}
      />
    </BaseListItem>
  );
}

export { MethodListItem };

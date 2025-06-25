import React, { useState, useEffect } from "react";
import { BaseListItem } from "../basic/BaseListItem";
import { AnalyteUpdatePopup } from "./AnalyteUpdatePopup";
import Link from "next/link";

function AnalyteCRUDListItem({ analyte, fetchAnalytes }) {
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);

  const handleUpdateOpen = () => setIsUpdateOpen(true);
  const handleUpdateClose = () => {
    fetchAnalytes();
    setIsUpdateOpen(false);
  };

  return (
    <BaseListItem>
      <div className="flex flex-wrap w-[80%]">
        <p
          className={`text-xl font-bold mb-2 w-full md:w-full ${
            analyte.is_active ? "text-green-500" : "text-red-500"
          }`}
        >
          {analyte.is_active ? "Active" : "Inactive"}
        </p>
        <p className="text-xl font-semibold mb-2 w-full md:w-full">
          <span className="font-normal mr-[.25rem]">Analyte Name:</span>
          {analyte.analyte_name}
        </p>
        <p className="text-xl font-semibold mb-2 w-full md:w-full">
          <span className="font-normal mr-[.25rem]">CAS Number:</span>
          {analyte.cas_number}
        </p>
      </div>
      <div className="flex justify-evenly flex-wrap gap-1">
        <Link
          href={`/manage-methods/${analyte.analyte_id}`}
          className="bg-[#003883] w-full flex justify-center p-2 rounded-md text-white shadow-2xl font-bold transition-all hover:scale-[101%]"
        >
          Manage Methods
        </Link>
        <Link
          href={`/manage-categories/${analyte.analyte_id}`}
          className="bg-[#003883] w-full flex justify-center p-2 rounded-md text-white shadow-2xl font-bold transition-all hover:scale-[101%]"
        >
          Manage Categories
        </Link>
        <button
          className="bg-[#003883] w-full flex justify-center p-2 rounded-md text-white shadow-2xl font-bold transition-all hover:scale-[101%]"
          onClick={handleUpdateOpen}
        >
          Edit
        </button>
      </div>
      <AnalyteUpdatePopup
        analyte={analyte}
        title="Update Analyte"
        isOpen={isUpdateOpen}
        onClose={handleUpdateClose}
      />
    </BaseListItem>
  );
}

export { AnalyteCRUDListItem };

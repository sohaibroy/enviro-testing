"use client";

import React, { useState } from "react";
import { BaseListItem } from "../basic/BaseListItem";
import { CompanyUpdatePopup } from "./CompanyUpdatePopup";
import Link from "next/link";

function CompanyListItem({ company, fetchCompanies }) {
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);

  const handleUpdateOpen = () => setIsUpdateOpen(true);
  const handleUpdateClose = () => {
    fetchCompanies();
    setIsUpdateOpen(false);
  };

  return (
    <BaseListItem>
      <div className="flex flex-wrap w-full">
        <p
          className={`text-xl font-bold mb-2 w-full ${
            company.is_active ? "text-green-500" : "text-red-500"
          }`}
        >
          {company.is_active ? "Active" : "Inactive"}
        </p>
        <p className="text-xl font-semibold mb-2 w-full">
          <span className="font-normal mr-[.25rem]">Company Name:</span>
          {company.company_name}
        </p>

        <div className="w-full h-[.125rem] bg-gray-200 my-[1rem]" />

        <p className="text-xl font-semibold mb-2 w-full md:w-1/2">
          <span className="font-normal mr-[.25rem]">Company Phone:</span>
          {company.company_phone}
        </p>
        <p className="text-xl font-semibold mb-2 w-full md:w-1/2">
          <span className="font-normal mr-[.25rem]">Company Address:</span>
          {company.address}
        </p>
      </div>
      <div className="flex flex-col justify-evenly gap-1 ml-[1rem] w-[14rem]">
        <Link
          href={`/manage-accounts/${company.company_id}`}
          className="bg-[#003883] w-full flex justify-center p-2 rounded-md text-center text-white shadow-2xl font-bold transition-all hover:scale-[101%]"
        >
          Manage Accounts
        </Link>
        <Link
          href={`/manage-pricing/${company.company_id}`}
          className="bg-[#003883] w-full flex justify-center p-2 rounded-md text-center text-white shadow-2xl font-bold transition-all hover:scale-[101%]"
        >
          Manage Pricing
        </Link>
        <button
          className="bg-[#003883] w-full flex justify-center p-2 rounded-md text-white shadow-2xl font-bold transition-all hover:scale-[101%]"
          onClick={handleUpdateOpen}
        >
          Edit
        </button>
      </div>
      <CompanyUpdatePopup
        company={company}
        title="Update Company"
        isOpen={isUpdateOpen}
        onClose={handleUpdateClose}
      />
    </BaseListItem>
  );
}

export { CompanyListItem };

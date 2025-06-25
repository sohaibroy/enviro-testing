"use client";

import React, { useState } from "react";
import { BaseListItem } from "../basic/BaseListItem";
import { AccountUpdatePopup } from "./AccountUpdatePopup";

function AccountListItem({ account, company, fetchAccounts }) {
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);

  const handleUpdateOpen = () => setIsUpdateOpen(true);
  const handleUpdateClose = () => {
    fetchAccounts();
    setIsUpdateOpen(false);
  };

  return (
    <BaseListItem>
      <div className="flex flex-wrap w-full">
        <p
          className={`text-xl font-bold mb-2 w-full ${
            account.is_active ? "text-green-500" : "text-red-500"
          }`}
        >
          {account.is_active ? "Active" : "Inactive"}
        </p>
        <p className="text-xl font-semibold mb-2 w-full md:w-1/2">
          <span className="font-normal mr-[.25rem]">First Name:</span>
          {account.first_name}
        </p>
        <p className="text-xl font-semibold mb-2 w-full md:w-1/2">
          <span className="font-normal mr-[.25rem]">Last Name:</span>
          {account.last_name}
        </p>
        <p className="text-xl font-semibold mb-2 w-full md:w-1/2">
          <span className="font-normal mr-[.25rem]">Phone Number:</span>
          {account.phone_number}
        </p>
        <p className="text-xl font-semibold mb-2 w-full md:w-1/2">
          <span className="font-normal mr-[.25rem]">Email:</span>
          {account.email}
        </p>
      </div>
      <div className="flex flex-col justify-evenly gap-1">
        <button
          className="bg-[#003883] w-[4rem] flex justify-center p-2 rounded-md text-white shadow-2xl font-bold transition-all hover:scale-[101%]"
          onClick={handleUpdateOpen}
        >
          Edit
        </button>
      </div>
      <AccountUpdatePopup
        account={account}
        company={company}
        title="Update Account"
        isOpen={isUpdateOpen}
        onClose={handleUpdateClose}
      />
    </BaseListItem>
  );
}

export { AccountListItem };

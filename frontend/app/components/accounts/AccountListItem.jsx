"use client";

import React, { useState } from "react";
import { BaseListItem } from "../basic/BaseListItem";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

function AccountListItem({ account, company, fetchAccounts }) {

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
  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
  onClick={async () => {
    const confirm = window.confirm("Are you sure you want to unassign this account?");
    if (!confirm) return;

    const res = await fetch(`${baseUrl}/api/accounts/${account.account_id}/remove-company`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
    });

    const data = await res.json();
    if (res.ok) {
      alert("Account unassigned successfully.");
      fetchAccounts(); // Refresh list
    } else {
      console.error("Unassign failed:", data);
      alert("Failed to unassign account.");
    }
  }}
>
  Delete
</button>
      </div>
      
    </BaseListItem>
  );
}

export { AccountListItem };

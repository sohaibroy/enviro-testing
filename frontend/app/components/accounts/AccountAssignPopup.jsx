"use client";

import React, { useState, useEffect } from "react";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export function AccountAssignPopup({ isOpen, onClose, company, fetchAccounts }) {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState("");

  // Fetch accounts with null company_id
  useEffect(() => {
    if (!isOpen) return;

    const fetchUnassignedAccounts = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/accounts/unassigned`, {
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        });

        if (!res.ok) {
          console.error("Unexpected response:", await res.json());
          setAccounts([]);
          return;
        }

        const data = await res.json();
        if (Array.isArray(data)) {
          setAccounts(data);
        } else {
          console.error("Invalid response format:", data);
          setAccounts([]);
        }
      } catch (err) {
        console.error("Failed to fetch unassigned accounts:", err);
        setAccounts([]);
      }
    };

    fetchUnassignedAccounts();
  }, [isOpen]);

  // Assign the selected account to the given company
  const handleAssign = async () => {
  if (!selectedAccountId || !company?.company_id) return;

  try {
    // 1. Fetch CSRF cookie
    await fetch(`${baseUrl}/sanctum/csrf-cookie`, {
      credentials: "include",
    });

    // 2. Now make your authenticated POST request
    const res = await fetch(
      `${baseUrl}/api/accounts/${selectedAccountId}/assign-company`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
        credentials: "include", // 🔥 important to send cookies
        body: JSON.stringify({ company_id: company.company_id }),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      console.error("Assignment failed:", err);
      return;
    }

    onClose();
    fetchAccounts(); // Refresh parent
  } catch (err) {
    console.error("Failed to assign account:", err);
  }
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 shadow-lg w-[90%] max-w-md">
        <h2 className="text-xl font-bold mb-4">
          Assign Unassigned Account to {company?.company_name || "Company"}
        </h2>

        {accounts.length === 0 ? (
          <p className="text-gray-600">No unassigned accounts available.</p>
        ) : (
          <>
            <select
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              className="w-full p-2 mb-4 border rounded"
            >
              <option value="">Select an account</option>
              {accounts.map((acc) => (
                <option key={acc.account_id} value={acc.account_id}>
                  {acc.first_name} {acc.last_name} ({acc.email})
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 border rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAssign}
                className="px-4 py-2 bg-[#003883] text-white rounded hover:opacity-90"
              >
                Assign
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
"use client";

import React, { useState, useEffect } from "react";
import { CRUDHeader } from "@/app/components/navigation/CRUDHeader";
import { AccountCreatePopup } from "@/app/components/accounts/AccountCreatePopup";
import { AccountListItem } from "@/app/components/accounts/AccountListItem";
import { LoadingIcon } from "@/app/components/loading/LoadingIcon";
import { ErrorMessage } from "@/app/components/basic/ErrorMessage";
import { GeneralMessage } from "@/app/components/basic/GeneralMessage";
import { isTokenExpired } from "@/utils/session";
import { AccountAssignPopup } from "@/app/components/accounts/AccountAssignPopup";
import { AddAccountPopup } from "@/app/components/accounts/AddAccountPopup";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

function ManageAccountsPage({ params }) {
 const [isAddNewOpen, setIsAddNewOpen] = useState(false);
  const [company, setCompany] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAssignOpen, setIsAssignOpen] = useState(false); // assign existing

  const fetchCompany = async () => {
    try {
      if (isTokenExpired()) {
        window.location.href = "/admin-login";
        return;
      }

      const response = await fetch(
        `${baseUrl}/api/company/${params.company_id}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        }
      );
      const data = await response.json();
      setCompany(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchAccounts = async () => {
    try {
      if (isTokenExpired()) {
        window.location.href = "/admin-login";
        return;
      }

      const response = await fetch(
        `${baseUrl}/api/accounts/${company.company_id}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        }
      );
      const data = await response.json();
      setAccounts(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompany();
  }, [params.company_id]);

  useEffect(() => {
    if (company.company_id) {
      fetchAccounts();
    }
  }, [company.company_id]);

  return (
    <div>
      <CRUDHeader
        title={`Manage Accounts For ${company.company_name || "..."}`}
        href="/manage-companies"
      />
      <section className="w-full max-w-[70rem] mx-auto">
        <div className="flex gap-[.25rem]">
          <button
            className="bg-[#003883] p-2 shadow-2xl font-bold text-center rounded-md transition-all hover:scale-[101%] text-white"
            onClick={() => setIsAssignOpen(true)}
          >
            Assign Existing
          </button>

          <button
            onClick={() => setIsAddNewOpen(true)}
            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
          >
            Add New Account
          </button>
        </div>

        {loading ? (
          <LoadingIcon />
        ) : error ? (
          <ErrorMessage error={error} />
        ) : accounts.length > 0 ? (
          <ul>
            {accounts.map((accountData) => (
              <AccountListItem
                key={accountData.account_id}
                account={accountData}
                company={company}
                fetchAccounts={fetchAccounts}
              />
            ))}
          </ul>
        ) : (
          <GeneralMessage
            message={`No Accounts Found for ${company.company_name}`}
          />
        )}
      </section>

      <AccountAssignPopup
        isOpen={isAssignOpen}
        onClose={() => setIsAssignOpen(false)}
        company={company}
        fetchAccounts={fetchAccounts}
      />

      <AddAccountPopup
        isOpen={isAddNewOpen}
        onClose={() => setIsAddNewOpen(false)}
        fetchAccounts={fetchAccounts}
        companyId={company?.company_id}
      />
    </div>
  );
}

export default ManageAccountsPage;


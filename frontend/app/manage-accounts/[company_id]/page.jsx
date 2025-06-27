"use client";

import React, { useState, useEffect } from "react";
import { CRUDHeader } from "@/app/components/navigation/CRUDHeader";
import { AccountCreatePopup } from "@/app/components/accounts/AccountCreatePopup";
import { AccountListItem } from "@/app/components/accounts/AccountListItem";
import { LoadingIcon } from "@/app/components/loading/LoadingIcon";
import { ErrorMessage } from "@/app/components/basic/ErrorMessage";
import { GeneralMessage } from "@/app/components/basic/GeneralMessage";
import { isTokenExpired } from "@/utils/session";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

function ManageAccountsPage({ params }) {
  const [company, setCompany] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCompany = async () => {
    try {
      if (isTokenExpired()) {
        window.location.href = "/admin-login";
        return;
      }

      const response = await fetch(
        //`http://localhost:80/api/company/${params.company_id}`,
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
        //`http://localhost:80/api/accounts/${company.company_id}`,
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

  const handleCreateOpen = () => setIsCreateOpen(true);
  const handleCreateClose = () => {
    fetchAccounts();
    setIsCreateOpen(false);
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
            onClick={handleCreateOpen}
          >
            Create New
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
      <AccountCreatePopup
        title={`Create Account For ${company.company_name}`}
        isOpen={isCreateOpen}
        company={company}
        onClose={handleCreateClose}
      />
    </div>
  );
}

export default ManageAccountsPage;

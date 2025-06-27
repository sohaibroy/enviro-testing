"use client";

import React, { useState, useEffect } from "react";
import { CompanyListItem } from "../components/company/CompanyListItem";
import { AdminSearch } from "../components/adminsearch/AdminSearch";
import { CompanyCreatePopup } from "../components/company/CompanyCreatePopup";
import { CRUDHeader } from "../components/navigation/CRUDHeader";
import { LoadingIcon } from "../components/loading/LoadingIcon";
import { GeneralMessage } from "../components/basic/GeneralMessage";
import { ErrorMessage } from "../components/basic/ErrorMessage";
import { isTokenExpired } from "@/utils/session";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

function ManageCompanies() {
  const [companies, setCompanies] = useState([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const fetchCompanies = async () => {
    try {
      if (isTokenExpired()) {
        window.location.href = "/admin-login";
        return;
      }

      if (searchTerm.trim() !== "") {
        await fetchSearchResults();
      } else {
        //const response = await fetch("http://localhost:80/api/companies", {
        const response = await fetch(`${baseUrl}/api/companies`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        });

        if (!response.ok) {
          throw new Error(response.statusText);
        }

        const data = await response.json();
        setCompanies(data);
        setLoading(false);
      }
    } catch (error) {
      const errorMessage = error.toString();
      setError(errorMessage);
      setLoading(false);
    }
  };

  const fetchSearchResults = async () => {
    try {
      if (isTokenExpired()) {
        window.location.href = "/admin-login";
        return;
      }

      const response = await fetch(
        //`http://localhost:80/api/company/search/${encodeURIComponent(
        `${baseUrl}/api/company/search/${encodeURIComponent(
          searchTerm
        )}`
      );
      const data = await response.json();
      setCompanies(Array.isArray(data.message) ? data.message : []);
      setCompanies(data.message);
      setLoading(false);
    } catch (error) {
      const errorMessage = error.toString();
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleCreateOpen = () => setIsCreateOpen(true);
  const handleCreateClose = () => {
    fetchCompanies();
    setIsCreateOpen(false);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return (
    <div className="mb-[5rem] flex flex-col gap-4">
      <CRUDHeader title="Manage Companies" href="./admin-selection" />
      <section className="w-full max-w-[70rem] mx-auto">
        <div className="flex gap-[.25rem]">
          <button
            className="bg-[#003883] p-2 shadow-2xl font-bold text-center rounded-md transition-all hover:scale-[101%] text-white"
            onClick={handleCreateOpen}
          >
            Create New
          </button>
          <AdminSearch
            onSearch={fetchCompanies}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>
        {loading ? (
          <LoadingIcon />
        ) : error ? (
          <ErrorMessage error={error} />
        ) : Array.isArray(companies) && companies.length > 0 ? (
          <ul>
            {companies.map((companyData) => (
              <CompanyListItem
                key={companyData.company_id}
                company={companyData}
                fetchCompanies={fetchCompanies}
              />
            ))}
          </ul>
        ) : (
          <GeneralMessage message={`No Companies Found`} />
        )}
      </section>
      <CompanyCreatePopup
        title="Create Company"
        isOpen={isCreateOpen}
        onClose={handleCreateClose}
      />
    </div>
  );
}

export default ManageCompanies;

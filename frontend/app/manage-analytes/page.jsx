"use client";

import React, { useState, useEffect } from "react";
import { AdminSearch } from "../components/adminsearch/AdminSearch";
import { CRUDHeader } from "../components/navigation/CRUDHeader";
import { AnalyteCRUDListItem } from "../components/analytes/AnalyteCRUDListItem";
import { AnalyteCreatePopup } from "../components/analytes/AnalyteCreatePopup";
import { LoadingIcon } from "../components/loading/LoadingIcon";
import { ErrorMessage } from "../components/basic/ErrorMessage";
import { GeneralMessage } from "../components/basic/GeneralMessage";
import { isTokenExpired } from "@/utils/session";

function ManageAnalytes() {
  const [analytes, setAnalytes] = useState([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAnalytes = async () => {
    try {
      if (isTokenExpired()) {
        window.location.href = "/admin-login";
        return;
      }

      if (searchTerm.trim() !== "") {
        await fetchSearchResults();
      } else {
        const response = await fetch("http://localhost:80/api/analytes", {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        });
        const data = await response.json();
        setAnalytes(data);
        setLoading(false);
      }
    } catch (error) {
      const errorMessage = error.toString();
      setError(errorMessage);
      setLoading(false);
    }
  };

  const fetchSearchResults = async () => {
    setLoading(true);
    try {
      if (isTokenExpired()) {
        window.location.href = "/admin-login";
        return;
      }

      const response = await fetch(
        `http://localhost:80/api/analyte/search/${encodeURIComponent(
          searchTerm
        )}`,
        {
          method: "POST",
        }
      );
      const data = await response.json();
      setAnalytes(data);
      setLoading(false);
    } catch (error) {
      const errorMessage = error.toString();
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleCreateOpen = () => setIsCreateOpen(true);
  const handleCreateClose = () => {
    fetchAnalytes();
    setIsCreateOpen(false);
  };

  useEffect(() => {
    fetchAnalytes();
  }, []);

  return (
    <div className="mb-[5rem] flex flex-col gap-4">
      <CRUDHeader title="Manage Analytes" href="./admin-selection" />
      <section className="w-full max-w-[70rem] mx-auto">
        <div className="flex gap-[.25rem]">
          <button
            className="bg-[#003883] p-2 shadow-2xl font-bold text-center rounded-md transition-all hover:scale-[101%] text-white"
            onClick={handleCreateOpen}
          >
            Create New
          </button>
          <AdminSearch
            onSearch={fetchAnalytes}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>

        {loading ? (
          <LoadingIcon />
        ) : error ? (
          <ErrorMessage error={error} />
        ) : analytes.length > 0 ? (
          <ul>
            {analytes.map((analytesData) => (
              <AnalyteCRUDListItem
                key={analytesData.analyte_id}
                analyte={analytesData}
                fetchAnalytes={fetchAnalytes}
              />
            ))}
          </ul>
        ) : (
          <GeneralMessage message={`No Analyte Found`} />
        )}
      </section>

      <AnalyteCreatePopup
        title="Create Analytes"
        isOpen={isCreateOpen}
        onClose={handleCreateClose}
      />
    </div>
  );
}

export default ManageAnalytes;

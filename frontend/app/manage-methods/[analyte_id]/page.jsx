"use client";

import React, { useState, useEffect } from "react";
import { CRUDHeader } from "@/app/components/navigation/CRUDHeader";
import { Search } from "@/app/components/search/Search";
import { MethodListItem } from "@/app/components/methods/MethodListItem";
import { MethodCreatePopup } from "@/app/components/methods/MethodCreatePopup";
import { LoadingIcon } from "@/app/components/loading/LoadingIcon";
import { GeneralMessage } from "@/app/components/basic/GeneralMessage";
import { ErrorMessage } from "@/app/components/basic/ErrorMessage";
import { isTokenExpired } from "@/utils/session";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

function ManageMethodsPage({ params }) {

  const [analyte, setAnalyte] = useState([]);
  const [methods, setMethods] = useState([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalyte = async () => {
    try {
      if (isTokenExpired()) {
        window.location.href = "/admin-login";
        return;
      }

      const response = await fetch(
        //`http://localhost:80/api/analyte/${params.analyte_id}`,
        `${baseUrl}/api/analyte/${params.analyte_id}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        }
      );
      const data = await response.json();
      setAnalyte(data);
    } catch (error) {
      setError(error);
    }
  };

  const fetchMethods = async () => {
    try {
      if (isTokenExpired()) {
        window.location.href = "/admin-login";
        return;
      }

      const response = await fetch(
        //`http://localhost:80/api/methods/analyte/${analyte.analyte_id}`,
        `${baseUrl}/api/methods/analyte/${analyte.analyte_id}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        }
      );
      const data = await response.json();
      setMethods(data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const handleCreateOpen = () => setIsCreateOpen(true);
  const handleCreateClose = () => {
    fetchMethods();
    setIsCreateOpen(false);
  };

  useEffect(() => {
    fetchAnalyte();
  }, [params.analyte_id]);

  useEffect(() => {
    if (analyte.analyte_id) {
      fetchMethods();
    }
  }, [analyte.analyte_id]);

  return (
    <div>
      <CRUDHeader
        title={`Manage Methods For ${analyte.analyte_name || "..."}`}
        href="/manage-analytes"
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
        ) : methods.length > 0 ? (
          <ul>
            {methods.map((methodData) => (
              <MethodListItem
                key={methodData.method_id}
                method={methodData}
                fetchMethods={fetchMethods}
                analyte={analyte}
              />
            ))}
          </ul>
        ) : (
          <GeneralMessage message={`No Methods Found`} />
        )}
      </section>
      <MethodCreatePopup
        title={`Create Method For ${analyte.analyte_name}`}
        isOpen={isCreateOpen}
        analyte={analyte}
        onClose={handleCreateClose}
      />
    </div>
  );
}

export default ManageMethodsPage;

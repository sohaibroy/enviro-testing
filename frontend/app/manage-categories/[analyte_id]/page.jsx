"use client";

import React, { useState, useEffect } from "react";
import { CRUDHeader } from "../../components/navigation/CRUDHeader";
import { CategoryCRUDListItem } from "../../components/categories/CategoryCRUDListItem";
import { CategoryCreatePopup } from "../../components/categories/CategoryCreatePopup";
import { LoadingIcon } from "../../components/loading/LoadingIcon";
import { ErrorMessage } from "../../components/basic/ErrorMessage";
import { GeneralMessage } from "../../components/basic/GeneralMessage";
import { isTokenExpired } from "@/utils/session";

function ManageCategoriesPage({ params }) {
  const [analyte, setAnalyte] = useState([]);
  const [categories, setCategories] = useState([]);
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
        `http://localhost:80/api/analyte/${params.analyte_id}`,
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

  const fetchCategories = async () => {
    try {
      if (isTokenExpired()) {
        window.location.href = "/admin-login";
        return;
      }

      const response = await fetch(
        `http://localhost:80/api/categories/${params.analyte_id}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        }
      );
      const data = await response.json();
      setCategories(data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const handleCreateOpen = () => setIsCreateOpen(true);
  const handleCreateClose = () => {
    fetchCategories();
    setIsCreateOpen(false);
  };

  useEffect(() => {
    fetchAnalyte();
  }, [params.analyte_id]);

  useEffect(() => {
    if (analyte.analyte_id) {
      fetchCategories();
    }
  }, [analyte.analyte_id]);

  return (
    <div className="mb-[5rem] flex flex-col gap-4">
      <CRUDHeader
        title={`Manage Categories For ${analyte.analyte_name || "..."}`}
        href={`/manage-analytes`}
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
        ) : categories.length > 0 ? (
          <ul>
            {categories.map((categoriesData, index) => (
              <CategoryCRUDListItem
                key={`${categoriesData.category_id}-${index}`}
                category={categoriesData}
                analyte={analyte}
                fetchCategories={fetchCategories}
              />
            ))}
          </ul>
        ) : (
          <GeneralMessage message={`No Category Found`} />
        )}
      </section>

      <CategoryCreatePopup
        title={`Create Category For ${analyte.analyte_name}`}
        isOpen={isCreateOpen}
        onClose={handleCreateClose}
        analyte={analyte}
      />
    </div>
  );
}

export default ManageCategoriesPage;

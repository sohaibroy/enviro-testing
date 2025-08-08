"use client";

import React, { useState } from "react";
import BasePopup from "../basic/BasePopup";
import { ValidationInput } from "../basic/ValidationInput";
import { RadioBoolInput } from "../basic/RadioBoolInput";
import { isTokenExpired } from "@/utils/session";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const getCookie = (name) => {
  const m = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return m ? decodeURIComponent(m[2]) : null;
};

const ensureCsrf = async () => {
  await fetch(`${baseUrl}/sanctum/csrf-cookie`, { credentials: "include" });
};

const CategoryUpdatePopup = ({ category, isOpen, onClose, title }) => {
  if (!isOpen) return null;

  const [currentCategory, setCategory] = useState({
    category_name: category.category_name || "",
    technique: category.technique || "",
    is_active: category.is_active !== null ? category.is_active : 1,
  });

  const [errors, setErrors] = useState({
    category_name: "",
    technique: "",
    is_active: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  const validateInput = () => {
    const newErrors = {};
    if (!currentCategory.category_name.trim()) newErrors.category_name = "Category Name is required";
    if (!currentCategory.technique.trim()) newErrors.technique = "Technique is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateCategory = async () => {
    if (!validateInput()) return;

    if (isTokenExpired()) {
      window.location.href = "/admin-login";
      return;
    }

    try {
      await ensureCsrf();
      const xsrfToken = getCookie("XSRF-TOKEN");

      const res = await fetch(`${baseUrl}/api/category/update/${category.category_id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": xsrfToken || "",
          Authorization: `Bearer ${sessionStorage.getItem("accessToken") || ""}`,
        },
        body: JSON.stringify({
          category_name: currentCategory.category_name,
          technique: currentCategory.technique,
          is_active: currentCategory.is_active,
        }),
      });

      const text = await res.text();
      let payload = null;
      try { payload = text ? JSON.parse(text) : null; } catch { payload = text || null; }

      if (!res.ok) {
        alert((payload && payload.message) || `Failed to update category. HTTP ${res.status}`);
        return;
      }

      setSuccessMessage("Category updated successfully!");
      setTimeout(() => {
        setSuccessMessage("");
        onClose?.();
      }, 1500);
    } catch {
      alert("Failed to update category. Please try again.");
    }
  };

  const deleteCategory = async () => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    if (isTokenExpired()) {
      window.location.href = "/admin-login";
      return;
    }

    try {
      await ensureCsrf();
      const xsrfToken = getCookie("XSRF-TOKEN");

      const res = await fetch(`${baseUrl}/api/category/${category.category_id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "X-XSRF-TOKEN": xsrfToken || "",
          Authorization: `Bearer ${sessionStorage.getItem("accessToken") || ""}`,
        },
      });

      const text = await res.text();
      let payload = null;
      try { payload = text ? JSON.parse(text) : null; } catch { payload = text || null; }

      if (!res.ok) {
        alert((payload && payload.message) || `Failed to delete category. HTTP ${res.status}`);
        return;
      }

      setSuccessMessage("Category deleted successfully!");
      setTimeout(() => {
        setSuccessMessage("");
        onClose?.();
      }, 1500);
    } catch {
      alert("Failed to delete category. Check server logs and try again.");
    }
  };

  return (
    <BasePopup isOpen={isOpen} onClose={onClose} title={title}>
      {successMessage && (
        <div
          className="w-full mb-4 p-2 text-green-800 bg-green-100 border border-green-300 rounded"
          role="status"
          aria-live="polite"
        >
          {successMessage}
        </div>
      )}

      <form className="flex flex-wrap justify-between gap-y-4">
        <ValidationInput
          title="Category Name"
          value={currentCategory.category_name}
          onChange={(e) => setCategory({ ...currentCategory, category_name: e.target.value })}
          errorMessage={errors.category_name}
        />
        <ValidationInput
          title="Technique"
          value={currentCategory.technique}
          onChange={(e) => setCategory({ ...currentCategory, technique: e.target.value })}
          errorMessage={errors.technique}
        />
        <RadioBoolInput
          title="Status"
          value={currentCategory.is_active}
          errorMessage={errors.is_active}
          onChange={(selectedValue) => {
            setCategory({ ...currentCategory, is_active: selectedValue });
          }}
        />
      </form>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={deleteCategory}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
        >
          Delete
        </button>
        <button
          type="button"
          onClick={updateCategory}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Update
        </button>
      </div>
    </BasePopup>
  );
};

export { CategoryUpdatePopup };

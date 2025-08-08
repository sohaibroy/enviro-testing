"use client";

import React, { useState } from "react";
import BasePopup from "../basic/BasePopup";
import { ValidationInput } from "../basic/ValidationInput";
import { isTokenExpired } from "@/utils/session";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const getCookie = (name) => {
  const m = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return m ? decodeURIComponent(m[2]) : null;
};

const ensureCsrf = async () => {
  await fetch(`${baseUrl}/sanctum/csrf-cookie`, { credentials: "include" });
};

const CategoryCreatePopup = ({ isOpen, onClose, title, analyte }) => {
  if (!isOpen) return null;

  const [category, setCategory] = useState({
    category_name: "",
    technique: "",
  });

  const [errors, setErrors] = useState({
    category_name: "",
    technique: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  const validateInput = () => {
    const newErrors = {};
    if (!category.category_name.trim()) newErrors.category_name = "Category Name is required";
    if (!category.technique.trim()) newErrors.technique = "Technique is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const postCategory = async () => {
    if (!validateInput()) return;

    if (isTokenExpired()) {
      window.location.href = "/admin-login";
      return;
    }

    try {
      // CSRF first
      await ensureCsrf();
      const xsrfToken = getCookie("XSRF-TOKEN");

      const res = await fetch(`${baseUrl}/api/category/create/${analyte.analyte_id}`, {
        method: "POST",
        credentials: "include", //send cookies
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": xsrfToken || "",
        },
        body: JSON.stringify({
          category_name: category.category_name,
          technique: category.technique,
          is_active: 1,
        }),
      });

      const text = await res.text();
      let payload = null;
      try { payload = text ? JSON.parse(text) : null; } catch { payload = text || null; }

      if (!res.ok) {
        alert((payload && payload.message) || `HTTP ${res.status}`);
        return;
      }

      //success
      setSuccessMessage("Category created successfully!");
      setTimeout(() => {
        setSuccessMessage("");
        //reset form
        setCategory({ category_name: "", technique: "" });
        setErrors({ category_name: "", technique: "" });
        onClose?.();
      }, 1500);
    } catch {
      alert("Failed to create category. Please try again.");
    }
  };

  return (
    <BasePopup
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      onActivityClicked={postCategory}
      activityText="Create"
    >
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
          value={category.category_name}
          className="md:w-full"
          onChange={(e) => setCategory({ ...category, category_name: e.target.value })}
          errorMessage={errors.category_name}
        />
        <ValidationInput
          title="Technique"
          value={category.technique}
          className="md:w-full"
          onChange={(e) => setCategory({ ...category, technique: e.target.value })}
          errorMessage={errors.technique}
        />
      </form>
    </BasePopup>
  );
};

export { CategoryCreatePopup };
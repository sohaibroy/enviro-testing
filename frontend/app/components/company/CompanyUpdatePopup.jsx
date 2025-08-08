"use client";

import React, { useState } from "react";
import BasePopup from "../basic/BasePopup";
import { ValidationInput } from "../basic/ValidationInput";
import { RadioBoolInput } from "../basic/RadioBoolInput";
import { isTokenExpired } from "@/utils/session";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

// Read a cookie value
const getCookie = (name) => {
  const m = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return m ? decodeURIComponent(m[2]) : null;
};

// Ensure we have the Sanctum CSRF cookie
const ensureCsrf = async () => {
  await fetch(`${baseUrl}/sanctum/csrf-cookie`, { credentials: "include" });
};

const CompanyUpdatePopup = ({ company, isOpen, onClose, title }) => {
  if (!isOpen) return null;

  const [currentCompany, setCompany] = useState({
    company_name: company.company_name || "",
    company_phone: company.company_phone || "",
    address: company.address || "",
    is_active: company.is_active !== null ? company.is_active : 1,
  });

  const [errors, setErrors] = useState({
    company_name: "",
    company_phone: "",
    address: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  const validateInput = () => {
    const newErrors = {};
    if (!currentCompany.company_name.trim())
      newErrors.company_name = "Company Name is required";
    if (!currentCompany.company_phone.trim())
      newErrors.company_phone = "Company Phone Number is required";
    if (!currentCompany.address.trim())
      newErrors.address = "Company Address is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateCompany = async () => {
    if (!validateInput()) return;

    if (isTokenExpired()) {
      window.location.href = "/admin-login";
      return;
    }

    try {
      await ensureCsrf();
      const xsrf = getCookie("XSRF-TOKEN");

      const res = await fetch(`${baseUrl}/api/company/update/${company.company_id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": xsrf || "",
          Authorization: `Bearer ${sessionStorage.getItem("accessToken") || ""}`,
        },
        body: JSON.stringify({
          company_name: currentCompany.company_name,
          company_phone: currentCompany.company_phone,
          address: currentCompany.address,
          is_active: currentCompany.is_active,
        }),
      });

      const text = await res.text();
      let payload = null;
      try { payload = text ? JSON.parse(text) : null; } catch { payload = text || null; }

      if (!res.ok) {
        alert((payload && payload.message) || `HTTP ${res.status}`);
        return;
      }

      setSuccessMessage("Company updated successfully!");
      setTimeout(() => {
        setSuccessMessage("");
        onClose?.();
      }, 1500);
    } catch {
      alert("Failed to update company. Please try again.");
    }
  };

  const deleteCompany = async () => {
    if (!window.confirm("Are you sure you want to delete this company?")) return;

    if (isTokenExpired()) {
      window.location.href = "/admin-login";
      return;
    }

    try {
      await ensureCsrf();
      const xsrf = getCookie("XSRF-TOKEN");

      // Make sure you have a matching backend route like:
      // Route::delete('company/{company_id}', [CompanyController::class, 'deleteCompany']);
      const res = await fetch(`${baseUrl}/api/company/${company.company_id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "X-XSRF-TOKEN": xsrf || "",
          Authorization: `Bearer ${sessionStorage.getItem("accessToken") || ""}`,
        },
      });

      const text = await res.text();
      let payload = null;
      try { payload = text ? JSON.parse(text) : null; } catch { payload = text || null; }

      if (!res.ok) {
        alert((payload && payload.message) || `HTTP ${res.status}`);
        return;
      }

      setSuccessMessage("Company deleted successfully!");
      setTimeout(() => {
        setSuccessMessage("");
        onClose?.();
      }, 1500);
    } catch {
      alert("Failed to delete company. It may be in use or blocked by CSRF.");
    }
  };

  return (
    <BasePopup
      isOpen={isOpen}
      onClose={onClose}
      title={title}
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
          title="Company Name"
          value={currentCompany.company_name}
          onChange={(e) =>
            setCompany({ ...currentCompany, company_name: e.target.value })
          }
          errorMessage={errors.company_name}
        />
        <ValidationInput
          title="Company Phone"
          value={currentCompany.company_phone}
          onChange={(e) =>
            setCompany({ ...currentCompany, company_phone: e.target.value })
          }
          errorMessage={errors.company_phone}
        />
        <ValidationInput
          title="Company Address"
          value={currentCompany.address}
          onChange={(e) =>
            setCompany({ ...currentCompany, address: e.target.value })
          }
          errorMessage={errors.address}
        />
        <RadioBoolInput
          title="Status"
          value={currentCompany.is_active}
          onChange={(selectedValue) => {
            setCompany({ ...currentCompany, is_active: selectedValue });
          }}
        />
      </form>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={deleteCompany}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
        >
          Delete
        </button>
        <button
          type="button"
          onClick={updateCompany}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Update
        </button>
      </div>
    </BasePopup>
  );
};

export { CompanyUpdatePopup };

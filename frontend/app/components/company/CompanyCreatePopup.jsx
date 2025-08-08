"use client";

import React, { useState } from "react";
import BasePopup from "../basic/BasePopup";
import { ValidationInput } from "../basic/ValidationInput";
import { isTokenExpired } from "@/utils/session";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

// Cookie reader helper
const getCookie = (name) => {
  const m = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return m ? decodeURIComponent(m[2]) : null;
};

// CSRF fetch helper
const ensureCsrf = async () => {
  await fetch(`${baseUrl}/sanctum/csrf-cookie`, { credentials: "include" });
};

const CompanyCreatePopup = ({ isOpen, onClose, title }) => {
  if (!isOpen) return null;

  const [company, setCompany] = useState({
    company_name: "",
    company_phone: "",
    address: "",
    is_active: 1,
  });

  const [errors, setErrors] = useState({
    company_name: "",
    company_phone: "",
    address: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  const validateInput = () => {
    const newErrors = {};
    if (!company.company_name.trim()) newErrors.company_name = "Company Name is required";
    if (!company.company_phone.trim()) newErrors.company_phone = "Company Phone Number is required";
    if (!company.address.trim()) newErrors.address = "Company Address is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const postCompany = async () => {
    if (!validateInput()) return;

    if (isTokenExpired()) {
      window.location.href = "/admin-login";
      return;
    }

    try {
      // Get CSRF first
      await ensureCsrf();
      const xsrfToken = getCookie("XSRF-TOKEN");

      const res = await fetch(`${baseUrl}/api/company/create`, {
        method: "POST",
        credentials: "include", // send cookies
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": xsrfToken || "",
          Authorization: `Bearer ${sessionStorage.getItem("accessToken") || ""}`,
        },
        body: JSON.stringify({
          company_name: company.company_name,
          company_phone: company.company_phone,
          address: company.address,
          is_active: company.is_active,
        }),
      });

      const text = await res.text();
      let payload = null;
      try { payload = text ? JSON.parse(text) : null; } catch { payload = text || null; }

      if (!res.ok) {
        alert((payload && payload.message) || `HTTP ${res.status}`);
        return;
      }

      // Success feedback + reset
      setSuccessMessage("Company created successfully!");
      setTimeout(() => {
        setSuccessMessage("");
        setCompany({ company_name: "", company_phone: "", address: "", is_active: 1 });
        setErrors({ company_name: "", company_phone: "", address: "" });
        onClose?.();
      }, 1500);
    } catch {
      alert("Failed to create company. Please try again.");
    }
  };

  return (
    <BasePopup
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      onActivityClicked={postCompany}
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
          title="Company Name"
          value={company.company_name}
          onChange={(e) => setCompany({ ...company, company_name: e.target.value })}
          errorMessage={errors.company_name}
        />
        <ValidationInput
          title="Company Phone"
          value={company.company_phone}
          onChange={(e) => setCompany({ ...company, company_phone: e.target.value })}
          errorMessage={errors.company_phone}
        />
        <ValidationInput
          title="Company Address"
          value={company.address}
          onChange={(e) => setCompany({ ...company, address: e.target.value })}
          errorMessage={errors.address}
        />
      </form>
    </BasePopup>
  );
};

export { CompanyCreatePopup };

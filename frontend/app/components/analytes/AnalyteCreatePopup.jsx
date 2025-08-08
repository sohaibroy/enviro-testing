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

const AnalyteCreatePopup = ({ isOpen, onClose, title }) => {
  if (!isOpen) return null;

  const [analyte, setAnalyte] = useState({
    analyte_name: "",
    cas_number: "",
  });

  const [errors, setErrors] = useState({
    analyte_name: "",
    cas_number: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  const validateInput = () => {
    const newErrors = {};
    if (!analyte.analyte_name.trim()) newErrors.analyte_name = "Analyte Name is required";
    if (analyte.cas_number.trim() && !/^[\d-]+$/.test(analyte.cas_number.trim())) {
      newErrors.cas_number = "Invalid CAS Number format";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const postAnalyte = async () => {
    if (!validateInput()) return;

    if (isTokenExpired()) {
      window.location.href = "/admin-login";
      return;
    }

    try {
      // CSRF first
      await ensureCsrf();
      const xsrfToken = getCookie("XSRF-TOKEN");

      const res = await fetch(`${baseUrl}/api/analyte/create`, {
        method: "POST",
        credentials: "include", // send cookies
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": xsrfToken || "",
          Authorization: `Bearer ${sessionStorage.getItem("accessToken") || ""}`,
        },
        body: JSON.stringify({
          analyte_name: analyte.analyte_name,
          cas_number: analyte.cas_number,
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

      // Success feedback + close
      setSuccessMessage("Analyte created successfully!");
      setTimeout(() => {
        setSuccessMessage("");
        setAnalyte({ analyte_name: "", cas_number: "" });
        setErrors({ analyte_name: "", cas_number: "" });
        onClose?.();
      }, 1500);
    } catch {
      alert("Failed to create analyte. Please try again.");
    }
  };

  return (
    <BasePopup
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      onActivityClicked={postAnalyte}
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
          title="Analyte Name"
          value={analyte.analyte_name}
          className="md:w-full"
          onChange={(e) => setAnalyte({ ...analyte, analyte_name: e.target.value })}
          errorMessage={errors.analyte_name}
        />
        <ValidationInput
          title="CAS Number"
          value={analyte.cas_number}
          className="md:w-full"
          onChange={(e) => setAnalyte({ ...analyte, cas_number: e.target.value })}
          errorMessage={errors.cas_number}
        />
      </form>
    </BasePopup>
  );
};

export { AnalyteCreatePopup };
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

const AnalyteUpdatePopup = ({ analyte, isOpen, onClose, title }) => {
  if (!isOpen) return null;

  const [currentAnalyte, setUpdatedAnalyte] = useState({
    analyte_name: analyte.analyte_name || "",
    cas_number: analyte.cas_number || "",
    is_active: analyte.is_active !== null ? analyte.is_active : 1,
  });
  const [errors, setErrors] = useState({
    analyte_name: "", cas_number: "", is_active: "",
  });
  const [successMessage, setSuccessMessage] = useState("");

  const validateInput = () => {
    const e = {};
    if (!currentAnalyte.analyte_name.trim()) e.analyte_name = "Analyte Name is required";
    if (currentAnalyte.cas_number.trim() && !/^[\d-]+$/.test(currentAnalyte.cas_number.trim())) {
      e.cas_number = "Invalid CAS Number format";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const updateAnalyte = async () => {
    if (!validateInput()) return;
    if (isTokenExpired()) { window.location.href = "/admin-login"; return; }

    try {
      await ensureCsrf();
      const xsrf = getCookie("XSRF-TOKEN");

      const res = await fetch(`${baseUrl}/api/analyte/update/${analyte.analyte_id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": xsrf || "",
          Authorization: `Bearer ${sessionStorage.getItem("accessToken") || ""}`,
        },
        body: JSON.stringify({
          analyte_name: currentAnalyte.analyte_name,
          cas_number: currentAnalyte.cas_number,
          is_active: currentAnalyte.is_active,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      setSuccessMessage("Analyte updated successfully!");
      setTimeout(() => { setSuccessMessage(""); onClose?.(); }, 1500);
    } catch {
      alert("Failed to update analyte. Please try again.");
    }
  };

  const deleteAnalyte = async () => {
    if (!window.confirm("Are you sure you want to delete this analyte?")) return;
    if (isTokenExpired()) { window.location.href = "/admin-login"; return; }

    try {
      await ensureCsrf();
      const xsrf = getCookie("XSRF-TOKEN");

      const res = await fetch(`${baseUrl}/api/analyte/${analyte.analyte_id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "X-XSRF-TOKEN": xsrf || "",
          Authorization: `Bearer ${sessionStorage.getItem("accessToken") || ""}`,
        },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      setSuccessMessage("Analyte deleted successfully!");
      setTimeout(() => { setSuccessMessage(""); onClose?.(); }, 1500);
    } catch {
      alert("Failed to delete analyte. It may be in use or blocked by CSRF.");
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
          title="Analyte Name"
          value={currentAnalyte.analyte_name}
          className="md:w-full"
          onChange={(e) => setUpdatedAnalyte({ ...currentAnalyte, analyte_name: e.target.value })}
          errorMessage={errors.analyte_name}
        />
        <ValidationInput
          title="CAS Number"
          value={currentAnalyte.cas_number}
          className="md:w-full"
          onChange={(e) => setUpdatedAnalyte({ ...currentAnalyte, cas_number: e.target.value })}
          errorMessage={errors.cas_number}
        />
        <RadioBoolInput
          title="Status"
          value={currentAnalyte.is_active}
          errorMessage={errors.is_active}
          onChange={(v) => setUpdatedAnalyte({ ...currentAnalyte, is_active: v })}
        />
      </form>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={deleteAnalyte}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
        >
          Delete
        </button>
        <button
          type="button"
          onClick={updateAnalyte}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Update
        </button>
      </div>
    </BasePopup>
  );
};

export { AnalyteUpdatePopup };
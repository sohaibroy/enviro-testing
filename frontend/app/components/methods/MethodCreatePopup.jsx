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

const MethodCreatePopup = ({ isOpen, onClose, title, analyte }) => {
  if (!isOpen) return null;

  const [method, setMethod] = useState({
    method_name: "",
    matrix: "",
    media: "",
    measurement: "",
    sample_rate: "",
    limit_of_quantification: "",
    general_comments: "",
  });

  const [errors, setErrors] = useState({
    method_name: "",
    matrix: "",
    media: "",
    measurement: "",
    sample_rate: "",
    limit_of_quantification: "",
    general_comments: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  const validateInput = () => {
    const newErrors = {};
    if (!method.method_name.trim()) newErrors.method_name = "Method Name is required";
    if (!method.matrix.trim()) newErrors.matrix = "Matrix is required";
    if (!method.media.trim()) newErrors.media = "Media is required";
    if (!method.measurement.trim()) newErrors.measurement = "Measurement is required";
    if (!method.limit_of_quantification.trim())
      newErrors.limit_of_quantification = "Limit Of Quantification is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const postMethod = async () => {
    if (!validateInput()) return;

    if (isTokenExpired()) {
      window.location.href = "/admin-login";
      return;
    }

    try {
      await ensureCsrf();
      const xsrfToken = getCookie("XSRF-TOKEN");

      const res = await fetch(`${baseUrl}/api/method/create/${analyte.analyte_id}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": xsrfToken || "",
        },
        body: JSON.stringify({
          method_name: method.method_name,
          matrix: method.matrix,
          media: method.media,
          measurement: method.measurement,
          sample_rate: method.sample_rate,
          limit_of_quantification: method.limit_of_quantification,
          general_comments: method.general_comments,
          is_active: 1,
        }),
      });

      const text = await res.text();
      let payload = null;
      try {
        payload = text ? JSON.parse(text) : null;
      } catch {
        payload = text || null;
      }

      if (!res.ok) {
        alert((payload && payload.message) || `HTTP ${res.status}`);
        return;
      }

      //Show success
      setSuccessMessage("Method created successfully!");
      setTimeout(() => {
        setSuccessMessage("");
        //reset form
        setMethod({
          method_name: "",
          matrix: "",
          media: "",
          measurement: "",
          sample_rate: "",
          limit_of_quantification: "",
          general_comments: "",
        });
        setErrors({
          method_name: "",
          matrix: "",
          media: "",
          measurement: "",
          sample_rate: "",
          limit_of_quantification: "",
          general_comments: "",
        });
        onClose?.();
      }, 1500);
    } catch {
      alert("Failed to create method. Please try again.");
    }
  };

  return (
    <BasePopup
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      onActivityClicked={postMethod}
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
          title="Method Name"
          value={method.method_name}
          onChange={(e) => setMethod({ ...method, method_name: e.target.value })}
          errorMessage={errors.method_name}
        />
        <ValidationInput
          title="Matrix"
          value={method.matrix}
          onChange={(e) => setMethod({ ...method, matrix: e.target.value })}
          errorMessage={errors.matrix}
        />
        <ValidationInput
          title="Media"
          value={method.media}
          onChange={(e) => setMethod({ ...method, media: e.target.value })}
          errorMessage={errors.media}
        />
        <ValidationInput
          title="Measurement"
          value={method.measurement}
          onChange={(e) => setMethod({ ...method, measurement: e.target.value })}
          errorMessage={errors.measurement}
        />
        <ValidationInput
          title="Sample Rate"
          value={method.sample_rate}
          onChange={(e) => setMethod({ ...method, sample_rate: e.target.value })}
          errorMessage={errors.sample_rate}
        />
        <ValidationInput
          title="Limit of Quantification"
          value={method.limit_of_quantification}
          onChange={(e) =>
            setMethod({ ...method, limit_of_quantification: e.target.value })
          }
          errorMessage={errors.limit_of_quantification}
        />
        <ValidationInput
          title="Comments"
          value={method.general_comments}
          onChange={(e) => setMethod({ ...method, general_comments: e.target.value })}
          errorMessage={errors.general_comments}
        />
      </form>
    </BasePopup>
  );
};

export { MethodCreatePopup };

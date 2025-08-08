"use client";

import React, { useEffect, useState } from "react";
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

const MethodUpdatePopup = ({ method, isOpen, onClose, title, onDelete }) => {
  if (!isOpen) return null;

  const [currentMethod, setMethod] = useState({
    method_name: method.method_name || "",
    matrix: method.matrix || "",
    media: method.media || "",
    measurement: method.measurement || "",
    sample_rate: method.sample_rate || "",
    limit_of_quantification: method.limit_of_quantification || "",
    general_comments: method.general_comments || "",
    is_active: method.is_active !== null ? method.is_active : 1,
  });

  const [errors, setErrors] = useState({
    method_name: "",
    matrix: "",
    media: "",
    measurement: "",
    sample_rate: "",
    limit_of_quantification: "",
    general_comments: "",
    is_active: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    setMethod({
      method_name: method.method_name || "",
      matrix: method.matrix || "",
      media: method.media || "",
      measurement: method.measurement || "",
      sample_rate: method.sample_rate || "",
      limit_of_quantification: method.limit_of_quantification || "",
      general_comments: method.general_comments || "",
      is_active: method.is_active !== null ? method.is_active : 1,
    });
    setErrors({});
    setSuccessMessage("");
  }, [method]);

  const validateInput = () => {
    const newErrors = {};
    if (!currentMethod.method_name.trim()) newErrors.method_name = "Method Name is required";
    if (!currentMethod.matrix.trim()) newErrors.matrix = "Matrix is required";
    if (!currentMethod.media.trim()) newErrors.media = "Media is required";
    if (!currentMethod.measurement.trim()) newErrors.measurement = "Measurement is required";
    if (!currentMethod.limit_of_quantification.trim())
      newErrors.limit_of_quantification = "Limit Of Quantification is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateMethod = async () => {
  if (!validateInput()) return;

  if (isTokenExpired()) {
    window.location.href = "/admin-login";
    return;
  }

  try {
    await ensureCsrf();
    const xsrfToken = getCookie("XSRF-TOKEN");

    const url = `${baseUrl}/api/method/update/${method.method_id}`;

    const res = await fetch(url, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-XSRF-TOKEN": xsrfToken || "",
        Authorization: `Bearer ${sessionStorage.getItem("accessToken") || ""}`,
      },
      body: JSON.stringify({
        method_name_param: currentMethod.method_name,
        matrix_param: currentMethod.matrix,
        media_param: currentMethod.media,
        measurement_param: currentMethod.measurement,
        sample_rate_param: currentMethod.sample_rate,
        limit_of_quantification_param: currentMethod.limit_of_quantification,
        general_comments_param: currentMethod.general_comments,
        is_active_param: currentMethod.is_active,
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
      alert(
        (payload && payload.message) ||
          `Failed to update method. Server responded with ${res.status}`
      );
      return;
    }

    // Show success, then close popup after 1.5s
    setSuccessMessage("Method updated successfully!");
    setTimeout(() => {
      setSuccessMessage("");
      onClose?.();
    }, 1500);

  } catch {
    alert("Failed to update method. Please try again.");
  }
};

const deleteMethod = async () => {
  if (!window.confirm("Are you sure you want to delete this method?")) {
    return;
  }

  if (isTokenExpired()) {
    window.location.href = "/admin-login";
    return;
  }

  try {
    await ensureCsrf();
    const xsrfToken = getCookie("XSRF-TOKEN");

    const url = `${baseUrl}/api/method/${method.method_id}`;

    const res = await fetch(url, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "X-XSRF-TOKEN": xsrfToken || "",
        Authorization: `Bearer ${sessionStorage.getItem("accessToken") || ""}`,
      },
    });

    const text = await res.text();
    let payload = null;
    try {
      payload = text ? JSON.parse(text) : null;
    } catch {
      payload = text || null;
    }

    if (!res.ok) {
      alert(
        (payload && payload.message) ||
          `Failed to delete method. Server responded with ${res.status}`
      );
      return;
    }

    // Show success, then close popup after 1.5s
    setSuccessMessage("Method deleted successfully!");
    setTimeout(() => {
      setSuccessMessage("");
      onDelete?.(method.method_id);
      onClose?.();
    }, 1500);

  } catch {
    alert(
      "Failed to delete method. It may be in use or there was a server error. Check laravel.log."
    );
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
          title="Method Name"
          value={currentMethod.method_name}
          onChange={(e) => setMethod({ ...currentMethod, method_name: e.target.value })}
          errorMessage={errors.method_name}
        />
        <ValidationInput
          title="Matrix"
          value={currentMethod.matrix}
          onChange={(e) => setMethod({ ...currentMethod, matrix: e.target.value })}
          errorMessage={errors.matrix}
        />
        <ValidationInput
          title="Media"
          value={currentMethod.media}
          onChange={(e) => setMethod({ ...currentMethod, media: e.target.value })}
          errorMessage={errors.media}
        />
        <ValidationInput
          title="Measurement"
          value={currentMethod.measurement}
          onChange={(e) => setMethod({ ...currentMethod, measurement: e.target.value })}
          errorMessage={errors.measurement}
        />
        <ValidationInput
          title="Sample Rate"
          value={currentMethod.sample_rate}
          onChange={(e) => setMethod({ ...currentMethod, sample_rate: e.target.value })}
          errorMessage={errors.sample_rate}
        />
        <ValidationInput
          title="Limit of Quantification"
          value={currentMethod.limit_of_quantification}
          onChange={(e) =>
            setMethod({ ...currentMethod, limit_of_quantification: e.target.value })
          }
          errorMessage={errors.limit_of_quantification}
        />
        <ValidationInput
          title="Comments"
          value={currentMethod.general_comments}
          onChange={(e) => setMethod({ ...currentMethod, general_comments: e.target.value })}
          errorMessage={errors.general_comments}
        />
        <RadioBoolInput
          title="Status"
          value={currentMethod.is_active}
          errorMessage={errors.is_active}
          onChange={(selectedValue) => {
            setMethod({ ...currentMethod, is_active: selectedValue });
          }}
        />
      </form>

      {/* Footer actions: Delete + Update side by side */}
      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={deleteMethod}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
        >
          Delete
        </button>
        <button
          type="button"
          onClick={updateMethod}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Update
        </button>
      </div>
    </BasePopup>
  );
};

export { MethodUpdatePopup };

import React, { useState } from "react";
import BasePopup from "../basic/BasePopup";
import { ValidationInput } from "../basic/ValidationInput";
import { isTokenExpired } from "@/utils/session";

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

  const validateInput = () => {
    const newErrors = {};

    if (!method.method_name.trim()) {
      newErrors.method_name = "Method Name is required";
    }

    if (!method.matrix.trim()) {
      newErrors.matrix = "Matrix is required";
    }

    if (!method.media.trim()) {
      newErrors.media = "Media is required";
    }

    if (!method.measurement.trim()) {
      newErrors.measurement = "Measurement is required";
    }

    if (!method.limit_of_quantification.trim()) {
      newErrors.limit_of_quantification = "Limit Of Quantification is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const postMethod = () => {
    if (validateInput()) {
      if (isTokenExpired()) {
        window.location.href = "/admin-login";
        return;
      }

      fetch(`http://localhost:80/api/method/create/${analyte.analyte_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          method_name: method.method_name,
          matrix: method.matrix,
          media: method.media,
          measurement: method.measurement,
          sample_rate: method.sample_rate,
          limit_of_quantification: method.limit_of_quantification,
          general_comments: method.general_comments,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Success:", data);
          onClose();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
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
      <form className="flex flex-wrap justify-between gap-y-4">
        <ValidationInput
          title="Method Name"
          value={method.method_name}
          onChange={(e) =>
            setMethod({ ...method, method_name: e.target.value })
          }
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
          onChange={(e) =>
            setMethod({ ...method, measurement: e.target.value })
          }
          errorMessage={errors.measurement}
        />
        <ValidationInput
          title="Sample Rate"
          value={method.sample_rate}
          onChange={(e) =>
            setMethod({ ...method, sample_rate: e.target.value })
          }
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
          onChange={(e) =>
            setMethod({ ...method, general_comments: e.target.value })
          }
          errorMessage={errors.general_comments}
        />
      </form>
    </BasePopup>
  );
};

export { MethodCreatePopup };

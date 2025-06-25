import React, { useState } from "react";
import BasePopup from "../basic/BasePopup";
import { ValidationInput } from "../basic/ValidationInput";
import { RadioBoolInput } from "../basic/RadioBoolInput";
import { isTokenExpired } from "@/utils/session";

const MethodUpdatePopup = ({ method, isOpen, onClose, title }) => {
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
  });

  const validateInput = () => {
    const newErrors = {};

    if (!currentMethod.method_name.trim()) {
      newErrors.method_name = "Method Name is required";
    }

    if (!currentMethod.matrix.trim()) {
      newErrors.matrix = "Matrix is required";
    }

    if (!currentMethod.media.trim()) {
      newErrors.media = "Media is required";
    }

    if (!currentMethod.measurement.trim()) {
      newErrors.measurement = "Measurement is required";
    }

    if (!currentMethod.limit_of_quantification.trim()) {
      newErrors.limit_of_quantification = "Limit Of Quantification is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const updateMethod = () => {
    if (validateInput()) {
      if (isTokenExpired()) {
        window.location.href = "/admin-login";
        return;
      }

      fetch(`http://localhost:80/api/method/update/${method.method_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
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
      activityText="Update"
      onActivityClicked={updateMethod}
    >
      <form className="flex flex-wrap justify-between gap-y-4">
        <ValidationInput
          title="Method Name"
          value={currentMethod.method_name}
          onChange={(e) =>
            setMethod({ ...currentMethod, method_name: e.target.value })
          }
          errorMessage={errors.method_name}
        />
        <ValidationInput
          title="Matrix"
          value={currentMethod.matrix}
          onChange={(e) =>
            setMethod({ ...currentMethod, matrix: e.target.value })
          }
          errorMessage={errors.matrix}
        />
        <ValidationInput
          title="Media"
          value={currentMethod.media}
          onChange={(e) =>
            setMethod({ ...currentMethod, media: e.target.value })
          }
          errorMessage={errors.media}
        />
        <ValidationInput
          title="Measurement"
          value={currentMethod.measurement}
          onChange={(e) =>
            setMethod({ ...currentMethod, measurement: e.target.value })
          }
          errorMessage={errors.measurement}
        />
        <ValidationInput
          title="Sample Rate"
          value={currentMethod.sample_rate}
          onChange={(e) =>
            setMethod({ ...currentMethod, sample_rate: e.target.value })
          }
          errorMessage={errors.sample_rate}
        />
        <ValidationInput
          title="Limit of Quanitification"
          value={currentMethod.limit_of_quantification}
          onChange={(e) =>
            setMethod({
              ...currentMethod,
              limit_of_quantification: e.target.value,
            })
          }
          errorMessage={errors.limit_of_quantification}
        />
        <ValidationInput
          title="Comments"
          value={currentMethod.general_comments}
          onChange={(e) =>
            setMethod({
              ...currentMethod,
              general_comments: e.target.value,
            })
          }
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
    </BasePopup>
  );
};

export { MethodUpdatePopup };

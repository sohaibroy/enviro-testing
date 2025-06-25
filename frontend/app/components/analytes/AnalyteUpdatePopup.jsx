import React, { useState } from "react";
import BasePopup from "../basic/BasePopup";
import { ValidationInput } from "../basic/ValidationInput";
import { RadioBoolInput } from "../basic/RadioBoolInput";
import { isTokenExpired } from "@/utils/session";

//ADMIN BOARD: Edit: Update Analyte pop up

const AnalyteUpdatePopup = ({ analyte, isOpen, onClose, title }) => {
  if (!isOpen) return null;

  const [currentAnalyte, setUpdatedAnalyte] = useState({
    analyte_name: analyte.analyte_name || "",
    cas_number: analyte.cas_number || "",
    is_active: analyte.is_active !== null ? analyte.is_active : 1,
  });

  const [errors, setErrors] = useState({
    analyte_name: "",
    cas_number: "",
    is_active: "",
  });

  const validateInput = () => {
    const newErrors = {};

    if (!currentAnalyte.analyte_name.trim()) {
      newErrors.analyte_name = "Analyte Name is required:";
    }

    if (
      currentAnalyte.cas_number.trim() &&
      !/^[\d-]+$/.test(currentAnalyte.cas_number.trim())
    ) {
      newErrors.cas_number = "Invalid CAS Number format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateAnalyte = () => {
    if (validateInput()) {
      if (isTokenExpired()) {
        window.location.href = "/admin-login";
        return;
      }

      fetch(`http://localhost:80/api/analyte/update/${analyte.analyte_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          analyte_name: currentAnalyte.analyte_name,
          cas_number: currentAnalyte.cas_number,
          is_active: currentAnalyte.is_active,
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
      onActivityClicked={updateAnalyte}
    >
      <form className="flex flex-wrap justify-between gap-y-4">
        <ValidationInput
          title="Analyte Name"
          value={currentAnalyte.analyte_name}
          className="md:w-full"
          onChange={(e) =>
            setUpdatedAnalyte({
              ...currentAnalyte,
              analyte_name: e.target.value,
            })
          }
          errorMessage={errors.analyte_name}
        />
        <ValidationInput
          title="CAS Number"
          value={currentAnalyte.cas_number}
          className="md:w-full"
          onChange={(e) =>
            setUpdatedAnalyte({
              ...currentAnalyte,
              cas_number: e.target.value,
            })
          }
          errorMessage={errors.cas_number}
        />
        <RadioBoolInput
          title="Status"
          value={currentAnalyte.is_active}
          errorMessage={errors.is_active}
          onChange={(selectedValue) => {
            setUpdatedAnalyte({ ...currentAnalyte, is_active: selectedValue });
          }}
        />
      </form>
    </BasePopup>
  );
};

export { AnalyteUpdatePopup };

import React, { useState } from "react";
import BasePopup from "../basic/BasePopup";
import { ValidationInput } from "../basic/ValidationInput";
import { isTokenExpired } from "@/utils/session";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

//Admin section: analyte creation *popup* 

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

  const validateInput = () => {
    const newErrors = {};

    if (!analyte.analyte_name.trim()) {
      newErrors.analyte_name = "Analyte Name is required";
    }

    if (
      analyte.cas_number.trim() &&
      !/^[\d-]+$/.test(analyte.cas_number.trim())
    ) {
      newErrors.cas_number = "Invalid CAS Number format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const postAnalyte = () => {
    if (validateInput()) {
      if (isTokenExpired()) {
        window.location.href = "/admin-login";
        return;
      }

      //fetch("http://localhost:80/api/analyte/create", {
      fetch(`${baseUrl}/api/analyte/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          analyte_name: analyte.analyte_name,
          cas_number: analyte.cas_number,
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

  // create button is not wired/functional yet
  return (
    <BasePopup
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      onActivityClicked={postAnalyte}
      activityText="Create"
    >
      <form className="flex flex-wrap justify-between gap-y-4">
        <ValidationInput
          title="Analyte Name"
          value={analyte.analyte_name}
          className="md:w-full"
          onChange={(e) =>
            setAnalyte({ ...analyte, analyte_name: e.target.value })
          }
          errorMessage={errors.analyte_name}
        />
        <ValidationInput
          title="CAS Number"
          value={analyte.cas_number}
          className="md:w-full"
          onChange={(e) =>
            setAnalyte({ ...analyte, cas_number: e.target.value })
          }
          errorMessage={errors.cas_number}
        />
      </form>
    </BasePopup>
  );
};

export { AnalyteCreatePopup };

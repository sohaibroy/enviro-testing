import React, { useState } from "react";
import BasePopup from "../basic/BasePopup";
import { ValidationInput } from "../basic/ValidationInput";
import { RadioBoolInput } from "../basic/RadioBoolInput";
import { isTokenExpired } from "@/utils/session";

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

  const validateInput = () => {
    const newErrors = {};

    if (!currentCompany.company_name.trim()) {
      newErrors.company_name = "Company Name is required";
    }

    if (!currentCompany.company_phone.trim()) {
      newErrors.company_phone = "Company Phone Number is required";
    }

    if (!currentCompany.address.trim()) {
      newErrors.address = "Company Address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateCompany = () => {
    if (validateInput()) {
      if (isTokenExpired()) {
        window.location.href = "/admin-login";
        return;
      }

      fetch(`http://localhost:80/api/company/update/${company.company_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          company_name: currentCompany.company_name,
          company_phone: currentCompany.company_phone,
          address: currentCompany.address,
          is_active: currentCompany.is_active,
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
      onActivityClicked={updateCompany}
    >
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
    </BasePopup>
  );
};

export { CompanyUpdatePopup };

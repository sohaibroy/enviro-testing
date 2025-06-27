import React, { useState } from "react";
import BasePopup from "../basic/BasePopup";
import { ValidationInput } from "../basic/ValidationInput";
import { RadioBoolInput } from "../basic/RadioBoolInput";
import { isTokenExpired } from "@/utils/session";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

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

  const validateInput = () => {
    const newErrors = {};

    if (!company.company_name.trim()) {
      newErrors.company_name = "Company Name is required";
    }

    if (!company.company_phone.trim()) {
      newErrors.company_phone = "Company Phone Number is required";
    }

    if (!company.address.trim()) {
      newErrors.address = "Company Address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const postCompany = () => {
    if (validateInput()) {
      if (isTokenExpired()) {
        window.location.href = "/admin-login";
        return;
      }

      //fetch("http://localhost:80/api/company/create", {
      fetch(`${baseUrl}/api/company/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          company_name: company.company_name,
          company_phone: company.company_phone,
          address: company.address,
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
      onActivityClicked={postCompany}
      activityText="Create"
    >
      <form className="flex flex-wrap justify-between gap-y-4">
        <ValidationInput
          title="Company Name"
          value={company.company_name}
          onChange={(e) =>
            setCompany({ ...company, company_name: e.target.value })
          }
          errorMessage={errors.company_name}
        />
        <ValidationInput
          title="Company Phone"
          value={company.company_phone}
          onChange={(e) =>
            setCompany({ ...company, company_phone: e.target.value })
          }
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

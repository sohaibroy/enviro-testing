import React, { useState } from "react";
import BasePopup from "../basic/BasePopup";
import { ValidationInput } from "../basic/ValidationInput";
import { isTokenExpired } from "@/utils/session";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const AccountCreatePopup = ({ isOpen, onClose, title, company }) => {
  if (!isOpen) return null;

  const [account, setAccount] = useState({
    first_name: "",
    last_name: "",
    password: "",
    email: "",
    phone_number: "",
  });

  const [errors, setErrors] = useState({
    first_name: "",
    last_name: "",
    password: "",
    email: "",
    phone_number: "",
  });

  const validateInput = () => {
    const newErrors = {};

    if (!account.first_name.trim()) {
      newErrors.first_name = "First Name is required";
    }

    if (!account.last_name.trim()) {
      newErrors.last_name = "Last Name is required";
    }

    if (!account.password.trim()) {
      newErrors.password = "Password is required";
    } else if (account.password.length < 6) {
      newErrors.password = "Password cannot be less than 6 characters";
    }

    if (!account.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(account.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!account.phone_number.trim()) {
      newErrors.phone_number = "Phone Number is required";
    } else if (account.phone_number.length > 20) {
      newErrors.phone_number =
        "Phone Number cannot be greater than 20 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const postAccount = () => {
    if (validateInput()) {
      if (isTokenExpired()) {
        window.location.href = "/admin-login";
        return;
      }

      //fetch(`http://localhost:80/api/account/create`, {
      fetch(`${baseUrl}/api/account/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          company_id: company.company_id,
          first_name: account.first_name,
          last_name: account.last_name,
          password: account.password,
          email: account.email,
          phone_number: account.phone_number,
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
      onActivityClicked={postAccount}
      activityText="Create"
    >
      <form className="flex flex-wrap justify-between gap-y-4">
        <ValidationInput
          title="First Name"
          value={account.first_name}
          onChange={(e) =>
            setAccount({ ...account, first_name: e.target.value })
          }
          errorMessage={errors.first_name}
        />
        <ValidationInput
          title="Last Name"
          value={account.last_name}
          onChange={(e) =>
            setAccount({ ...account, last_name: e.target.value })
          }
          errorMessage={errors.last_name}
        />
        <ValidationInput
          title="Email"
          value={account.email}
          onChange={(e) => setAccount({ ...account, email: e.target.value })}
          errorMessage={errors.email}
        />
        <ValidationInput
          title="Phone Number"
          value={account.phone_number}
          onChange={(e) =>
            setAccount({ ...account, phone_number: e.target.value })
          }
          errorMessage={errors.phone_number}
        />
        <ValidationInput
          title="Account Password"
          type="password"
          value={account.password}
          onChange={(e) => setAccount({ ...account, password: e.target.value })}
          errorMessage={errors.password}
        />
      </form>
    </BasePopup>
  );
};

export { AccountCreatePopup };

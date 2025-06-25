import React, { useState } from "react";
import BasePopup from "../basic/BasePopup";
import { ValidationInput } from "../basic/ValidationInput";
import { RadioBoolInput } from "../basic/RadioBoolInput";
import { isTokenExpired } from "@/utils/session";

const AccountUpdatePopup = ({ account, company, isOpen, onClose, title }) => {
  if (!isOpen) return null;

  const [currentAccount, setAccount] = useState({
    first_name: account.first_name || "",
    last_name: account.last_name || "",
    password: account.password || "",
    email: account.email || "",
    phone_number: account.phone_number || "",
    is_active: account.is_active !== null ? account.is_active : 1,
  });

  const [errors, setErrors] = useState({
    first_name: "",
    last_name: "",
    password: "",
    email: "",
    phone_number: "",
    is_active: "",
  });

  const validateInput = () => {
    const newErrors = {};

    if (!currentAccount.first_name.trim()) {
      newErrors.first_name = "First Name is required";
    }

    if (!currentAccount.last_name.trim()) {
      newErrors.last_name = "Last Name is required";
    }

    if (currentAccount.password !== "" && currentAccount.password.length < 6) {
      newErrors.password = "Password cannot be less than 6 characters";
    }

    if (!currentAccount.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(account.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!currentAccount.phone_number.trim()) {
      newErrors.phone_number = "Phone Number is required";
    } else if (currentAccount.phone_number.length > 20) {
      newErrors.phone_number =
        "Phone Number cannot be greater than 20 characters";
    }

    if (!company.is_active && currentAccount.is_active) {
      newErrors.is_active = "Account cannot be active on an inactive company";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateAccount = () => {
    if (validateInput()) {
      if (isTokenExpired()) {
        window.location.href = "/admin-login";
        return;
      }

      let content = {
        company_id: currentAccount.company_id,
        first_name: currentAccount.first_name,
        last_name: currentAccount.last_name,
        email: currentAccount.email,
        phone_number: currentAccount.phone_number,
        is_active: currentAccount.is_active,
      };

      content =
        currentAccount.password === ""
          ? content
          : (content = { ...content, password: currentAccount.password });

      console.log(content);

      fetch(`http://localhost:80/api/account/update/${account.account_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(content),
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
      onActivityClicked={updateAccount}
    >
      <form className="flex flex-wrap justify-between gap-y-4">
        <ValidationInput
          title="First Name"
          value={currentAccount.first_name}
          onChange={(e) =>
            setAccount({ ...currentAccount, first_name: e.target.value })
          }
          errorMessage={errors.first_name}
        />
        <ValidationInput
          title="Last Name"
          value={currentAccount.last_name}
          onChange={(e) =>
            setAccount({ ...currentAccount, last_name: e.target.value })
          }
          errorMessage={errors.last_name}
        />
        <ValidationInput
          title="Email"
          value={currentAccount.email}
          onChange={(e) =>
            setAccount({ ...currentAccount, email: e.target.value })
          }
          errorMessage={errors.email}
        />
        <ValidationInput
          title="Phone Number"
          value={currentAccount.phone_number}
          onChange={(e) =>
            setAccount({ ...currentAccount, phone_number: e.target.value })
          }
          errorMessage={errors.phone_number}
        />
        <ValidationInput
          title="Account Password"
          type="password"
          value={currentAccount.password}
          onChange={(e) =>
            setAccount({ ...currentAccount, password: e.target.value })
          }
          errorMessage={errors.password}
        />
        <RadioBoolInput
          title="Status"
          value={currentAccount.is_active}
          errorMessage={errors.is_active}
          onChange={(selectedValue) => {
            setAccount({ ...currentAccount, is_active: selectedValue });
          }}
        />
      </form>
    </BasePopup>
  );
};

export { AccountUpdatePopup };

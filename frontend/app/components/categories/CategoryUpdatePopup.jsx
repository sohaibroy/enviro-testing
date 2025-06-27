import React, { useState } from "react";
import BasePopup from "../basic/BasePopup";
import { ValidationInput } from "../basic/ValidationInput";
import { RadioBoolInput } from "../basic/RadioBoolInput";
import { isTokenExpired } from "@/utils/session";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const CategoryUpdatePopup = ({ category, isOpen, onClose, title }) => {
  if (!isOpen) return null;

  const [currentCategory, setCategory] = useState({
    category_name: category.category_name || "",
    technique: category.technique || "",
    is_active: category.is_active !== null ? category.is_active : 1,
  });

  const [errors, setErrors] = useState({
    category_name: "",
    technique: "",
  });

  const validateInput = () => {
    const newErrors = {};

    if (!category.category_name.trim()) {
      newErrors.category_name = "Category Name is required";
    }

    if (!category.technique.trim()) {
      newErrors.technique = "Technique is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateCategory = () => {
    if (validateInput()) {
      if (isTokenExpired()) {
        window.location.href = "/admin-login";
        return;
      }

      //fetch(`http://localhost:80/api/category/update/${category.category_id}`, {
      fetch(`${baseUrl}/api/category/update/${category.category_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          category_name: currentCategory.category_name,
          technique: currentCategory.technique,
          is_active: currentCategory.is_active,
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
      onActivityClicked={updateCategory}
    >
      <form className="flex flex-wrap justify-between gap-y-4">
        <ValidationInput
          title="Category Name"
          value={currentCategory.category_name}
          onChange={(e) =>
            setCategory({ ...currentCategory, category_name: e.target.value })
          }
          errorMessage={errors.category_name}
        />
        <ValidationInput
          title="Technique"
          value={currentCategory.technique}
          onChange={(e) =>
            setCategory({ ...currentCategory, technique: e.target.value })
          }
          errorMessage={errors.technique}
        />
        <RadioBoolInput
          title="Status"
          value={currentCategory.is_active}
          errorMessage={errors.is_active}
          onChange={(selectedValue) => {
            setCategory({ ...currentCategory, is_active: selectedValue });
          }}
        />
      </form>
    </BasePopup>
  );
};

export { CategoryUpdatePopup };

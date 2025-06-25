import React, { useState } from "react";
import BasePopup from "../basic/BasePopup";
import { ValidationInput } from "../basic/ValidationInput";
import { isTokenExpired } from "@/utils/session";

const CategoryCreatePopup = ({ isOpen, onClose, title, analyte }) => {
  if (!isOpen) return null;

  const [category, setCategory] = useState({
    category_name: "",
    technique: "",
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

  const postCategory = () => {
    if (validateInput()) {
      if (isTokenExpired()) {
        window.location.href = "/admin-login";
        return;
      }

      fetch(`http://localhost:80/api/category/create/${analyte.analyte_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          category_name: category.category_name,
          technique: category.technique,
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
      onActivityClicked={postCategory}
      activityText="Create"
    >
      <form className="flex flex-wrap justify-between gap-y-4">
        <ValidationInput
          title="Category Name"
          value={category.category_name}
          className="md:w-full"
          onChange={(e) =>
            setCategory({ ...category, category_name: e.target.value })
          }
          errorMessage={errors.category_name}
        />
        <ValidationInput
          title="Technique"
          value={category.technique}
          className="md:w-full"
          onChange={(e) =>
            setCategory({ ...category, technique: e.target.value })
          }
          errorMessage={errors.technique}
        />
      </form>
    </BasePopup>
  );
};

export { CategoryCreatePopup };

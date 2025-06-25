import React, { useState, useEffect } from "react";
import { BaseListItem } from "../basic/BaseListItem";
import { CategoryUpdatePopup } from "./CategoryUpdatePopup";
import { SynonymsManagementPopup } from "./SynonymsManagmentPopup";

function CategoryCRUDListItem({ category, analyte, fetchCategories }) {
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isManageSynonymsOpen, setIsManageSynonymsOpen] = useState(false);

  const handleUpdateOpen = () => setIsUpdateOpen(true);
  const handleUpdateClose = () => {
    fetchCategories();
    setIsUpdateOpen(false);
  };

  const handleManageSynonymsOpen = () => setIsManageSynonymsOpen(true);
  const handleManageSynonymsClose = () => {
    fetchCategories();
    setIsManageSynonymsOpen(false);
  };

  return (
    <BaseListItem>
      <div className="flex flex-wrap w-full">
        <p
          className={`text-xl font-bold mb-2 w-full md:w-full ${
            category.is_active ? "text-green-500" : "text-red-500"
          }`}
        >
          {category.is_active ? "Active" : "Inactive"}
        </p>

        <p className="text-xl font-semibold mb-2 w-full md:w-1/2">
          <span className="font-normal mr-[.25rem]">Category Name:</span>
          {category.category_name}
        </p>

        <div className="w-full h-[.125rem] bg-gray-200 my-[1rem]" />

        <p className="text-xl font-semibold mb-2 w-full md:w-1/2">
          <span className="font-normal mr-[.25rem]">Technique:</span>
          {category.technique}
        </p>
      </div>
      <div className="flex items-center justify-evenly flex-wrap gap-1 ml-[1rem]">
        <button
          className="bg-[#003883] w-full flex justify-center p-2 rounded-md text-white shadow-2xl font-bold transition-all hover:scale-[101%]"
          onClick={handleUpdateOpen}
        >
          Edit
        </button>
        <button
          className="bg-[#003883] w-full flex justify-center p-2 rounded-md text-white shadow-2xl font-bold transition-all hover:scale-[101%]"
          onClick={handleManageSynonymsOpen}
        >
          Synonyms
        </button>
      </div>
      <CategoryUpdatePopup
        category={category}
        title={`Update Category For ${analyte.analyte_name}`}
        isOpen={isUpdateOpen}
        onClose={handleUpdateClose}
      />
      <SynonymsManagementPopup
        category={category}
        title={`Manage Synonyms For ${category.category_name}`}
        isOpen={isManageSynonymsOpen}
        onClose={handleManageSynonymsClose}
      />
    </BaseListItem>
  );
}

export { CategoryCRUDListItem };

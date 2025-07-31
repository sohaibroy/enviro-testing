"use client";

import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import EquipmentCategories from "../components/equipment-rental/EquipmentCategories";
import EquipmentRentalList from "../components/equipment-rental/EquipmentList";
import { ErrorMessage } from "../components/basic/ErrorMessage";
import Search from "../components/search/Search";

export default function Step7({ onNext, onBack }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useFormContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("Contains");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [equipmentTypes, setEquipmentTypes] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [errorTypes, setErrorTypes] = useState(null);

  const [refreshFlag, setRefreshFlag] = useState(Date.now()); // ✅ Force refresh

  // 🧼 Clear stale sessionStorage and trigger refresh on mount
  useEffect(() => {
    sessionStorage.removeItem("equipmentList");
    sessionStorage.removeItem("selectedEquipment");
    setRefreshFlag(Date.now());
  }, []);

  const handleEquipmentSelection = (selectedList) => {
    setValue("equipment", selectedList);
  };

  useEffect(() => {
    const fetchTypes = async () => {
      const accessToken = sessionStorage.getItem("accessToken");
      const headers = {};

      if (accessToken && accessToken !== "undefined" && accessToken !== "null") {
        headers.Authorization = `Bearer ${accessToken}`;
      }

      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${baseUrl}/api/equipment-types`, {
          headers,
        });
        if (!response.ok) throw new Error("Failed to fetch equipment types");
        const data = await response.json();
        setEquipmentTypes(data);
      } catch (err) {
        console.error(err);
        setErrorTypes("Failed to load categories.");
      } finally {
        setLoadingTypes(false);
      }
    };

    fetchTypes();
  }, []);

  const handleSelectCategory = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  return (
    <div
      className="w-full max-w-7xl bg-white shadow-xl p-4 sm:p-6 md:p-8 lg:p-10 rounded-xl space-y-6 flex flex-col"
      style={{
        minHeight: ["80vh", "80vh", "90vh"],
        overflowY: "auto",
      }}
    >
      <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-center text-gray-800">
        Step 7: Equipment Rental
      </h2>

      {/* Equipment Rental Section */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 md:gap-6 flex-1">
        {/* Sidebar - Categories  */}
        <div className="w-full lg:w-1/3 bg-white shadow-sm sm:shadow-md rounded-lg p-3 sm:p-4 border h-fit">
          <h3 className="text-base sm:text-lg md:text-lg font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4 border-b pb-1 sm:pb-2">
            Equipment Categories
          </h3>
          {loadingTypes ? (
            <p className="text-gray-500">Loading categories...</p>
          ) : errorTypes ? (
            <ErrorMessage message={errorTypes} />
          ) : (
            <EquipmentCategories
              onSelectCategory={handleSelectCategory}
              equipmentTypes={equipmentTypes}
            />
          )}
        </div>

        {/* Equipment List */}
        <div className="w-full lg:w-2/3 bg-white shadow-sm sm:shadow-md rounded-lg border p-3 sm:p-4 flex flex-col min-h-0">
          {/* Search bar */}
          <div className="pb-2 sm:pb-3 md:pb-4">
            <Search
              searchTerm={searchTerm}
              searchType={searchType}
              setSearchTerm={setSearchTerm}
              setSearchType={setSearchType}
              placeholder="Search for equipment..."
              onSearch={() => {}}
            />
          </div>

          <div className="flex-1 overflow-y-auto lg:overflow-y-auto overflow-y-visible">
            <div className="flex flex-col sm:flex-row flex-wrap gap-4">
              <EquipmentRentalList
                key={refreshFlag} // ✅ Forces remount when refreshed
                searchTerm={searchTerm}
                searchType={searchType}
                selectedCategory={selectedCategory}
                equipmentTypes={equipmentTypes}
                onSelectEquipment={handleEquipmentSelection}
                defaultSelectedEquipment={
                  sessionStorage.getItem("selectedEquipment")
                    ? JSON.parse(sessionStorage.getItem("selectedEquipment"))
                    : null
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* --- Navigation Buttons --- */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 pb-2 pt-4 sm:pt-5 md:pt-6">
        <button
          type="button"
          onClick={onBack}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 text-sm sm:text-base md:text-lg px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 rounded-lg transition-all"
        >
          Back
        </button>

        <button
          type="button"
          onClick={onNext}
          className="bg-orange-400 hover:bg-orange-600 text-white text-sm sm:text-base md:text-lg px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 rounded-lg transition-all"
        >
          Skip
        </button>

        <button
          type="button"
          onClick={handleSubmit(onNext)}
          className="bg-enviro_blue hover:bg-blue-700 text-white text-sm sm:text-base md:text-lg px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 rounded-lg transition-all"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
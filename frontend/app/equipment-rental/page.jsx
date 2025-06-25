"use client";

import React, { useEffect, useState } from "react";
import EquipmentRentalList from "../components/equipment-rental/EquipmentList";
import { LoadingIcon } from "../components/loading/LoadingIcon";
import { ErrorMessage } from "../components/basic/ErrorMessage";
import Search from "../components/search/Search";
import EquipmentCategories from "../components/equipment-rental/EquipmentCategories";
import FloatingCart from "../components/equipment-rental/FloatingCart";

//Equipment rental page
// This will eventually be part of the chain of custody page

export default function EquipmentRentalPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("Contains");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [equipmentTypes, setEquipmentTypes] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [errorTypes, setErrorTypes] = useState(null);

  // Fetch equipment types
  useEffect(() => {
    const fetchTypes = async () => {
      const accessToken = sessionStorage.getItem("accessToken");

      const headers = accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {};

      try {
        const response = await fetch("http://localhost/api/equipment-types", {
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

  // Handle category selection
  const handleSelectCategory = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 flex gap-6 relative">
      {/* Sidebar */}
      <div className="w-1/4 bg-white shadow-lg rounded-md p-4 border">
        <h2 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">
          Equipment Categories
        </h2>
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

      {/* List section */}
      <div className="w-3/4">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">
          Equipment Rentals
        </h1>

        {/* Search bar */}
        <div className="mb-4 flex justify-center">
          <Search
            searchTerm={searchTerm}
            searchType={searchType}
            setSearchTerm={setSearchTerm}
            setSearchType={setSearchType}
            placeholder="Search for equipment..."
            onSearch={() => { }}
          />
        </div>
        {/* Equipment List */}
        <EquipmentRentalList
          searchTerm={searchTerm}
          searchType={searchType}
          selectedCategory={selectedCategory}
          equipmentTypes={equipmentTypes}
        />
      </div>

      {/* Floating cart */}
      <div className="hidden lg:block">
        <FloatingCart />
      </div>
    </div>
  );
}

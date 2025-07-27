"use client";

import React, { useState, useEffect } from "react";
import { Search } from "./Search"; // Your original Search input component

export default function AnalyteSearchTool({ onResults }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("Contains");

  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [placeholderVisible, setPlaceholderVisible] = useState(true);

  const searchPlaceholders = [
    "Analyte",
    "CAS Number",
    "Category",
    "Method",
    "Synonyms",
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      const nextIndex = (currentPlaceholderIndex + 1) % searchPlaceholders.length;
      setCurrentPlaceholderIndex(nextIndex);
      setPlaceholderVisible(false);
      setTimeout(() => setPlaceholderVisible(true), 100);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [currentPlaceholderIndex]);

  const fetchAnalytes = async () => {
    const endpoint = searchTerm.trim() === ""
      ? "http://localhost:80/api/analytes/active"
      : "http://localhost:80/api/analyte/searchtool";

    try {
      const response = searchTerm.trim() === ""
        ? await fetch(endpoint)
        : await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              searchValue: searchTerm,
              searchType,
            }),
          });

      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();

      
      onResults(data, { searchTerm, searchType });
    } catch (err) {
      console.error("Error fetching analytes:", err);
      onResults(null, null, err.message);
    }
  };

  return (
    <Search
      onSearch={fetchAnalytes}
      searchTerm={searchTerm}
      searchType={searchType}
      setSearchTerm={setSearchTerm}
      setSearchType={setSearchType}
      placeholder={`Search by ${searchPlaceholders[currentPlaceholderIndex]}`}
    />
  );
}
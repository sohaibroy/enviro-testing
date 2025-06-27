"use client";

import React, { useState, useEffect } from "react";
import { Search } from "./components/search/Search";
import { AnalytesTable } from "./components/analytes/AnalytesTable";
import { LoadingIcon } from "./components/loading/LoadingIcon";
import { ErrorMessage } from "./components/basic/ErrorMessage";
import FadeIn from "./components/basic/FadeIn";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;


export default function Home({ children }) {
  const [analyteData, setAnalytes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("Contains");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchObj, setSearchObj] = useState("");

  // these are for the search bar placeholder
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [placeholderVisible, setPlaceholderVisible] = useState(true);

  let searchPlaceholder = [
    "Analyte",
    "CAS Number",
    "Category",
    "Method",
    "Synonyms",
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      const nextIndex =
        (currentPlaceholderIndex + 1) % searchPlaceholder.length;
      setCurrentPlaceholderIndex(nextIndex);
      setPlaceholderVisible(false);
      setTimeout(() => setPlaceholderVisible(true), 100);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [currentPlaceholderIndex]);

  const fetchAnalytes = async () => {
    setLoading(true);

    const flag = !searchTerm;

    //const endpoint = flag
      //? "http://localhost:80/api/analytes/active"
      //: "http://localhost:80/api/analyte/searchtool";

    const endpoint = flag
        ? `${baseUrl}/api/analytes/active`
        : `${baseUrl}/api/analyte/searchtool`;

    if (!flag) {
      setSearchObj({ searchTerm, searchType });
    } else {
      setSearchObj("");
    }

    try {
      let response = flag
        ? await fetch(endpoint)
        : await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            searchValue: searchTerm,
            searchType: searchType,
          }),
        });

      if (!response.ok) {
        throw new Error(`Response failed: ${response.status}`);
      }
      const data = await response.json();
      setAnalytes(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytes();
  }, []);

  return (
    <div className="flex flex-col gap-4 my-[3rem] max-w-[70rem] lg:mx-auto mx-[2rem]">
      <FadeIn>
        <Search
          onSearch={fetchAnalytes}
          searchTerm={searchTerm}
          searchType={searchType}
          setSearchTerm={setSearchTerm}
          setSearchType={setSearchType}
          placeholder={`Search by ${searchPlaceholder[currentPlaceholderIndex]}`}
        />
      </FadeIn>
      {loading ? (
        <LoadingIcon />
      ) : error ? (
        <ErrorMessage error={error} />
      ) : (
        <FadeIn>
          <AnalytesTable queryCriteria={searchObj} analytes={analyteData} />
        </FadeIn>

      )}
    </div>
  );
}

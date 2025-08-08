"use client";

import React, { useState, useEffect, useRef } from "react";
import BasePopup from "../basic/BasePopup";
import { ValidationInput } from "../basic/ValidationInput";
import { SynonymListItem } from "./SynonymListItem";
import { LoadingIcon } from "../loading/LoadingIcon";
import { ErrorMessage } from "../basic/ErrorMessage";
import { GeneralMessage } from "../basic/GeneralMessage";
import { isTokenExpired } from "@/utils/session";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const getCookie = (name) => {
  const m = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return m ? decodeURIComponent(m[2]) : null;
};

const ensureCsrf = async () => {
  await fetch(`${baseUrl}/sanctum/csrf-cookie`, { credentials: "include" });
};

const SynonymsManagementPopup = ({ isOpen, onClose, title, category }) => {
  const [inputValue, setInputValue] = useState("");
  const [synonyms, setSynonyms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const listRef = useRef(null);

  const fetchSynonyms = async () => {
    try {
      if (isTokenExpired()) {
        window.location.href = "/admin-login";
        return;
      }

      const response = await fetch(`${baseUrl}/api/synonyms/${category.category_id}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch synonyms");

      const data = await response.json();
      setSynonyms(data);
      setLoading(false);
    } catch (err) {
      setError(err.message || "Failed to fetch synonyms");
      setLoading(false);
    }
  };

  const postSynonym = async () => {
    if (isTokenExpired()) {
      window.location.href = "/admin-login";
      return;
    }
    const value = inputValue.trim();
    if (!value) return;

    try {
      // If CSRF is still enforced, this prevents 419s; safe even if whitelisted
      await ensureCsrf();
      const xsrf = getCookie("XSRF-TOKEN");

      const response = await fetch(`${baseUrl}/api/synonym/create/${category.category_id}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": xsrf || "",
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ synonym: value }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      setInputValue("");
      setSuccessMessage("Synonym added!");
      setTimeout(() => setSuccessMessage(""), 1500);
      fetchSynonyms();
    } catch (err) {
      alert("Failed to add synonym. Please try again.");
    }
  };

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setError(null);
      setSuccessMessage("");
      fetchSynonyms();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!synonyms || !listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [synonyms]);

  if (!isOpen) return null;

  return (
    <BasePopup
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      activityButtonHidden={true}
      className="max-w-[30rem] max-h-[34rem]"
    >
      {successMessage && (
        <div
          className="w-full mb-3 p-2 text-green-800 bg-green-100 border border-green-300 rounded"
          role="status"
          aria-live="polite"
        >
          {successMessage}
        </div>
      )}

      <div className="flex justify-between items-end gap-[.5rem]">
        <ValidationInput
          title="Input Synonym"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="md:w-full"
        />
        <button
          className="bg-[#003883] p-2 shadow-2xl w-[6rem] font-bold text-center rounded-md transition-all hover:scale-[101%] text-white"
          onClick={postSynonym}
        >
          Add
        </button>
      </div>

      <div className="w-full h-[.125rem] bg-gray-200 my-[.125rem]" />

      {loading ? (
        <LoadingIcon />
      ) : error ? (
        <ErrorMessage error={error} />
      ) : synonyms.length > 0 ? (
        <ul ref={listRef} className="max-h-[10rem] overflow-y-scroll flex flex-col">
          {synonyms.map((synonym) => (
            <SynonymListItem
              key={synonym.synonym_id}
              synonym={synonym}
              onDeleted={() => {
                setSuccessMessage("Synonym deleted!");
                setTimeout(() => setSuccessMessage(""), 1500);
                fetchSynonyms();
              }}
            />
          ))}
        </ul>
      ) : (
        <GeneralMessage message={`No Synonyms Found`} />
      )}
    </BasePopup>
  );
};

export { SynonymsManagementPopup };

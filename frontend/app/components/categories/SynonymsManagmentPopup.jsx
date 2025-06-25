"use client";

import React, { useState, useEffect, useRef } from "react";
import BasePopup from "../basic/BasePopup";
import { ValidationInput } from "../basic/ValidationInput";
import { SynonymListItem } from "./SynonymListItem";
import { LoadingIcon } from "../loading/LoadingIcon";
import { ErrorMessage } from "../basic/ErrorMessage";
import { GeneralMessage } from "../basic/GeneralMessage";
import { isTokenExpired } from "@/utils/session";

const SynonymsManagementPopup = ({ isOpen, onClose, title, category }) => {
  const [inputValue, setInputValue] = useState("");
  const [synonyms, setSynonyms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const listRef = useRef(null);

  const fetchSynonyms = async () => {
    try {
      if (isTokenExpired()) {
        window.location.href = "/admin-login";
        return;
      }

      const response = await fetch(
        `http://localhost:80/api/synonyms/${category.category_id}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch synonyms");
      }

      const data = await response.json();
      setSynonyms(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const postSynonym = async () => {
    if (isTokenExpired()) {
      window.location.href = "/admin-login";
      return;
    }

    fetch(`http://localhost:80/api/synonym/create/${category.category_id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({
        synonym: inputValue,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(() => {
        setInputValue("");
        fetchSynonyms();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    fetchSynonyms();
  }, []);

  useEffect(() => {
    if (synonyms == null || listRef.current == null) return;
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
        <ul
          ref={listRef}
          className="max-h-[10rem] overflow-y-scroll flex flex-col"
        >
          {synonyms.map((synonym) => (
            <SynonymListItem
              key={synonym.synonym_id}
              synonym={synonym}
              fetchSynonyms={fetchSynonyms}
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

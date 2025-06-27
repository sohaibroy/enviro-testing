"use client";

import { isTokenExpired } from "@/utils/session";
import FadeIn from "../basic/FadeIn";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

function SynonymListItem({ synonym, fetchSynonyms }) {
  const deleteSynonym = () => {
    if (isTokenExpired()) {
      window.location.href = "/admin-login";
      return;
    }

    //fetch(`http://localhost:80/api/synonym/delete/${synonym.synonym_id}`, {
    fetch(`${baseUrl}/api/synonym/delete/${synonym.synonym_id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(() => {
        fetchSynonyms();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <FadeIn>
      <li className="flex justify-between items-center border-b-[.1rem] p-[.25rem]">
        {synonym.synonym || "Synonym"}
        <button
          className="bg-[#003883] shadow-2xl w-[2rem] h-[2rem] rounded-md font-bold text-center transition-all hover:scale-[101%] text-white"
          onClick={deleteSynonym}
        >
          ×
        </button>
      </li>
    </FadeIn>
  );
}

export { SynonymListItem };

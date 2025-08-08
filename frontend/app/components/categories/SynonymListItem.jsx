"use client";

import { isTokenExpired } from "@/utils/session";
import FadeIn from "../basic/FadeIn";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const getCookie = (name) => {
  const m = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return m ? decodeURIComponent(m[2]) : null;
};

const ensureCsrf = async () => {
  await fetch(`${baseUrl}/sanctum/csrf-cookie`, { credentials: "include" });
};

function SynonymListItem({ synonym, fetchSynonyms, onDeleted }) {
  const deleteSynonym = async () => {
    if (isTokenExpired()) {
      window.location.href = "/admin-login";
      return;
    }

    if (!window.confirm("Delete this synonym?")) return;

    try {
      await ensureCsrf();
      const xsrf = getCookie("XSRF-TOKEN");

      const res = await fetch(`${baseUrl}/api/synonym/delete/${synonym.synonym_id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "X-XSRF-TOKEN": xsrf || "",
          Authorization: `Bearer ${sessionStorage.getItem("accessToken") || ""}`,
        },
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `HTTP ${res.status}`);
      }

      if (typeof onDeleted === "function") onDeleted();

      // refresh list
      fetchSynonyms?.();
    } catch (err) {
      alert("Failed to delete synonym. Please try again.");
    }
  };

  return (
    <FadeIn>
      <li className="flex justify-between items-center border-b-[.1rem] p-[.25rem]">
        {synonym.synonym || "Synonym"}
        <button
          className="bg-[#003883] shadow-2xl w-[2rem] h-[2rem] rounded-md font-bold text-center transition-all hover:scale-[101%] text-white"
          onClick={deleteSynonym}
          aria-label="Delete synonym"
        >
          ×
        </button>
      </li>
    </FadeIn>
  );
}

export { SynonymListItem };

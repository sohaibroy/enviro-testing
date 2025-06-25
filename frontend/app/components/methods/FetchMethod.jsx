"use client";

import React, { useState, useEffect } from "react";
import { LoadingIcon } from "@/app/components/loading/LoadingIcon";
import { MethodCard } from "@/app/components/methods/MethodCard";
import { GeneralMessage } from "@/app/components/basic/GeneralMessage";
import FadeIn from "@/app/components/basic/FadeIn";
import { isTokenExpired } from "@/utils/session";

export default function FetchMethod({ analyteId }) {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  if (analyteId) {
    fetchMethods();
  }
}, [analyteId]);

  const fetchMethods = async () => {
    setLoading(true);
    try {
      const accessToken = sessionStorage.getItem("accessToken");
      let headers = {};

      if (accessToken) {
        if (isTokenExpired()) {
          window.location.href = "/customer-login";
          return;
        }

        headers = {
          Authorization: `Bearer ${accessToken}`,
        };
      }

      const url = accessToken
        ? `http://localhost:80/api/methods/company/${analyteId}`
        : `http://localhost:80/api/methods/${analyteId}`;

      const response = await fetch(url, { headers });

      if (!response.ok) {
        throw new Error("Failed to fetch methods");
      }

      const methodsData = await response.json();
      setMethods(methodsData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-4 max-w-[70rem] mx-auto">
      {loading ? (
        <LoadingIcon />
      ) : methods.length === 0 && !loading ? (
        <GeneralMessage message="No methods available." />
      ) : (
        <FadeIn>
          <div className="w-full">
            {methods.length > 0 && (
              <>
                <section className="text-2xl font-bold mb-[4rem] border bg-enviro_blue border-gray-200 text-white drop-shadow-xl p-[2rem] text-center rounded-lg">
                  <h1>
                    {methods[0].analyte_name}
                    {methods[0].cas_number ? (
                      <>
                        -{" "}
                        <span className="text-enviro_blue_xlight">
                          {methods[0].cas_number}
                        </span>
                      </>
                    ) : null}
                  </h1>
                </section>
                <div
                  className={`w-full flex flex-wrap justify-evenly mb-[2rem] gap-[2rem] ${
                    methods.length % 3 === 0
                      ? "xl:justify-between"
                      : "xl:justify-evenly"
                  }`}
                >
                  {methods.map((methodData, index) => {
                    console.log("🧪 MethodCard props before render:", {
                      ...methodData,
                      analyte_id: analyteId,
                    });

                    return (
                      <MethodCard
                        key={`${methodData.method_id}-${index}`}
                        // inject analyte_id manually
                        method={{ ...methodData, analyte_id: analyteId }} 
                      />
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </FadeIn>
      )}
    </div>
  );
}
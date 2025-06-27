"use client";

import { LoadingIcon } from "@/app/components/loading/LoadingIcon";
import React, { useState, useEffect } from "react";
import FadeIn from "@/app/components/basic/FadeIn";
import QuantityDetails from "@/app/components/quantity-details/QuantityDetails";
import { isTokenExpired } from "@/utils/session";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;


export default function Quantity({ params }) {
  console.log("Received methodId param:", params.methodId);
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMethods();
  }, [params.methodId]); 

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

      let url;
      // if (accessToken) {
      //   url = `http://localhost:80/api/method-details/company/${params.methodId}`;
      // } else {
      //   url = `http://localhost:80/api/method-details/${params.methodId}`;
      // }

      if (accessToken) {
        url = `${baseUrl}/api/method-details/company/${params.methodId}`;
      } else {
        url = `${baseUrl}/api/method-details/${params.methodId}`;
          }

      const response = await fetch(url, { headers });

      if (!response.ok) {
        throw new Error("Failed to fetch methods");
      }

      const methods = await response.json();
      setMethods(methods);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[70rem] mx-[2rem] lg:mx-auto py-8">
      {loading ? (
        <div className="flex justify-center items-center">
          <LoadingIcon />
        </div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <FadeIn>
          <QuantityDetails quantityData={methods} />
        </FadeIn>
      )}
    </div>
  );
}
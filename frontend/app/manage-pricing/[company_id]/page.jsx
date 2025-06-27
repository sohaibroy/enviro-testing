"use client";

import React, { useState, useEffect } from "react";
import { CRUDHeader } from "@/app/components/navigation/CRUDHeader";
import { LoadingIcon } from "@/app/components/loading/LoadingIcon";
import { ErrorMessage } from "@/app/components/basic/ErrorMessage";
import { GeneralMessage } from "@/app/components/basic/GeneralMessage";
import { PricingMethodSelection } from "@/app/components/pricing/PricingMethodSelection";
import { FaArrowRight } from "react-icons/fa";
import { isTokenExpired } from "@/utils/session";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

function ManagePricingPage({ params }) {
  const [company, setCompany] = useState([]);
  const [analytes, setAnalytes] = useState([]);
  const [selectedAnalyteId, setSelectedAnalyteId] = useState(null);
  const [methods, setMethods] = useState([]);
  const [loadingAnalytes, setLoadingAnalytes] = useState(true);
  const [errorAnalytes, setErrorAnalytes] = useState(null);
  const [loadingMethods, setLoadingMethods] = useState(false);
  const [errorMethods, setErrorMethods] = useState(null);

  const fetchCompany = async () => {
    try {
      if (isTokenExpired()) {
        window.location.href = "/admin-login";
        return;
      }

      const response = await fetch(
        //`http://localhost:80/api/company/${params.company_id}`,
        `${baseUrl}/api/company/${params.company_id}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        }
      );
      const data = await response.json();
      setCompany(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAnalytes = async () => {
    try {
      if (isTokenExpired()) {
        window.location.href = "/admin-login";
        return;
      }

      //const response = await fetch("http://localhost:80/api/analytes", {
      const response = await fetch(`${baseUrl}/api/analytes`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      });
      const data = await response.json();
      setAnalytes(data);
      setLoadingAnalytes(false);
    } catch (error) {
      setErrorAnalytes(error);
      setLoadingAnalytes(false);
    }
  };

  const fetchMethods = async (analyteId) => {
    setLoadingMethods(true);
    try {
      if (isTokenExpired()) {
        window.location.href = "/admin-login";
        return;
      }

      const response = await fetch(
        //`http://localhost:80/api/methods/analyte/${analyteId}`,
        `${baseUrl}/api/methods/analyte/${analyteId}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        }
      );
      const data = await response.json();
      setMethods(data);
      setLoadingMethods(false);
    } catch (error) {
      setErrorMethods(error);
      setLoadingMethods(false);
    }
  };

  useEffect(() => {
    fetchCompany();
  }, [params.company_id]);

  useEffect(() => {
    if (company.company_id) {
      fetchAnalytes();
    }
  }, [company.company_id]);

  return (
    <div>
      <CRUDHeader
        title={`Manage Pricing For ${company.company_name || "..."}`}
        href="/manage-companies"
      />
      <div className="w-full overflow-x-scroll px-[2rem]">
        <div className="w-full max-w-[70rem] min-w-[50rem] gap-[4rem] mx-auto flex justify-between">
          <div className="flex flex-col w-full max-w-[30rem]">
            <h2 className="text-center mb-[2rem] font-bold text-2xl text-[#003883]">
              Analytes
            </h2>
            {loadingAnalytes ? (
              <div className="w-full">
                <LoadingIcon />
              </div>
            ) : errorAnalytes ? (
              <div className="w-full">
                <ErrorMessage error={errorAnalytes} />
              </div>
            ) : analytes.length > 0 ? (
              analytes.map((analytesData) => (
                <button
                  className={`flex justify-between w-full border-b-2 p-[.75rem] transition-all duration-300 hover:py-[1rem] drop-shadow-xl ${
                    selectedAnalyteId &&
                    selectedAnalyteId === analytesData.analyte_id
                      ? "bg-gray-300 hover:bg-gray-400"
                      : "bg-gray-50 hover:bg-gray-200 "
                  }`}
                  key={analytesData.analyte_id}
                  onClick={() => {
                    setSelectedAnalyteId(analytesData.analyte_id);
                    fetchMethods(analytesData.analyte_id);
                  }}
                >
                  <p className="text-start">{analytesData.analyte_name}</p>
                  <p className="text-end">{analytesData.cas_number}</p>
                </button>
              ))
            ) : (
              <div className="w-full">
                <GeneralMessage message={`No Analyte Found`} />
              </div>
            )}
          </div>

          {!loadingAnalytes &&
          !loadingMethods &&
          !errorMethods &&
          !errorAnalytes &&
          methods.length > 0 ? (
            <div className="relative flex justify-center items-center">
              <div className="fixed top-1/2 transform -translate-y-1/2 drop-shadow-xl">
                <FaArrowRight
                  style={{ color: "#003883", fontSize: "1.75rem" }}
                />
              </div>
            </div>
          ) : (
            ""
          )}

          <div className="flex flex-col w-full max-w-[30rem]">
            <h2 className="text-center mb-[2rem] font-bold text-2xl text-[#003883]">
              Methods
            </h2>
            {loadingMethods ? (
              <div className="w-full">
                <LoadingIcon />
              </div>
            ) : errorMethods ? (
              <div className="w-full">
                <ErrorMessage error={errorMethods} />
              </div>
            ) : methods.length > 0 ? (
              methods.map((method, index) => (
                <PricingMethodSelection
                  key={`${method.method_id}_${index}`}
                  method={method}
                  company={company}
                />
              ))
            ) : (
              <div className="w-full">
                <GeneralMessage
                  message={
                    selectedAnalyteId != null
                      ? `No Method Found...`
                      : `No Analyte Selected...`
                  }
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default ManagePricingPage;

"use client";

import React, { useState, useEffect } from "react";
import BasePopup from "../basic/BasePopup";
import { ValidationInput } from "../basic/ValidationInput";
import { GeneralMessage } from "../basic/GeneralMessage";
import { isTokenExpired } from "@/utils/session";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const ManagePriceOverrides = ({ company, method, isOpen, onClose, title }) => {
  const [turnAroundTimes, setTurnAroundTimes] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const getPriceOverrides = async () => {
    try {
      if (isTokenExpired()) {
        window.location.href = "/admin-login";
        return;
      }

      const response = await fetch(
        `${baseUrl}/api/priceoverride/${company.company_id}/${method.method_id}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch data. Status: ${response.status}`);
      }

      const data = await response.json();
      setTurnAroundTimes(data);
      setErrorMessage("");
    } catch (error) {
      console.error("Error fetching data:", error);
      setErrorMessage("Failed to load price overrides.");
    }
  };

  const setPriceOverrides = async () => {
    try {
      if (isTokenExpired()) {
        window.location.href = "/admin-login";
        return;
      }

      setIsSaving(true);
      setSuccessMessage("");
      setErrorMessage("");

      const turnAroundTimesWithoutDefaultPrice = turnAroundTimes.map(
        ({ default_price, ...rest }) => rest
      );

      //Get CSRF cookie
      await fetch(`${baseUrl}/sanctum/csrf-cookie`, {
        credentials: "include",
      });

      //Extract XSRF token
      const xsrfToken = decodeURIComponent(
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("XSRF-TOKEN="))
          ?.split("=")[1] ?? ""
      );

      //Save overrides
      const res = await fetch(
        `${baseUrl}/api/priceoverride/reset/${company.company_id}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
            "X-XSRF-TOKEN": xsrfToken,
          },
          body: JSON.stringify(turnAroundTimesWithoutDefaultPrice),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text}`);
      }

      await res.json();

      setSuccessMessage("Price overrides have been updated successfully.");
      //close after a short delay
      setTimeout(() => {
        onClose();
        //Clear message for the next open
        setSuccessMessage("");
      }, 1500);
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Failed to update price overrides.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePriceChange = (index, value) => {
    const updated = [...turnAroundTimes];
    updated[index].price = value;
    setTurnAroundTimes(updated);
  };

  const handleResetPriceOverrides = () => {
    const reset = turnAroundTimes.map((item) => ({
      ...item,
      price: item.default_price,
    }));
    setTurnAroundTimes(reset);
  };

  const formatToCADPrice = (number) =>
    Number(number).toLocaleString("en-CA", {
      style: "currency",
      currency: "CAD",
    });

  useEffect(() => {
    if (isOpen) {
      //Clear messages each time popup opens
      setSuccessMessage("");
      setErrorMessage("");
      getPriceOverrides();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <BasePopup
      isOpen={isOpen}
      onClose={() => {
        setSuccessMessage("");
        setErrorMessage("");
        onClose();
      }}
      title={title}
      activityText={isSaving ? "Saving..." : "Set"}
      onActivityClicked={isSaving ? undefined : setPriceOverrides}
      className="max-w-[30rem]"
    >
      {/* Messages */}
      {successMessage && (
        <p className="text-green-600 font-semibold mb-2">{successMessage}</p>
      )}
      {errorMessage && (
        <p className="text-red-600 font-semibold mb-2">{errorMessage}</p>
      )}

      <section className="w-full flex justify-end">
        <button
          className="bg-red-400 p-2 shadow-2xl w-[6rem] font-bold rounded-md text-center transition-all hover:scale-[101%] text-white disabled:opacity-60"
          onClick={handleResetPriceOverrides}
          disabled={isSaving}
          type="button"
        >
          Reset
        </button>
      </section>

      <form className="flex flex-wrap justify-between gap-y-4">
        <section className="w-full overflow-y-scroll max-h-[20rem] flex flex-col gap-[.5rem]">
          {turnAroundTimes.length > 0 ? (
            turnAroundTimes.map((item, index) => (
              <div
                key={`${item.turn_around_id}_${index}`}
                className="flex gap-[.5rem]"
              >
                <ValidationInput
                  title={item.turnaround_time}
                  value={item.price}
                  type="number"
                  min="0"
                  className="md:w-full"
                  onChange={(e) => handlePriceChange(index, e.target.value)}
                  disabled={isSaving}
                />
                <div className="flex flex-col justify-end text-center w-[8rem] text-enviro_blue">
                  <h2 className="text-xs font-semibold">Default</h2>
                  <p>{formatToCADPrice(item.default_price)}</p>
                </div>
              </div>
            ))
          ) : (
            <GeneralMessage
              message={`No Turn Around Times Found For ${method.method_name}`}
            />
          )}
        </section>
      </form>
    </BasePopup>
  );
};

export { ManagePriceOverrides };

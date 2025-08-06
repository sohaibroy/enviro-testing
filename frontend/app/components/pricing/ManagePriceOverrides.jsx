"use client";

import React, { useState, useEffect } from "react";
import BasePopup from "../basic/BasePopup";
import { ValidationInput } from "../basic/ValidationInput";
import { GeneralMessage } from "../basic/GeneralMessage";
import { isTokenExpired } from "@/utils/session";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const ManagePriceOverrides = ({ company, method, isOpen, onClose, title }) => {
  const [turnAroundTimes, setTurnAroundTimes] = useState([]);

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
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

 const setPriceOverrides = async () => {
  try {
    if (isTokenExpired()) {
      window.location.href = "/admin-login";
      return;
    }

    const turnAroundTimesWithoutDefaultPrice = turnAroundTimes.map(
      ({ default_price, ...rest }) => rest
    );

    // 1. Get the CSRF cookie
    await fetch(`${baseUrl}/sanctum/csrf-cookie`, {
      credentials: "include",
    });

    // 2. Make the POST request with XSRF token
    const xsrfToken = decodeURIComponent(
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("XSRF-TOKEN="))
        ?.split("=")[1] ?? ""
    );

    fetch(`${baseUrl}/api/priceoverride/reset/${company.company_id}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        "X-XSRF-TOKEN": xsrfToken,
      },
      body: JSON.stringify(turnAroundTimesWithoutDefaultPrice),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
        onClose();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } catch (error) {
    console.error("Error:", error);
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
      getPriceOverrides();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <BasePopup
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      activityText="Set"
      onActivityClicked={setPriceOverrides}
      className="max-w-[30rem]"
    >
      <section className="w-full flex justify-end">
        <button
          className="bg-red-400 p-2 shadow-2xl w-[6rem] font-bold rounded-md text-center transition-all hover:scale-[101%] text-white"
          onClick={handleResetPriceOverrides}
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

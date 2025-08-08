import React, { useState, useEffect } from "react";
import BasePopup from "../basic/BasePopup";
import { ValidationInput } from "../basic/ValidationInput";
import { isTokenExpired } from "@/utils/session";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const ManageTurnAroundTimesPopup = ({ method, isOpen, onClose, title }) => {
  const [turnAroundTimes, setTurnAroundTimes] = useState([]);
  const [regularPrice, setRegularPrice] = useState(0);
  const [regularDay, setRegularDay] = useState("7 Days");

  const [values, setValues] = useState({
    days5: 0,
    days3: 0,
    hours48: 0,
    hours24: 0,
    sameDay: 0,
    isActive5: true,
    isActive3: true,
    isActive48: true,
    isActive24: true,
    isActiveSameDay: true,
  });

  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (isOpen) {
      async function fetchTurnAroundData() {
        if (isTokenExpired()) {
          window.location.href = "/admin-login";
          return;
        }

        try {
          const response = await fetch(
            `${baseUrl}/api/turnaroundtimes/${method.method_id}`,
            {
              headers: {
                Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
              },
            }
          );
          const data = await response.json();
          setTurnAroundTimes(data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
      fetchTurnAroundData();
      setSuccessMessage(""); // clear old banner when reopened
    }
  }, [isOpen, method?.method_id]);

  useEffect(() => {
    if (!turnAroundTimes) return;

    setRegularDay(
      turnAroundTimes.find((item) => item.is_default_price === 1)?.turnaround_time ?? "7 Days"
    );

    setRegularPrice(
      turnAroundTimes.find((item) => item.is_default_price === 1)?.price ?? 0
    );

    setValues((prevState) => ({
      ...prevState,
      days5: turnAroundTimes.find((i) => i.turnaround_time === "5 Days")?.price ?? 0,
      days3: turnAroundTimes.find((i) => i.turnaround_time === "3 Days")?.price ?? 0,
      hours48: turnAroundTimes.find((i) => i.turnaround_time === "48 Hours")?.price ?? 0,
      hours24: turnAroundTimes.find((i) => i.turnaround_time === "24 Hours")?.price ?? 0,
      sameDay: turnAroundTimes.find((i) => i.turnaround_time === "Same Day")?.price ?? 0,
      isActive5: turnAroundTimes.find((i) => i.turnaround_time === "5 Days")?.is_active ?? false,
      isActive3: turnAroundTimes.find((i) => i.turnaround_time === "3 Days")?.is_active ?? false,
      isActive48: turnAroundTimes.find((i) => i.turnaround_time === "48 Hours")?.is_active ?? false,
      isActive24: turnAroundTimes.find((i) => i.turnaround_time === "24 Hours")?.is_active ?? false,
      isActiveSameDay:
        turnAroundTimes.find((i) => i.turnaround_time === "Same Day")?.is_active ?? false,
    }));
  }, [turnAroundTimes]);

  if (!isOpen) return null;

  const handleRegularDayChange = (e) => {
    const selectedRegularDay = e.target.value;
    setRegularDay(selectedRegularDay);
    setRegularPrice(0);

    if (selectedRegularDay === "14 Days") {
      setValues((prev) => ({
        ...prev,
        days5: 0,
        days3: 0,
        hours48: 0,
        hours24: 0,
        sameDay: 0,
        isActive5: false,
        isActive3: false,
        isActive48: false,
        isActive24: false,
        isActiveSameDay: false,
      }));
    } else {
      setValues((prev) => ({
        ...prev,
        days5: 0,
        days3: 0,
        hours48: 0,
        hours24: 0,
        sameDay: 0,
        isActive5: true,
        isActive3: true,
        isActive48: true,
        isActive24: true,
        isActiveSameDay: true,
      }));
    }
  };

  const handleChange = (e, fieldName) => {
    const newValue = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setValues((prev) => ({ ...prev, [fieldName]: newValue }));
  };

  const handleRegularPriceChange = (e) => {
    const newRegularPrice = e.target.value;
    setRegularPrice(newRegularPrice);
    setValues((prev) => ({
      ...prev,
      days5: calculatePrice(1.25, newRegularPrice),
      days3: calculatePrice(1.5, newRegularPrice),
      hours48: calculatePrice(1.75, newRegularPrice),
      hours24: calculatePrice(2, newRegularPrice),
      sameDay: calculatePrice(3, newRegularPrice),
    }));
  };

  const calculatePrice = (multiplier, regularPrice) => {
    const price = regularPrice * multiplier;
    return regularDay === "7 Days" ? Math.ceil(price / 5) * 5 : 0;
    // if 14 days is default, everything else is 0 (disabled)
  };

  async function setAllTurnAroundTimes() {
    try {
      if (isTokenExpired()) {
        window.location.href = "/admin-login";
        return;
      }

      const response = await fetch(
        `${baseUrl}/api/turnaroundtimes/set/${method.method_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify([
            {
              turnaround_time: regularDay,
              price: regularPrice,
              is_active: 1,
              is_default_price: 1,
            },
            {
              turnaround_time: "5 Days",
              price: values.days5,
              is_active: values.days5 > 0 ? values.isActive5 : false,
              is_default_price: 0,
            },
            {
              turnaround_time: "3 Days",
              price: values.days3,
              is_active: values.days3 > 0 ? values.isActive3 : false,
              is_default_price: 0,
            },
            {
              turnaround_time: "48 Hours",
              price: values.hours48,
              is_active: values.hours48 > 0 ? values.isActive48 : false,
              is_default_price: 0,
            },
            {
              turnaround_time: "24 Hours",
              price: values.hours24,
              is_active: values.hours24 > 0 ? values.isActive24 : false,
              is_default_price: 0,
            },
            {
              turnaround_time: "Same Day",
              price: values.sameDay,
              is_active: values.sameDay > 0 ? values.isActiveSameDay : false,
              is_default_price: 0,
            },
          ]),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // show success, then close after 1.5s
      setSuccessMessage("Turnaround times saved successfully!");
      setTimeout(() => {
        setSuccessMessage("");
        onClose?.();
      }, 1500);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to save turnaround times. Please try again.");
    }
  }

  return (
    <BasePopup
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      activityText="Set"
      onActivityClicked={setAllTurnAroundTimes}
    >
      {successMessage && (
        <div
          className="w-full mb-4 p-2 text-green-800 bg-green-100 border border-green-300 rounded"
          role="status"
          aria-live="polite"
        >
          {successMessage}
        </div>
      )}

      <form className="flex flex-wrap justify-between gap-y-4">
        <div className="flex justify-between items-center w-full">
          <ValidationInput
            type="number"
            value={regularPrice}
            min={0}
            onChange={handleRegularPriceChange}
            title={
              <label className="flex gap-2">
                Default
                <select
                  className="hover:cursor-pointer"
                  value={regularDay}
                  onChange={handleRegularDayChange}
                >
                  <option value="7 Days">7 days</option>
                  <option value="14 Days">14 days</option>
                </select>
              </label>
            }
            className="w-full md:w-full"
          />
        </div>

        <section
          className={`w-full flex flex-col gap-y-2 ${
            regularDay === "14 Days" ? "hidden" : ""
          }`}
        >
          <div className="w-full h-[.125rem] bg-gray-200 my-[.5rem]" />

          <div className="flex justify-between items-center w-full">
            <ValidationInput
              type="number"
              title="5 Days"
              min={0}
              value={values.days5}
              disabled={!values.isActive5}
              onChange={(e) => handleChange(e, "days5")}
              className="w-4/5 md:w-4/5"
            />
            <label className="font-bold text-nowrap flex gap-2 mt-[1rem] text-[#003883] w-[5.2rem] hover:cursor-pointer">
              {values.isActive5 ? "Enabled" : "Disabled"}
              <input
                type="checkbox"
                name="isActive5"
                checked={values.isActive5}
                onChange={(e) => handleChange(e, "isActive5")}
              />
            </label>
          </div>

          <div className="flex justify-between items-center w-full">
            <ValidationInput
              type="number"
              title="3 Days"
              min={0}
              value={values.days3}
              disabled={!values.isActive3}
              onChange={(e) => handleChange(e, "days3")}
              className="w-4/5 md:w-4/5"
            />
            <label className="font-bold text-nowrap flex gap-2 mt-[1rem] text-[#003883] w-[5.2rem] hover:cursor-pointer">
              {values.isActive3 ? "Enabled" : "Disabled"}
              <input
                type="checkbox"
                name="isActive3"
                checked={values.isActive3}
                onChange={(e) => handleChange(e, "isActive3")}
              />
            </label>
          </div>

          <div className="flex justify-between items-center w-full">
            <ValidationInput
              type="number"
              title="48 Hours"
              min={0}
              value={values.hours48}
              disabled={!values.isActive48}
              onChange={(e) => handleChange(e, "hours48")}
              className="w-4/5 md:w-4/5"
            />
            <label className="font-bold text-nowrap flex gap-2 mt-[1rem] text-[#003883] w-[5.2rem] hover:cursor-pointer">
              {values.isActive48 ? "Enabled" : "Disabled"}
              <input
                type="checkbox"
                name="isActive48"
                checked={values.isActive48}
                onChange={(e) => handleChange(e, "isActive48")}
              />
            </label>
          </div>

          <div className="flex justify-between items-center w-full">
            <ValidationInput
              type="number"
              title="24 Hours"
              min={0}
              value={values.hours24}
              disabled={!values.isActive24}
              onChange={(e) => handleChange(e, "hours24")}
              className="w-4/5 md:w-4/5"
            />
            <label className="font-bold text-nowrap flex gap-2 mt-[1rem] text-[#003883] w-[5.2rem] hover:cursor-pointer">
              {values.isActive24 ? "Enabled" : "Disabled"}
              <input
                type="checkbox"
                name="isActive24"
                checked={values.isActive24}
                onChange={(e) => handleChange(e, "isActive24")}
              />
            </label>
          </div>

          <div className="flex justify-between items-center w-full">
            <ValidationInput
              type="number"
              title="Same Day"
              min={0}
              value={values.sameDay}
              disabled={!values.isActiveSameDay}
              onChange={(e) => handleChange(e, "sameDay")}
              className="w-4/5 md:w-4/5"
            />
            <label className="font-bold text-nowrap flex gap-2 mt-[1rem] text-[#003883] w-[5.2rem] hover:cursor-pointer">
              {values.isActiveSameDay ? "Enabled" : "Disabled"}
              <input
                type="checkbox"
                name="isActiveSameDay"
                checked={values.isActiveSameDay}
                onChange={(e) => handleChange(e, "isActiveSameDay")}
              />
            </label>
          </div>
        </section>
      </form>
    </BasePopup>
  );
};

export { ManageTurnAroundTimesPopup };
"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

function UserInfo() {
  const {
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success or error

  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        console.log("Loaded user from sessionStorage:", user);
        setValue("first_name", user.first_name || "");
        setValue("last_name", user.last_name || "");
        setValue("email", user.email || "");
        setValue("phone_number", user.phone_number || "");
        setValue("street_address", user.street_address || "");
        setValue("city", user.city || "");
        setValue("province", user.province || "");
        setValue("postal_code", user.postal_code || "");
        setValue("country", user.country || "");
        setValue("job_title", user.job_title || "");
        setValue("is_active", user.is_active ?? 1);
        setValue("account_id", user.account_id); // Used during submission
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, [setValue]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  const token = Cookies.get("token");
  const accountId = getValues("account_id");

  if (!accountId || !token) {
    setMessage("Missing account ID or token. Please log in again.");
    setMessageType("error");
    return;
  }

  const data = getValues();
  delete data.account_id;

  // if passwords dont match with each other
  if (!data.password?.trim()) {
    delete data.password;
    delete data.confirm_password;
  } else if (data.password !== data.confirm_password) {
    setMessage("Password and confirm password do not match.");
    setMessageType("error");
    return;
  }

  try {
    const response = await fetch(`${baseUrl}/api/account/update/${accountId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const resData = await response.json();

    if (!response.ok) {
      setMessage(resData?.message || resData?.error || "Failed to update account.");
      setMessageType("error");
      return;
    }

    sessionStorage.setItem("user", JSON.stringify(resData.message));
    setMessage("The User information has been updated successfully!");
    setMessageType("success");
  } catch (error) {
    console.error("Update error:", error);
    setMessage("There was an error updating your information.");
    setMessageType("error");
  }
};

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-6 pb-4 border-b-2 border-black">
        User Information
      </h1>

      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-md">
        <p className="text-sm">
          ⚠️ <strong>Note:</strong> If you want to edit or update any information,
          you can do so below, change any fields and click Save. <strong>THANK YOU</strong>
        </p>
      </div>

       {/* Feedback Message Display */}
      {message && (
        <div
          className={`mb-6 rounded-md p-4 ${
            messageType === "success"
              ? "bg-green-100 border border-green-500 text-green-700"
              : "bg-red-100 border border-red-500 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-wrap -mx-2">
          <div className="w-full md:w-1/2 px-2">
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              id="first_name"
              type="text"
              {...register("first_name", { required: "First name is required" })}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
            {errors.first_name && <p className="text-red-600 text-xs">{errors.first_name.message}</p>}
          </div>

          <div className="w-full md:w-1/2 px-2">
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              id="last_name"
              type="text"
              {...register("last_name", { required: "Last name is required" })}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
            {errors.last_name && <p className="text-red-600 text-xs">{errors.last_name.message}</p>}
          </div>
        </div>

        <div className="flex flex-wrap -mx-2">
          <div className="w-full md:w-1/2 px-2">
            <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              id="phone_number"
              type="tel"
              {...register("phone_number", { required: "Phone Number is required" })}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
            {errors.phone_number && <p className="text-red-600 text-xs">{errors.phone_number.message}</p>}
          </div>

          <div className="w-full md:w-1/2 px-2">
            <label htmlFor="job_title" className="block text-sm font-medium text-gray-700">
              Job Title
            </label>
            <input
              id="job_title"
              type="text"
              {...register("job_title")}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
        </div>

        <div className="w-full">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email", { required: "Email is required" })}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
          {errors.email && <p className="text-red-600 text-xs">{errors.email.message}</p>}
        </div>

        <div className="w-full border-t border-gray-300 pt-4 mt-6">
  <h2 className="text-lg font-semibold mb-2">Change Password</h2>

  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
    New Password
  </label>
  <input
    id="password"
    type="password"
    {...register("password", {
      minLength: {
        value: 6,
        message: "Password must be at least 6 characters",
      },
    })}
    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
  />
  {errors.password && (
    <p className="text-red-600 text-xs">{errors.password.message}</p>
  )}

  <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mt-4">
    Confirm Password
  </label>
  <input
    id="confirm_password"
    type="password"
    {...register("confirm_password", {
      validate: (value) =>
        value === getValues("password") || "Passwords do not match",
    })}
    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
  />
  {errors.confirm_password && (
    <p className="text-red-600 text-xs">{errors.confirm_password.message}</p>
  )}
</div>

        <div className="flex flex-wrap -mx-2">
          <div className="w-full md:w-1/2 px-2">
            <label htmlFor="street_address" className="block text-sm font-medium text-gray-700">
              Street Address
            </label>
            <input
              id="street_address"
              type="text"
              {...register("street_address", { required: "Street address is required" })}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
            {errors.street_address && <p className="text-red-600 text-xs">{errors.street_address.message}</p>}
          </div>

          <div className="w-full md:w-1/2 px-2">
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              City
            </label>
            <input
              id="city"
              type="text"
              {...register("city", { required: "City is required" })}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
            {errors.city && <p className="text-red-600 text-xs">{errors.city.message}</p>}
          </div>
        </div>

        <div className="flex flex-wrap -mx-2">
          <div className="w-full md:w-1/3 px-2">
            <label htmlFor="province" className="block text-sm font-medium text-gray-700">
              Province
            </label>
            <input
              id="province"
              type="text"
              {...register("province", { required: "Province is required" })}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
            {errors.province && <p className="text-red-600 text-xs">{errors.province.message}</p>}
          </div>

          <div className="w-full md:w-1/3 px-2">
            <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700">
              Postal Code
            </label>
            <input
              id="postal_code"
              type="text"
              {...register("postal_code", { required: "Postal Code is required" })}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
            {errors.postal_code && <p className="text-red-600 text-xs">{errors.postal_code.message}</p>}
          </div>

          <div className="w-full md:w-1/3 px-2">
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">
              Country
            </label>
            <input
              id="country"
              type="text"
              {...register("country", { required: "Country is required" })}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
            {errors.country && <p className="text-red-600 text-xs">{errors.country.message}</p>}
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md transition-all duration-300 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default UserInfo;
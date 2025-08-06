"use client";

import React, { useState } from "react";
import { AiFillAlert } from "react-icons/ai";
import { LoadingIcon } from "../loading/LoadingIcon";

function AddAccountPopup({ isOpen, onClose, fetchAccounts, companyId }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    streetAddress: "",
    city: "",
    province: "",
    postalCode: "",
    country: "",
    jobTitle: "",
  });

  const [isBusinessCustomer, setIsBusinessCustomer] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleInputChange = (e) => {
    setError((prev) => ({ ...prev, [e.target.name]: "" }));
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRadioChange = (e) => {
    setIsBusinessCustomer(e.target.value === "business");
  };

  const getCookie = (name) => {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const postalCodeRegex = /^[A-Za-z]\d[A-Za-z]?\d[A-Za-z]\d$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    const phoneRegex = /^(1)?\d{10}$/;
    const phoneDigits = formData.phoneNumber.replace(/\D/g, "");

    if (!formData.firstName.trim()) newErrors.firstName = "Please enter your first name.";
    if (!formData.lastName.trim()) newErrors.lastName = "Please enter your last name.";
    if (!formData.email.trim()) newErrors.email = "Please enter a valid email address.";
    else if (!emailRegex.test(formData.email)) newErrors.email = "Invalid email format.";
    if (!formData.password.trim()) newErrors.password = "Please enter a password.";
    else if (!passwordRegex.test(formData.password)) newErrors.password = "Password too weak.";
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Please enter your phone number.";
    else if (!phoneRegex.test(phoneDigits)) newErrors.phoneNumber = "Phone must be 10 digits.";
    if (!formData.streetAddress.trim()) newErrors.streetAddress = "Enter your street address.";
    if (!formData.city.trim()) newErrors.city = "Enter your city.";
    if (!formData.province.trim()) newErrors.province = "Enter your province.";
    if (!formData.postalCode.trim()) newErrors.postalCode = "Enter your postal code.";
    else if (!postalCodeRegex.test(formData.postalCode)) newErrors.postalCode = "Invalid format.";
    if (!formData.country.trim()) newErrors.country = "Enter your country.";
    if (!agreedToTerms) newErrors.agreedToTerms = "You must agree to the Terms & Conditions.";
    if (isBusinessCustomer && !formData.jobTitle.trim())
      newErrors.jobTitle = "Job Title required for business.";

    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      return;
    }

    try {
      setLoading(true);
      const csrfRes = await fetch(`${baseUrl}/sanctum/csrf-cookie`, {
        credentials: "include",
      });

      if (!csrfRes.ok) throw new Error("CSRF fetch failed");

      const csrfToken = getCookie("XSRF-TOKEN");

      const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone_number: formData.phoneNumber,
        street_address: formData.streetAddress,
        city: formData.city,
        province: formData.province,
        postal_code: formData.postalCode,
        country: formData.country,
        job_title: isBusinessCustomer ? formData.jobTitle : null,
        company_id: companyId,
      };

      const response = await fetch(`${baseUrl}/api/signup/account`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        setError({
          general:
            result.errors?.[Object.keys(result.errors)[0]][0] ||
            result.message ||
            "Signup failed",
        });
      } else {
        setSuccessMessage("Account successfully created!");
        fetchAccounts();
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (err) {
      setError({ general: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center p-4 overflow-y-auto">
      <div className="bg-white p-6 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl border border-gray-200">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Add New Account</h2>

          {error.general && (
            <div className="text-red-600 text-sm text-center flex items-center justify-center gap-2 bg-red-50 p-2 rounded-md border border-red-200">
              <AiFillAlert />
              {error.general}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              "firstName",
              "lastName",
              "email",
              "password",
              "phoneNumber",
              "streetAddress",
              "city",
              "province",
              "postalCode",
              "country",
            ].map((field) => (
              <input
                key={field}
                placeholder={field.replace(/([A-Z])/g, " $1")}
                name={field}
                type={field === "password" ? "password" : "text"}
                value={formData[field]}
                onChange={handleInputChange}
                className="input border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>

          <div className="flex gap-6 items-center mt-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="customerType"
                value="individual"
                checked={!isBusinessCustomer}
                onChange={handleRadioChange}
              />
              <span>Individual</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="customerType"
                value="business"
                checked={isBusinessCustomer}
                onChange={handleRadioChange}
              />
              <span>Business</span>
            </label>
          </div>

          {isBusinessCustomer && (
            <input
              placeholder="Job Title"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleInputChange}
              className="input border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}

          <label className="flex items-center gap-2 text-sm mt-2">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
            />
            I agree to the <span className="underline cursor-pointer">Terms & Conditions</span>
          </label>

          <div className="flex gap-4 justify-end mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition"
            >
              Cancel
            </button>
            <button
  type="submit"
  disabled={loading}
  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition min-w-[10rem] h-10"
>
  <span className="flex items-center justify-center gap-2">
    {loading && <LoadingIcon />}
    {!loading && "Create Account"}
  </span>
</button>
          </div>

          {successMessage && (
            <p className="text-green-600 text-center mt-4 font-medium">
              {successMessage}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export { AddAccountPopup };
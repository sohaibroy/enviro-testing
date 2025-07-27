"use client";

import React from "react";
import { useState } from "react";
import { AiFillAlert } from "react-icons/ai";
import { LoadingIcon } from "../loading/LoadingIcon";
import FadeIn from "../basic/FadeIn";
import { useRouter } from "next/navigation";
import { createSession } from "@/utils/session";

// customer signup FORM that is imported on the customer sineup page

function Signup({ title, link, apiPath }) {
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
    creditCard: "",
    jobTitle: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const router = useRouter();
  const [isBusinessCustomer, setIsBusinessCustomer] = useState(false);

  const [showTerms, setShowTerms] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  function getCookie(name) {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    if (match) return decodeURIComponent(match[2]);
    return null;
  }

  const executeSignup = async (
    apiPath,
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    streetAddress,
    city,
    province,
    postalCode,
    country,
    creditCard,
    jobTitle
  ) => {
    setLoading(true);
    setError({});
    //console.log("Starting signup...");

    try {
      // STEP 1: Get CSRF cookie from Laravel Sanctum
      //console.log("Fetching CSRF cookie...");
      const csrfRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/sanctum/csrf-cookie`,
        {
          credentials: "include",
        }
      );

      if (!csrfRes.ok) {
        console.error("CSRF cookie fetch failed:", csrfRes.status);
        setError({
          general: "CSRF token error. Please refresh and try again.",
        });
        setLoading(false);
        return;
      }

      //console.log("CSRF cookie fetched.");
      const csrfToken = getCookie("XSRF-TOKEN");
      //console.log("CSRF token extracted:", csrfToken);

      // STEP 2: Send the signup request
      const response = await fetch(apiPath, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": csrfToken, // manually set
        },
        credentials: "include",
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email: email,
          password: password,
          phone_number: phoneNumber,
          street_address: streetAddress,
          city: city,
          province: province,
          postal_code: postalCode,
          country: country,
          credit_card: creditCard,
          job_title: isBusinessCustomer ? jobTitle : null,
        }),
      });

      console.log("Signup response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Signup success:", data);

        // Store user object in sessionStorage
        sessionStorage.setItem("user", JSON.stringify(data.user));

        setSuccessMessage("Signup successful! Redirecting to login...");
        setTimeout(() => {
          createSession(
            data.token,
            apiPath.includes("account"),
            data.expires_at,
            data.user,
            data.company_name
          );
          router.push(link || "/customer-login");
        }, 2000);
      } else {
        const errorData = await response.json();
        console.error("Signup failed:", errorData);

        if (errorData.errors) {
          const firstError = Object.values(errorData.errors)[0][0]; //use errorData
          setError({ general: firstError });
        } else {
          setError({ general: "Signup failed! Please check your details." });
        }
        setLoading(false);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError({
        general: err.message || "Something went wrong. Please try again.",
      });
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setError({ ...error, [e.target.name]: "" });
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRadioChange = (e) => {
    setIsBusinessCustomer(e.target.value === "business");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const postalCodeRegex = /^[A-Za-z]\d[A-Za-z]?\d[A-Za-z]\d$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    const phoneRegex = /^(1)?\d{10}$/;
    const phoneDigits = formData.phoneNumber.replace(/\D/g, "");

    if (!formData.firstName.trim())
      newErrors.firstName = "Please enter your first name.";
    if (!formData.lastName.trim())
      newErrors.lastName = "Please enter your last name.";

    if (!formData.email.trim())
      newErrors.email = "Please enter a valid email address.";
    else if (!emailRegex.test(formData.email))
      newErrors.email = "Invalid email format (e.g., name@example.com).";

    if (!formData.password.trim())
      newErrors.password = "Please enter a password.";
    else if (!passwordRegex.test(formData.password))
      newErrors.password = "Minimum 6 characters, 1 uppercase, 1 number.";

    if (!formData.phoneNumber.trim())
      newErrors.phoneNumber = "Please enter your phone number.";
    else if (!phoneRegex.test(phoneDigits)) {
      newErrors.phoneNumber =
        "Phone number must be 10 digits (e.g., 7805555555).";
    }

    if (!formData.streetAddress.trim())
      newErrors.streetAddress = "Please enter your street address.";

    if (!formData.city.trim()) newErrors.city = "Please enter your city.";

    if (!formData.province.trim())
      newErrors.province = "Please enter your province.";

    if (!formData.postalCode.trim())
      newErrors.postalCode = "Please enter your postal code.";
    else if (!postalCodeRegex.test(formData.postalCode))
      newErrors.postalCode = "Format must match e.g., A1A1A1.";

    if (!formData.country.trim())
      newErrors.country = "Please enter your country.";

    if (!agreedToTerms)
      newErrors.agreedToTerms =
        "Please agree to the Terms & Conditions to continue.";

    if (isBusinessCustomer && !formData.jobTitle.trim())
      newErrors.jobTitle = "Job Title is required for Business Customer";

    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      return;
    }
    setLoading(true);
    setError({});

    await executeSignup(
      apiPath,
      formData.firstName,
      formData.lastName,
      formData.email,
      formData.password,
      formData.phoneNumber,
      formData.streetAddress,
      formData.city,
      formData.province,
      formData.postalCode,
      formData.country,
      formData.creditCard,
      formData.jobTitle
    );
  };

  return (
    <FadeIn>
      <div className="w-full flex justify-center py-10 sm:py-12 lg:py-16 px-4">
        <div className="w-full max-w-screen-md">
          <form
            className="bg-white w-full px-8 py-12 rounded-2xl shadow-xl flex flex-col gap-8 transition-all hover:shadow-2xl"
            onSubmit={handleSubmit}
          >
            <section className="flex flex-col h-auto justify-between">
              <div className="flex justify-between">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  {title || "Sign Up"}
                </h1>

                {/* <h2 className="text-enviro_blue_xlight font-bold drop-shadow-2xl">
                            Enviro-Works
                        </h2> */}
              </div>
              {error.general && (
                <div className="flex gap-2 items-end justify-center drop-shadow-xl text-sm font-semibold text-red-500">
                  <AiFillAlert size={22} />
                  <p>{error.general}</p>
                </div>
              )}
            </section>
            {/* SuccessMessage */}
            {successMessage && (
              <div className="text-green-400 font-semibold text-center mb-4 drop-shadow-xl">
                {successMessage}
              </div>
            )}
            {/* Name fields */}
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-bold text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg text-black"
                />
                {error.firstName && (
                  <p className="text-red-500 text-sm mt-1">{error.firstName}</p>
                )}
              </div>
              <div>
                <label className="block mb-1 text-sm font-bold text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg text-black"
                />
                {error.lastName && (
                  <p className="text-red-500 text-sm mt-1">{error.lastName}</p>
                )}
              </div>
            </section>

            {/* Customer Type Radio Buttons */}
            <section className="flex gap-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="business"
                  name="customerType"
                  value="business"
                  checked={isBusinessCustomer}
                  onChange={handleRadioChange}
                />
                <label htmlFor="business" className="ml-2">
                  Business Customer
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="individual"
                  name="customerType"
                  value="individual"
                  checked={!isBusinessCustomer}
                  onChange={handleRadioChange}
                />
                <label htmlFor="individual" className="ml-2">
                  Individual Customer
                </label>
              </div>
            </section>

            {/* Job title for business customers */}
            {isBusinessCustomer && (
              <section className="flex gap-4">
                <div className="w-full">
                  <p>Job Title</p>
                  <input
                    autoComplete="off"
                    className={`h-[2rem] w-full p-2 text-black rounded-md ${
                      error.jobTitle
                        ? "border-2 border-red-500"
                        : "border border-gray-300 text-black"
                    }`}
                    placeholder="Enter your Job Title"
                    type="text"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                    style={{
                      color:
                        error.jobTitle && !formData.jobTitle
                          ? "#ef4444"
                          : "#000",
                    }}
                  />
                  {error.jobTitle && (
                    <p className="text-sm text-red-500 mt-1">
                      {error.jobTitle}
                    </p>
                  )}
                </div>
              </section>
            )}

            {/* Email and Password */}
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-bold text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg text-black"
                />
                {error.email && (
                  <p className="text-red-500 text-sm mt-1">{error.email}</p>
                )}
              </div>
              <div>
                <label className="block mb-1 text-sm font-bold text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg text-black"
                />
                {error.password && (
                  <p className="text-red-500 text-sm mt-1">{error.password}</p>
                )}
              </div>
            </section>
            {/* Phone Number */}
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-bold text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg text-black"
                />
                {error.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {error.phoneNumber}
                  </p>
                )}
              </div>
              <div>
                <label className="block mb-1 text-sm font-bold text-gray-700">
                  Street Address
                </label>
                <input
                  type="text"
                  name="streetAddress"
                  value={formData.streetAddress}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg text-black"
                />
                {error.streetAddress && (
                  <p className="text-red-500 text-sm mt-1">
                    {error.streetAddress}
                  </p>
                )}
              </div>
            </section>

            {/* city, province, postal code, country  */}
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-bold text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg text-black"
                />
                {error.city && (
                  <p className="text-red-500 text-sm mt-1">{error.city}</p>
                )}
              </div>
              <div>
                <label className="block mb-1 text-sm font-bold text-gray-700">
                  Province
                </label>
                <input
                  type="text"
                  name="province"
                  value={formData.province}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg text-black"
                />
                {error.province && (
                  <p className="text-red-500 text-sm mt-1">{error.province}</p>
                )}
              </div>
              <div>
                <label className="block mb-1 text-sm font-bold text-gray-700">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg text-black"
                />
                {error.postalCode && (
                  <p className="text-red-500 text-sm mt-1">
                    {error.postalCode}
                  </p>
                )}
              </div>
              <div>
                <label className="block mb-1 text-sm font-bold text-gray-700">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg text-black"
                />
                {error.country && (
                  <p className="text-red-500 text-sm mt-1">{error.country}</p>
                )}
              </div>
            </section>

            {/* terms and conditions */}
            <div className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1"
              />
              <label htmlFor="terms" className="text-gray-700">
                I agree to the{" "}
                <button
                  type="button"
                  onClick={() => setShowTerms(true)}
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  Terms & Conditions
                </button>
              </label>
            </div>
            {error.agreedToTerms && (
              <p className="text-red-500 text-sm mt-1">{error.agreedToTerms}</p>
            )}

            {showTerms && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-md max-h-[80vh] overflow-y-auto">
                  <h2 className="text-lg font-bold mb-4">Terms & Conditions</h2>
                  <ul className="list-disc pl-4 text-sm text-gray-700 space-y-2">
                    <h2>
                      <b>Terms & Conditions</b>
                    </h2>
                    <p>
                      At Eurofins Enviro-Works Inc, we have implemented a new
                      policy, which requires all clients to keep a credit card
                      on file, a convenient method of payment for any invoices
                      PAST 90 days. This information is kept confidential and
                      secure in our accounting department and payments to your
                      card will only be processed if invoice is overdue by 60
                      days (90 days of invoice date).
                    </p>
                    <li>
                      All invoices are to be <b>paid 30 days</b> from the date
                      of the invoice.
                    </li>
                    <li>
                      All accounts are due and payable in full 30 days from the
                      date of invoice unless an alternate arrangement has been
                      made.
                    </li>
                    <li>
                      The customer agrees to pay interest on past due account
                      balances at the rate of <b>1.5%</b> per month past 90 days
                      after the invoice date.
                    </li>
                    <li>
                      If an invoice is not paid within 30 days,{" "}
                      <b>Eurofins Enviro-Works Inc.</b> will process the payment
                      with this Credit Card info provided.
                    </li>
                    <li>
                      Unless Eurofins Enviro-Works Inc has received from the
                      Customers written notification of a disputed item within
                      60 days of the transaction date, the Customers will be
                      considered to have accepted responsibility for payment of
                      that item.
                    </li>
                    <li>
                      By providing <b>Eurofins Enviro-Works Inc.</b> with your
                      credit card, you are giving Eurofins Enviro- Works Inc.
                      permission to automatically charge your card for any
                      invoice past 90 days overdue.
                    </li>
                    <li>
                      In the event of a declined charge, Eurofins Enviro-Works
                      Inc. has the right to ask for a new credit card
                      number/payment method before services are continued.
                    </li>
                    <li>
                      By the accepting the <b>Terms & Conditions</b> by its
                      authorized representative below, the customer confirms
                      that this is the agreement it has made.
                    </li>
                  </ul>
                  <div className="mt-4 text-right">
                    <button
                      onClick={() => setShowTerms(false)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`rounded-lg px-4 py-2 font-bold w-full transition-transform duration-200 ease-in-out ${
                loading
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-enviro_orange hover:scale-[1.03] text-white"
              }`}
            >
              {loading ? (
                <LoadingIcon
                  className="h-full"
                  loadingRingStyles="border-enviro_blue h-[1.5rem] w-[1.5rem]"
                />
              ) : (
                <>Sign Up</>
              )}
            </button>
          </form>
        </div>
      </div>
    </FadeIn>
  );
}

export { Signup };

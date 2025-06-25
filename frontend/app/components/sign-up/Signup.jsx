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
        jobTitle: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({});
    const router = useRouter();
    const [isBusinessCustomer, setIsBusinessCustomer] = useState(false);

    const [showTerms, setShowTerms] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const executeSignup = async (apiPath, firstName, lastName, email, password, phoneNumber,
        streetAddress,
        city,
        province,
        postalCode,
        country,
        creditCard,
        jobTitle) => {
        setLoading(true);
        try {
            const response = await fetch(apiPath, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
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
                    job_title: isBusinessCustomer ? jobTitle : null
                })
            });

            if (response.ok) {
                const data = await response.json();

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
                setError({ general: "Signup failed! Please check your details." });
                setLoading(false);
            }
        } catch (error) {
            setError({ general: error.message || "Something went wrong. Please try again." });
            setLoading(false);
        }
    }

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
        const phoneDigits = formData.phoneNumber.replace(/\D/g, '');
 
        if (!formData.firstName.trim()) newErrors.firstName = "Please enter your first name.";
        if (!formData.lastName.trim()) newErrors.lastName = "Please enter your last name.";

        if (!formData.email.trim()) newErrors.email = "Please enter a valid email address.";
        else if (!emailRegex.test(formData.email)) newErrors.email = "Invalid email format (e.g., name@example.com).";

        if (!formData.password.trim()) newErrors.password = "Please enter a password.";
        else if (!passwordRegex.test(formData.password)) newErrors.password = "Minimum 6 characters, 1 uppercase, 1 number.";

        if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Please enter your phone number.";
        else if (!phoneRegex.test(phoneDigits)) {
        newErrors.phoneNumber = "Phone number must be 10 digits (e.g., 7805555555).";
        }

        
        if (!formData.streetAddress.trim()) newErrors.streetAddress = "Please enter your street address.";

        if (!formData.city.trim()) newErrors.city = "Please enter your city.";

        if (!formData.province.trim()) newErrors.province = "Please enter your province.";

        if (!formData.postalCode.trim()) newErrors.postalCode = "Please enter your postal code.";
        else if (!postalCodeRegex.test(formData.postalCode)) newErrors.postalCode = "Format must match e.g., A1A1A1.";

        if (!formData.country.trim()) newErrors.country = "Please enter your country.";

        if (!agreedToTerms) newErrors.agreedToTerms = "Please agree to the Terms & Conditions to continue.";

        if (isBusinessCustomer && !formData.jobTitle.trim()) newErrors.jobTitle = "Job Title is required for Business Customer";

        if (Object.keys(newErrors).length > 0) {
            setError(newErrors);
            return;
        }
        setLoading(true);
        setError({});

        await executeSignup(apiPath, formData.firstName, formData.lastName,
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
            <form
                className="bg-enviro_blue m-auto w-[40rem] p-[2rem] max-w-[40rem] h-[36rem] flex flex-col justify-between drop-shadow-lg text-white rounded-2xl transition-all hover:drop-shadow-2xl hover:scale-[101%] duration-300"
                onSubmit={handleSubmit}
            >
                <section className="flex flex-col h-auto justify-between">
                    <div className="flex justify-between">
                        <h1 className="text-white font-bold">{title || "Sign-Up"}</h1>
                        <h2 className="text-enviro_blue_xlight font-bold drop-shadow-2xl">
                            Enviro-Works
                        </h2>
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
                <section className="flex gap-4">
                    <div className="w-1/2">
                        <p>First Name</p>
                        <input
                            autoComplete="off"
                            className={`h-[2rem] w-full p-2 rounded-md ${error.firstName
                                ? "border-2 border-red-500"
                                : "border border-gray-300 text-black"
                                }`}
                            placeholder="Enter your First Name"
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            style={{
                                color: error.firstName && !formData.firstName ? "#ef4444" : "#000",
                            }}
                        />
                            {error.firstName && <p className="text-red-500 text-sm">{error.firstName}</p>}
                    </div>
                    <div className="w-1/2">
                        <p>Last Name</p>
                        <input
                            autoComplete="off"
                            className={`h-[2rem] w-full p-2 text-black rounded-md ${error.lastName ? "border-2 border-red-500"
                                : "border border-gray-300 text-black"
                                }`}
                            placeholder={error.lastName ? error.lastName : "Enter your Last Name"}
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            style={{
                                color: error.lastName && !formData.lastName ? "#ef4444" : "#000",
                            }}
                        />
                        {error.lastName && <p className="text-red-500 text-sm">{error.lastName}</p>}
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
                        <label htmlFor="business" className="ml-2">Business Customer</label>
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
                        <label htmlFor="individual" className="ml-2">Individual Customer</label>
                    </div>
                </section>

                {/* Job title for business customers */}
                {isBusinessCustomer && (
                    <section className="flex gap-4">
                        <div className="w-full">
                            <p>Job Title</p>
                            <input
                                autoComplete="off"
                                className={`h-[2rem] w-full p-2 text-black rounded-md ${error.jobTitle ? "border-2 border-red-500" : "border border-gray-300 text-black"
                                    }`}
                                placeholder="Enter your Job Title"
                                type="text"
                                name="jobTitle"
                                value={formData.jobTitle}
                                onChange={handleInputChange}
                                style={{
                                    color: error.jobTitle && !formData.jobTitle ? "#ef4444" : "#000",
                                }}
                            />
                            {error.jobTitle && <p className="text-sm text-red-500 mt-1">{error.jobTitle}</p>}
                        </div>
                    </section>
                )}

                {/* Email and Password */}
                <section className="flex gap-4">
                    <div className="w-1/2">
                        <p>Email</p>
                        <input
                            autoComplete="off"
                            className={`h-[2rem] w-full p-2 text-black rounded-md ${error.email ? "border-2 border-red-500" : "border border-gray-300 text-black"
                                }`}
                            placeholder={error.email ? error.email : "Enter your Email"}
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            style={{
                                color: error.email && !formData.email ? "#ef4444" : "#000",
                            }}
                        />
                        {error.email && <p className="text-red-500 text-sm">{error.email}</p>}

                    </div>
                    <div className="w-1/2">
                        <p>Password</p>
                        <input
                            autoComplete="off"
                            className={`h-[2rem] w-full p-2 text-black rounded-md ${error.password ? "border-2 border-red-500" : "border border-gray-300 text-black"
                                }`}
                            placeholder="Enter your Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            style={{
                                color: error.password && !formData.password ? "#ef4444" : "#000",
                            }}
                        />
                        {error.password && <p className="text-sm text-red-500 mt-1">{error.password}</p>}

                    </div>
                </section>

                {/* Phone Number */}
                <section className="flex gap-4">
                    <div className="w-1/2">
                        <p>Phone Number</p>
                        <input
                            autoComplete="off"
                            className={`h-[2rem] w-full p-2 text-black rounded-md ${error.phoneNumber ? "border-2 border-red-500" : "border border-gray-300 text-black"
                                }`}
                            placeholder={error.phoneNumber ? error.phoneNumber : "Enter your phone number"}
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            style={{
                                color: error.phoneNumber && !formData.phoneNumber ? "#ef4444" : "#000",
                            }}
                        />
                        {error.phoneNumber && <p className="text-sm text-red-500 mt-1">{error.phoneNumber}</p>}
                    </div>
                    {/** 
                    <div className="w-1/2">
                        <p>Credit Card (Optional)</p>
                        <input
                            autoComplete="off"
                            className="h-[2rem] w-full p-2 text-black rounded-md border border-gray-300 text-black"
                            placeholder={"Enter your Credit Card number"}
                            type="text"
                            name="creditCard"
                            value={formData.creditCard}
                            onChange={handleInputChange}
                            style={{ color: "#000" }}
                        />
                    </div>
                    */}
                </section>

                {/* Street Address */}
                <section className="flex gap-4">
                    <div className="w-1/2">
                        <p>Street Address</p>
                        <input
                            autoComplete="off"
                            className={`h-[2rem] w-full p-2 text-black rounded-md ${error.streetAddress ? "border-2 border-red-500" : "border border-gray-300 text-black"
                                }`}
                            placeholder={error.streetAddress ? error.streetAddress : "Enter your Address"}
                            type="text"
                            name="streetAddress"
                            value={formData.streetAddress}
                            onChange={handleInputChange}
                            style={{
                                color: error.streetAddress && !formData.streetAddress ? "#ef4444" : "#000",
                            }}
                        />
                        {error.streetAddress&& <p className="text-sm text-red-500 mt-1">{error.streetAddress}</p>}
                    </div>

                    <div className="w-1/2">
                        <p>City</p>
                        <input
                            autoComplete="off"
                            className={`h-[2rem] w-full p-2 text-black rounded-md ${error.city ? "border-2 border-red-500" : "border border-gray-300 text-black"
                                }`}
                            placeholder={error.city ? error.city : "Enter your City"}
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            style={{
                                color: error.city && !formData.city ? "#ef4444" : "#000",
                            }}
                        />
                        {error.city && <p className="text-sm text-red-500 mt-1">{error.city}</p>}
                    </div>
                </section>

                {/* State, country and postal code  */}
                <section className="flex gap-4 my-2">
                    <div className="w-1/3">
                        <p>Province</p>
                        <input
                            autoComplete="off"
                            className={`h-[2rem] w-full p-2 text-black rounded-md ${error.province ? "border-2 border-red-500" : "border border-gray-300 text-black"
                                }`}
                            placeholder={"Province"}
                            type="text"
                            name="province"
                            value={formData.province}
                            onChange={handleInputChange}
                            style={{
                                color: error.province && !formData.province ? "#ef4444" : "#000",
                            }}
                        />
                        {error.province && <p className="text-sm text-red-500 mt-1">{error.province}</p>}
                    </div>
                    <div className="w-1/3">
                        <p>Country</p>
                        <input
                            autoComplete="off"
                            className={`h-[2rem] w-full p-2 text-black rounded-md ${error.country ? "border-2 border-red-500" : "border border-gray-300 text-black"
                                }`}
                            placeholder="Country"
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            style={{
                                color: error.country && !formData.country ? "#ef4444" : "#000",
                            }}
                        />
                        {error.country && <p className="text-red-500 text-sm mt-1">{error.country}</p>}
                    </div>
                    <div className="w-1/3">
                        <p>Postal Code</p>
                        <input
                            autoComplete="off"
                            className={`h-[2rem] w-full p-2 text-black rounded-md ${error.postalCode ? "border-2 border-red-500" : "border border-gray-300 text-black"
                                }`}
                            placeholder="Postal Code"
                            type="text"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleInputChange}
                            style={{
                                color: error.postalCode && !formData.postalCode ? "#ef4444" : "#000",
                            }}
                        />
                        {error.postalCode && <p className="text-red-500 text-sm mt-1">{error.postalCode}</p>}
                    </div>
                    
                </section>

                <div className="flex items-center gap-2 mb-2">
                    <input
                        type="checkbox"
                        id="terms"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                    />
                    <label htmlFor="terms" className="text-sm">
                        I agree to the{" "}
                        <button
                            onClick={() => setShowTerms(true)}
                            className="text-sm text-white-600 underline hover:text-blue-800"
                        >
                            Terms & Conditions
                        </button>

                    </label>
                </div>
                {error.agreedToTerms && <p className="text-red-500 text-sm mb-2">{error.agreedToTerms}</p>}


                {showTerms && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-md max-h-[80vh] overflow-y-auto">
                            <h2 className="text-lg font-bold mb-4">Terms & Conditions</h2>
                            <ul className="list-disc pl-4 text-sm text-gray-700 space-y-2">
                                <h2><b>Terms & Conditions</b></h2>
                                <p>At Eurofins Enviro-Works Inc, we have implemented a new policy, which requires all clients to keep a credit card
                                    on file, a convenient method of payment for any invoices PAST 90 days. This information is kept confidential and
                                    secure in our accounting department and payments to your card will only be processed if invoice is overdue by 60
                                    days (90 days of invoice date).</p>
                                <li>
                                    All invoices are to be <b>paid 30 days</b> from the date of the invoice.
                                </li>
                                <li>All accounts are due and payable in full 30 days from the date of invoice unless an alternate
                                    arrangement has been made.</li>
                                <li>The customer agrees to pay interest on past due account balances at the rate of <b>1.5%</b> per month
                                    past 90 days after the invoice date.</li>
                                <li>If an invoice is not paid within 30 days, <b>Eurofins Enviro-Works Inc.</b> will process the payment with this Credit Card info
                                    provided.</li>
                                <li>Unless Eurofins Enviro-Works Inc has received from the Customers written notification of a
                                    disputed item within 60 days of the transaction date, the Customers will be considered to have
                                    accepted responsibility for payment of that item.</li>
                                <li>By providing <b>Eurofins Enviro-Works Inc.</b> with your credit card, you are giving Eurofins Enviro-
                                    Works Inc. permission to automatically charge your card for any invoice past 90 days overdue.</li>
                                <li>In the event of a declined charge, Eurofins Enviro-Works Inc. has the right to ask for a new credit
                                    card number/payment method before services are continued.</li>
                                <li>By the accepting the <b>Terms & Conditions</b> by its authorized representative below, the customer confirms that this is the
                                    agreement it has made.</li>
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
                    className={`rounded-md ${loading
                        ? "bg-enviro_blue_xlight"
                        : "bg-enviro_orange transition-all hover:scale-[101%] duration-300"
                        } flex justify-center p-2 text-white w-full border-2 shadow-2xl border-white font-bold`}
                >
                    {loading ? (
                        <LoadingIcon
                            className="h-full"
                            loadingRingStyles="border-enviro_blue h-[1.5rem] w-[1.5rem]"
                        />
                    ) : (
                        <>Sign-Up</>
                    )}
                </button>
            </form>
        </FadeIn>
    );
}

export { Signup };
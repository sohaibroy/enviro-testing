"use client";

import React from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

function UserInfo() {
    const {
        register,
        setValue,
        getValues,
        formState: { errors },
    } = useForm();

    const handleEmailRequest = () => {
        const data = getValues();

        const subject = "Request to Update User Information";
        const body = `Hello Enviro-Works Support,%0D%0A%0D%0AI would like to request an update to my information.%0D%0A%0D%0A{Please describe which information you want to update.}%0D%0A%0D%0AThank you.`;

        // Email to support team to make any changes.
        const gmailURL = `https://mail.google.com/mail/?view=cm&fs=1&to=info@enviro-works.com&su=${encodeURIComponent(subject)}&body=${body}`;

        window.open(gmailURL, '_blank'); 
    };

    useEffect(() => {
        const userData = sessionStorage.getItem("user");
        if (userData) {
            try {
                const user = JSON.parse(userData);
                console.log("User Data:", user);
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
            }
            catch (error) {
                console.error("Error fetching user data:", error);
            }
        }
    }, [setValue])


    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-6 pb-4 border-b-2 border-black">
                User Information
            </h1>
            {/* Notice Section */}
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-md">
                <p className="text-sm">
                    ⚠️ <strong>Note:</strong> If you want to edit or update any information,
                    please contact the administrator at <strong>Enviro-Works</strong> to
                    request changes.
                </p>
            </div>
            <form className="space-y-6">
                <div className="flex flex-wrap -mx-2">
                    {/* Name */}
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
                        {errors.first_name && (
                            <p className="text-red-600 text-xs">{errors.first_name.message}</p>
                        )}
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
                        {errors.last_name && (
                            <p className="text-red-600 text-xs">{errors.last_name.message}</p>
                        )}
                    </div>
                </div>

                {/* Phone Number & Job Title */}
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
                        {errors.phone_number && (
                            <p className="text-red-600 text-xs">{errors.phone_number.message}</p>
                        )}
                    </div>

                    <div className="w-full md:w-1/2 px-2">
                        <label htmlFor="job_title" className="block text-sm font-medium text-gray-700">
                            Job Title
                        </label>
                        <input
                            id="job_title"
                            type="text"
                            {...register("job_title", { required: "Job Title is required" })}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                        {errors.job_title && (
                            <p className="text-red-600 text-xs">{errors.job_title.message}</p>
                        )}
                    </div>
                </div>

                {/* Email */}
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
                    {errors.email && (
                        <p className="text-red-600 text-xs">{errors.email.message}</p>
                    )}
                </div>

                {/* Address */}
                <div className="flex flex-wrap -mx-2">
                    <div className="w-full md:w-1/2 px-2">
                        <label htmlFor="street_address" className="block text-sm font-medium text-gray-700">
                            Street Address
                        </label>
                        <input
                            id="street_address"
                            type="text"
                            {...register("street_address", { required: "Street Address is required" })}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                        {errors.street_address && (
                            <p className="text-red-600 text-xs">{errors.street_address.message}</p>
                        )}
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
                        {errors.city && (
                            <p className="text-red-600 text-xs">{errors.city.message}</p>
                        )}
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
                            {...register("province", { required: "State is required" })}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                        {errors.province && (
                            <p className="text-red-600 text-xs">{errors.province.message}</p>
                        )}
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
                        {errors.postal_code && (
                            <p className="text-red-600 text-xs">{errors.postal_code.message}</p>
                        )}
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
                        {errors.country && (
                            <p className="text-red-600 text-xs">{errors.country.message}</p>
                        )}
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleEmailRequest}
                    className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md transition-all duration-300 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Request Update via Email
                </button>
            </form>
        </div>
    )
}

export default UserInfo;

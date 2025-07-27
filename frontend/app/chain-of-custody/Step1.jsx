'use client';

import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

export default function Step1({ onNext }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useFormContext();

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setValue("firstName", user.first_name || "");
      setValue("lastName", user.last_name || "");
      setValue("email", user.email || "");
      setValue("phone", user.phone_number || "");
    }
  }, [setValue]);

  return (
    <div className="w-full max-w-xl bg-white shadow-xl p-10 rounded-2xl mx-auto space-y-6 overflow-y-auto max-h-[calc(100vh-12rem)]">
      <h2 className="text-3xl font-semibold text-center text-gray-800">
        Step 1: Contact Information
      </h2>

      {/* Lab Client */}
      <div className="space-y-2">
        <label className="block text-lg font-medium text-gray-700">
          Lab Client <span className="text-red-500">*</span>
        </label>
        <p className="text-sm text-gray-500">Enter the name of your company or organization.</p>
        <input
          {...register('labClient', {
            required: 'Lab client is required',
          })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.labClient && <p className="text-red-600 text-sm">{errors.labClient.message}</p>}
      </div>

      {/* First Name */}
      <div className="space-y-2">
        <label className="block text-lg font-medium text-gray-700">
          First Name <span className="text-red-500">*</span>
        </label>
        <p className="text-sm text-gray-500">Provide the first name of the primary contact person.</p>
        <input
          {...register('firstName', {
            required: 'First name is required',
          })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.firstName && <p className="text-red-600 text-sm">{errors.firstName.message}</p>}
      </div>

      {/* Last Name */}
      <div className="space-y-2">
        <label className="block text-lg font-medium text-gray-700">
          Last Name <span className="text-red-500">*</span>
        </label>
        <p className="text-sm text-gray-500">Provide the last name of the primary contact person.</p>
        <input
          {...register('lastName', {
            required: 'Last name is required',
          })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.lastName && <p className="text-red-600 text-sm">{errors.lastName.message}</p>}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label className="block text-lg font-medium text-gray-700">Email Address</label>
        <p className="text-sm text-gray-500">We'll use this email to send updates and confirmations.</p>
        <input
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Invalid email format',
            },
          })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <label className="block text-lg font-medium text-gray-700">Phone Number</label>
        <p className="text-sm text-gray-500">Enter a 10-digit phone number (e.g., 7801234567).</p>
        <input
          {...register('phone', {
            required: 'Phone number is required',
            pattern: {
              value: /^\d{10}$/,
              message: 'Enter a 10-digit phone number (no dashes or spaces)',
            },
          })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.phone && <p className="text-red-600 text-sm">{errors.phone.message}</p>}
      </div>

      {/* Fax */}
      <div className="space-y-2">
        <label className="block text-lg font-medium text-gray-700">Fax (optional)</label>
        <p className="text-sm text-gray-500">Optional. Only if your lab requires fax communication.</p>
        <input
          {...register('fax')}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Continue Button */}
      <div className="text-right pt-4">
        <button
          type="button"
          onClick={handleSubmit(onNext)}
          className="bg-enviro_blue hover:bg-blue-700 text-white text-lg px-6 py-3 rounded-lg transition-all"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

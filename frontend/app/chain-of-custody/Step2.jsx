'use client';

import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

export default function Step2({ onNext, onBack }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useFormContext();

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    const storedCompany = sessionStorage.getItem("company_name");

    if (storedUser) {
      const user = JSON.parse(storedUser);
      setValue("city", user.city || "");
      setValue("province", user.province || "");
      setValue("postalCode", user.postal_code || "");
      setValue("siteAddress", user.street_address || "");
      setValue("country", "Canada");
    }

    if (storedCompany) {
      setValue("companyName", storedCompany);
    }
  }, [setValue]);

  return (
  <div className="w-full max-w-xl bg-white shadow-xl p-10 rounded-2xl mx-auto space-y-6 overflow-y-auto max-h-[calc(100vh-12rem)]">
    <h2 className="text-2xl sm:text-3xl font-semibold text-center text-gray-800">
      Step 2: Project & Location
    </h2>

        {/* Project Name */}
        <div className="space-y-2">
          <label className="block text-lg font-medium text-gray-700">Project Name</label>
          <p className="text-sm text-gray-500">Give your project a descriptive name for tracking.</p>
          <input
            {...register('projectName', { required: 'Project name is required' })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.projectName && <p className="text-red-600 text-sm">{errors.projectName.message}</p>}
        </div>

        {/* Street Address */}
        <div className="space-y-2">
          <label className="block text-lg font-medium text-gray-700">Street Address</label>
          <p className="text-sm text-gray-500">Exact address where the testing or sampling will occur.</p>
          <input
            {...register('siteAddress', { required: 'Street address is required' })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.siteAddress && <p className="text-red-600 text-sm">{errors.siteAddress.message}</p>}
        </div>

        {/* City */}
        <div className="space-y-2">
          <label className="block text-lg font-medium text-gray-700">City</label>
          <p className="text-sm text-gray-500">City where the site is located.</p>
          <input
            {...register('city', { required: 'City is required' })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.city && <p className="text-red-600 text-sm">{errors.city.message}</p>}
        </div>

        {/* Province */}
        <div className="space-y-2">
          <label className="block text-lg font-medium text-gray-700">Province</label>
          <p className="text-sm text-gray-500">E.g., Alberta, Ontario, etc.</p>
          <input
            {...register('province', { required: 'Province is required' })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.province && <p className="text-red-600 text-sm">{errors.province.message}</p>}
        </div>

        {/* Postal Code */}
        <div className="space-y-2">
          <label className="block text-lg font-medium text-gray-700">Postal Code</label>
          <p className="text-sm text-gray-500">Format: A1A 1A1</p>
          <input
            {...register('postalCode', {
              required: 'Postal code is required',
              pattern: {
                value: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
                message: 'Invalid Canadian postal code format',
              },
            })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.postalCode && <p className="text-red-600 text-sm">{errors.postalCode.message}</p>}
        </div>

        {/* Country */}
        <div className="space-y-2">
          <label className="block text-lg font-medium text-gray-700">Country</label>
          <p className="text-sm text-gray-500">Country where the project is located.</p>
          <input
            {...register('country', { required: 'Country is required' })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.country && <p className="text-red-600 text-sm">{errors.country.message}</p>}
        </div>

       {/* Date */}
<div className="space-y-2">
  <label className="block text-lg font-medium text-gray-700">Date</label>
  <p className="text-sm text-gray-500">Select the project start or sampling date.</p>
  <input
    type="date"
    min={new Date().toLocaleDateString('en-CA')}
    {...register('date', {
      required: 'Date is required',
      validate: (value) => {
        const [year, month, day] = value.split('-');
        const selected = new Date(year, month - 1, day);
        const today = new Date();
        selected.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        return selected >= today || 'Date cannot be in the past';
      },
    })}
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
  {errors.date && <p className="text-red-600 text-sm">{errors.date.message}</p>}
</div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={onBack}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-lg px-6 py-3 rounded-lg transition-all"
          >
            Back
          </button>
        <button
        type="button"
        onClick={handleSubmit(() => onNext(4))} // change to step 4
        className="bg-enviro_blue hover:bg-blue-700 text-white text-lg px-6 py-3 rounded-lg transition-all"
        >
        Continue
        </button>

        </div>
      </div>
  );
}
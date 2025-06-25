'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';

export default function Step2({ onNext, onBack }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="w-full max-w-xl bg-white shadow-xl p-10 rounded-2xl space-y-6">
      <h2 className="text-3xl font-semibold text-center text-gray-800">Step 2: Project Information</h2>

      {/* Company Name */}
      <div className="space-y-2">
        <label className="block text-lg font-medium text-gray-700">Company Name</label>
        <input
          {...register('companyName', {
            required: 'Company name is required',
          })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.companyName && <p className="text-red-600 text-sm">{errors.companyName.message}</p>}
      </div>

      {/* Project Name */}
      <div className="space-y-2">
        <label className="block text-lg font-medium text-gray-700">Project Name</label>
        <input
          {...register('projectName', {
            required: 'Project name is required',
          })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.projectName && <p className="text-red-600 text-sm">{errors.projectName.message}</p>}
      </div>

      {/* Site Address */}
      <div className="space-y-2">
        <label className="block text-lg font-medium text-gray-700">Site Address</label>
        <input
          {...register('siteAddress', {
            required: 'Site address is required',
          })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.siteAddress && <p className="text-red-600 text-sm">{errors.siteAddress.message}</p>}
      </div>

      {/* City */}
      <div className="space-y-2">
        <label className="block text-lg font-medium text-gray-700">City</label>
        <input
          {...register('city', {
            required: 'City is required',
          })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.city && <p className="text-red-600 text-sm">{errors.city.message}</p>}
      </div>

      {/* Province */}
      <div className="space-y-2">
        <label className="block text-lg font-medium text-gray-700">Province</label>
        <input
          {...register('province', {
            required: 'Province is required',
          })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.province && <p className="text-red-600 text-sm">{errors.province.message}</p>}
      </div>

      {/* Postal Code */}
      <div className="space-y-2">
        <label className="block text-lg font-medium text-gray-700">Postal Code</label>
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
          onClick={handleSubmit(onNext)}
          className="bg-enviro_blue hover:bg-blue-700 text-white text-lg px-6 py-3 rounded-lg transition-all"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

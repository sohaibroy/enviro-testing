'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';

export default function Step4({ onNext, onBack }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="w-full max-w-xl bg-white shadow-xl p-10 rounded-2xl space-y-6">
      <h2 className="text-3xl font-semibold text-center text-gray-800">Step 4: Site & Billing Info</h2>

      {/* Site Address */}
      <div className="space-y-2">
        <label className="block text-lg font-medium text-gray-700">Site Address</label>
        <input
          {...register('siteAddress', {
            required: 'Site address is required',
            minLength: { value: 5, message: 'Address must be at least 5 characters' },
          })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.siteAddress && <p className="text-red-600 text-sm">{errors.siteAddress.message}</p>}
      </div>

      {/* Site City */}
      <div className="space-y-2">
        <label className="block text-lg font-medium text-gray-700">Site City</label>
        <input
          {...register('siteCity', {
            required: 'Site city is required',
          })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.siteCity && <p className="text-red-600 text-sm">{errors.siteCity.message}</p>}
      </div>

      {/* Site Postal Code */}
      <div className="space-y-2">
        <label className="block text-lg font-medium text-gray-700">Site Postal Code</label>
        <input
          {...register('sitePostalCode', {
            required: 'Postal code is required',
            pattern: {
              value: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
              message: 'Enter a valid Canadian postal code',
            },
          })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.sitePostalCode && <p className="text-red-600 text-sm">{errors.sitePostalCode.message}</p>}
      </div>

      {/* Billing Address (Optional) */}
      <div className="space-y-2">
        <label className="block text-lg font-medium text-gray-700">Billing Address (Optional)</label>
        <input
          {...register('billingAddress')}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 text-lg px-6 py-3 rounded-lg transition-all"
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

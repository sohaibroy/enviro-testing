'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';

export default function Step3({ onNext, onBack }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useFormContext();

  // Helper to get today’s date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="w-full max-w-xl bg-white shadow-xl p-10 rounded-2xl space-y-6">
      <h2 className="text-3xl font-semibold text-center text-gray-800">Step 3: Sample Pickup Info</h2>

      {/* Pickup Date */}
      <div className="space-y-2">
        <label className="block text-lg font-medium text-gray-700">Pickup Date</label>
        <input
          type="date"
          min={today}
          {...register('pickupDate', {
            required: 'Pickup date is required',
            validate: value =>
              new Date(value) >= new Date(today) || 'Pickup date cannot be in the past',
          })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.pickupDate && <p className="text-red-600 text-sm">{errors.pickupDate.message}</p>}
      </div>

      {/* Pickup Time */}
      <div className="space-y-2">
        <label className="block text-lg font-medium text-gray-700">Pickup Time</label>
        <input
          type="time"
          step="900" // 15-minute increments
          {...register('pickupTime', {
            required: 'Pickup time is required',
          })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.pickupTime && <p className="text-red-600 text-sm">{errors.pickupTime.message}</p>}
      </div>

      {/* PO Number (Optional) */}
      <div className="space-y-2">
        <label className="block text-lg font-medium text-gray-700">PO Number (Optional)</label>
        <input
          {...register('poNumber')}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Onsite Contact Name */}
      <div className="space-y-2">
        <label className="block text-lg font-medium text-gray-700">Onsite Contact Name</label>
        <input
          {...register('onsiteContactName', {
            required: 'Onsite contact name is required',
          })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.onsiteContactName && (
          <p className="text-red-600 text-sm">{errors.onsiteContactName.message}</p>
        )}
      </div>

      {/* Onsite Phone Number */}
      <div className="space-y-2">
        <label className="block text-lg font-medium text-gray-700">Onsite Phone Number</label>
        <input
          {...register('onsitePhone', {
            required: 'Onsite phone number is required',
            pattern: {
              value: /^\d{10}$/,
              message: 'Enter a 10-digit phone number (no dashes or spaces)',
            },
          })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.onsitePhone && <p className="text-red-600 text-sm">{errors.onsitePhone.message}</p>}
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

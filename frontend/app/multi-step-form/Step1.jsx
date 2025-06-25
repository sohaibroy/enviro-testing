'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';

export default function Step1({ onNext }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="w-full max-w-xl bg-white shadow-xl p-10 rounded-2xl space-y-6">
      <h2 className="text-3xl font-semibold text-center text-gray-800">Step 1: Contact Information</h2>

      {/* Contact Name */}
      <div className="space-y-2">
        <label className="block text-lg font-medium text-gray-700">Contact Name</label>
        <input
          {...register('contactName', {
            required: 'Contact name is required',
            minLength: { value: 3, message: 'Minimum 3 characters' },
          })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.contactName && <p className="text-red-600 text-sm">{errors.contactName.message}</p>}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label className="block text-lg font-medium text-gray-700">Email Address</label>
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

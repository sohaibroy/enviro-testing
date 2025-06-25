'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';

export default function Step5({ onNext, onBack }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="w-full max-w-xl bg-white shadow-xl p-10 rounded-2xl space-y-6">
      <h2 className="text-3xl font-semibold text-center text-gray-800">Step 5: Equipment Rental</h2>

      {/* Sample Type */}
      <div className="space-y-2">
        <label className="block text-lg font-medium text-gray-700">Sample Type</label>
        <input
          {...register('sampleType', {
            required: 'Sample type is required',
          })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.sampleType && <p className="text-red-600 text-sm">{errors.sampleType.message}</p>}
      </div>

      {/* Container Type */}
      <div className="space-y-2">
        <label className="block text-lg font-medium text-gray-700">Container Type</label>
        <input
          {...register('containerType', {
            required: 'Container type is required',
          })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.containerType && <p className="text-red-600 text-sm">{errors.containerType.message}</p>}
      </div>

      {/* Number of Containers */}
      <div className="space-y-2">
        <label className="block text-lg font-medium text-gray-700">Number of Containers</label>
        <input
          type="number"
          min="1"
          {...register('containerCount', {
            required: 'Number of containers is required',
            min: { value: 1, message: 'Must be at least 1' },
          })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.containerCount && <p className="text-red-600 text-sm">{errors.containerCount.message}</p>}
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

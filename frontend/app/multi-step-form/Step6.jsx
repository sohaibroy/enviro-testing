'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Edit } from '@mui/icons-material';
import Button from '@mui/material/Button';

export default function Step6({ onBack, onSubmit, onStepChange }) {
  const { getValues, setValue } = useFormContext();
  const values = getValues();

  const analytePrice = 50; // Placeholder per analyte
  const equipmentPrice = 100; // Placeholder per equipment

  const analyteCount = values.analytes?.length || 0;
  const equipmentCount = values.equipment?.length || 0;

  const subtotal = analyteCount * analytePrice + equipmentCount * equipmentPrice;
  const gst = subtotal * 0.05;
  const total = subtotal + gst;

  // Default to today's date if not already set
  const orderDate = values.orderDate || new Date().toLocaleDateString();
  setValue('orderDate', orderDate);

  // Default payment method (placeholder for now)
  const paymentMethod = values.paymentMethod || 'Credit Card';
  setValue('paymentMethod', paymentMethod);

  return (
    <div className="w-full max-w-5xl mx-auto">

      <div className="bg-white shadow-md rounded-lg p-8 relative space-y-6">
        <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>

        {/* Contact Info */}
        <div className="flex justify-between items-center">
          <div className="text-gray-700 space-y-1">
            <p><strong>Name:</strong> {values.name}</p>
            <p><strong>Email:</strong> {values.email}</p>
            <p><strong>Phone:</strong> {values.phone}</p>
          </div>
          <button
            className="bg-enviro_blue text-white p-2 rounded hover:bg-blue-700 transition"
            onClick={() => onStepChange(1)}
          >
            <Edit />
          </button>
        </div>

        <hr />

        {/* Analytes */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold mb-2">Analytes Selected</h3>
            <ul className="list-disc list-inside text-gray-700">
              {values.analytes && values.analytes.map((analyte, index) => (
                <li key={index}>{analyte}</li>
              ))}
            </ul>
          </div>
          <button
            className="bg-enviro_blue text-white p-2 rounded hover:bg-blue-700 transition"
            onClick={() => onStepChange(4)}
          >
            <Edit />
          </button>
        </div>

        <hr />

        {/* Equipment */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold mb-2">Equipment Rental</h3>
            <ul className="list-disc list-inside text-gray-700">
              {values.equipment && values.equipment.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          <button
            className="bg-enviro_blue text-white p-2 rounded hover:bg-blue-700 transition"
            onClick={() => onStepChange(5)}
          >
            <Edit />
          </button>
        </div>

        <hr />

        {/* Pricing Breakdown */}
        <div className="text-gray-700 space-y-2">
          <h3 className="text-lg font-semibold mb-2">Pricing Breakdown</h3>
          <p><strong>Subtotal:</strong> ${subtotal.toFixed(2)}</p>
          <p><strong>GST (5%):</strong> ${gst.toFixed(2)}</p>
          <p className="text-lg font-bold"><strong>Total:</strong> ${total.toFixed(2)}</p>
        </div>

        <hr />

        {/* Order Date + Payment Method */}
        <div className="text-gray-700 space-y-2">
          <h3 className="text-lg font-semibold mb-2">Additional Details</h3>
          <p><strong>Order Date:</strong> {orderDate}</p>
          <p><strong>Payment Method:</strong> {paymentMethod}</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={onBack}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 text-lg px-6 py-3 rounded-lg transition-all"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onSubmit}
          className="bg-enviro_blue hover:bg-blue-700 text-white text-lg px-6 py-3 rounded-lg transition-all"
        >
          Submit Order
        </button>
      </div>

    </div>
  );
}

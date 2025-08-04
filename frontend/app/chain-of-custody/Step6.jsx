'use client';

import React, { useState, useEffect } from 'react';
import QuantityDetails from '../components/quantity-details/QuantityDetails';
import { useFormContext } from 'react-hook-form';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Step6({ onBack, onNext }) {
  const [quantityData, setQuantityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setValue } = useFormContext();

  const [additionalFields, setAdditionalFields] = useState({
    required_quantity: 1,
    required_pumps: 0,
    required_media: 0,
    customer_comment: '',
  });

  useEffect(() => {
    const selectedMethodId = sessionStorage.getItem('selectedMethodId');
    if (!selectedMethodId) {
      setError('No method selected. Please go back and select a method.');
      setLoading(false);
      return;
    }

    fetch(`${baseUrl}/api/quantity-details/${selectedMethodId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setQuantityData(data);
        setLoading(false);
      })
      .catch((e) => {
        console.error('Failed to fetch quantity details:', e);
        setError('Failed to load quantity details. Please try again.');
        setLoading(false);
      });
  }, []);

  const handleContinue = () => {
    const selectedAnalyte = JSON.parse(sessionStorage.getItem('selectedAnalyte'));
    const selectedMethod = JSON.parse(sessionStorage.getItem('selectedMethod'));
    const turnaround = JSON.parse(sessionStorage.getItem('selectedTurnaround')) || { id: 1, label: 'N/A' };
    const price = sessionStorage.getItem('selectedPrice') || null;
    const editIndex = sessionStorage.getItem('editIndex');

    if (!selectedAnalyte || !selectedMethod) {
      alert('Missing analyte or method');
      return;
    }

    const newSelection = {
      analyte: selectedAnalyte.analyte_name,
      method: selectedMethod.method_name,
      turnaround, // includes { id, label }
      price,
      required_quantity: additionalFields.required_quantity,
      required_pumps: additionalFields.required_pumps || 0,
      required_media: additionalFields.required_media || 0,
      customer_comment: additionalFields.customer_comment || '',
    };

    let storedSelections = JSON.parse(sessionStorage.getItem('orderSelections')) || [];

    if (editIndex !== null) {
      storedSelections[parseInt(editIndex)] = newSelection;
      sessionStorage.removeItem('editIndex');
    } else {
      const isDuplicate = storedSelections.some(
        (s) =>
          s.analyte === newSelection.analyte &&
          s.method === newSelection.method &&
          s.turnaround?.id === newSelection.turnaround?.id
      );
      if (!isDuplicate) {
        storedSelections.push(newSelection);
      }
    }

    sessionStorage.setItem('orderSelections', JSON.stringify(storedSelections));
    setValue('orderSelections', storedSelections);
    onNext();
  };

  return (
    <div className="w-full px-4 py-10 max-w-5xl mx-auto mb-16 md:mb-24">
      <div className="bg-white shadow-xl rounded-2xl p-6 md:p-10 space-y-6 min-h-screen pb-24">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center text-gray-800">
          Step 5: Select Quantity & Turnaround
        </h2>

        {loading ? (
          <p className="text-center text-gray-600">Loading quantity details...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : quantityData ? (
          <QuantityDetails
            quantityData={quantityData}
            onSelectOptions={(data) => {
              // Save additional fields from QuantityDetails
              setAdditionalFields({
                required_quantity: data.required_quantity || 1,
                required_pumps: data.required_pumps || 0,
                required_media: data.required_media || 0,
                customer_comment: data.customer_comment || '',
              });

              // Store turnaround & price in sessionStorage
              sessionStorage.setItem('selectedTurnaround', JSON.stringify(data.turnaround));
              sessionStorage.setItem('selectedPrice', data.price);
            }}
          />
        ) : (
          <p className="text-center text-gray-600">No quantity details available.</p>
        )}

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={onBack}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 text-lg px-6 py-3 rounded-lg transition-all"
          >
            Back
          </button>

          {!loading && !error && quantityData && (
            <button
              type="button"
              onClick={handleContinue}
              className="bg-enviro_blue hover:bg-blue-700 text-white text-lg px-6 py-3 rounded-lg transition-all"
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
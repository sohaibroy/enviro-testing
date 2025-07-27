'use client';

import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import MethodCardList from '../components/methods/MethodCardList';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Step5({ onNext, onBack }) {
  const [methods, setMethods] = useState([]);
  const [analyte, setAnalyte] = useState(null);
  const { setValue } = useFormContext();

  useEffect(() => {
    const analyteId = sessionStorage.getItem('selectedAnalyteId');
    if (!analyteId) return;

    fetch(`${baseUrl}/api/methods/${analyteId}`)
      .then((res) => res.json())
      .then((data) => {
        setMethods(data);
        if (data.length > 0) {
          setAnalyte({ analyte_name: data[0].analyte_name });
        }
      });
  }, []);

  const handleSelectMethod = (method) => {
    sessionStorage.setItem('selectedMethodId', method.method_id);
    sessionStorage.setItem('selectedMethod', JSON.stringify(method));
    sessionStorage.removeItem('selectedTurnaround');
    sessionStorage.removeItem('selectedPrice');

    setValue('selectedMethod', method.method_name);
    onNext();
  };

  return (
   <div className="w-screen overflow-x-hidden">
  <div className="max-w-screen-xl mx-auto px-4 sm:px-6 md:px-10 py-10 space-y-10 mb-10">
    <h2 className="text-2xl sm:text-3xl font-semibold text-center text-gray-800">
      Step 4: Select a Method
    </h2>

    {methods.length > 0 && analyte ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {methods.map((method) => (
          <MethodCardList
            key={method.method_id}
            method={method}
            analyte={analyte}
            onSelectMethod={handleSelectMethod}
          />
        ))}
      </div>
    ) : (
      <p className="text-center text-gray-500">Loading methods...</p>
    )}

    {/* Buttons */}
    <div className="flex flex-col md:flex-row flex-wrap justify-between gap-4 pt-6">
      <button
        type="button"
        onClick={onBack}
        className="w-full md:w-auto bg-gray-300 hover:bg-gray-400 text-gray-800 text-lg px-6 py-3 rounded-lg transition-all"
      >
        Back
      </button>

      <button
        type="button"
        onClick={onNext}
        className="w-full md:w-auto bg-orange-400 hover:bg-orange-600 text-white text-lg px-6 py-3 rounded-lg transition-all"
      >
        Skip
      </button>

      <button
        type="submit"
        className="w-full md:w-auto bg-enviro_blue hover:bg-blue-700 text-white text-lg px-6 py-3 rounded-lg transition-all"
      >
        Continue
      </button>
    </div>
  </div>
</div>
  );
}
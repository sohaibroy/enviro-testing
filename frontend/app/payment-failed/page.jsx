'use client'; // only if using App Router

import React from 'react';
import { XCircle } from 'lucide-react';

export default function PaymentFailed() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg text-center">
        <div className="flex justify-center mb-4">
          <XCircle className="text-red-500 w-16 h-16" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-red-600 mb-3">
          Payment Failed
        </h1>
        <p className="text-gray-700 text-base sm:text-lg">
          Why DID YOU PRESS CANCEL OR BACK BUTTON ON STRIPE PAGE WHYYYY!
        </p>
        <p className="text-gray-500 text-sm sm:text-base mt-2">
          Your can have another try on this transaction, just click try again
        </p>
        <div className="mt-6">
 <button
  onClick={() => {
    sessionStorage.setItem('currentStep', '8');
    window.location.href = '/chain-of-custody';
  }}
  className="inline-block bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition"
>
  Try Again
</button>
        </div>
      </div>
    </div>
  );
}
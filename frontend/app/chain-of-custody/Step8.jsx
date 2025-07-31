'use client';

import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Edit, Delete } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

export default function Step8({ onBack, onStepChange }) {
  const router = useRouter();
  const { getValues, setValue } = useFormContext();
  const values = getValues();

  const [cartItems, setCartItems] = useState([]);
  const [selections, setSelections] = useState([]);
  const [submitting, setSubmitting] = useState(false);

useEffect(() => {
  refreshCartItems();

  const saved = sessionStorage.getItem('orderSelections');
  if (saved) {
    setSelections(JSON.parse(saved));
  }

  // user info 
  const userJson = sessionStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;
  const formValues = getValues();

  if (user) {
    if (!formValues.firstName) setValue('firstName', user.first_name);
    if (!formValues.lastName) setValue('lastName', user.last_name);
    if (!formValues.email) setValue('email', user.email);
    if (!formValues.phone) setValue('phone', user.phone_number);
  }
}, []);

  const refreshCartItems = () => {
    const storedCart = JSON.parse(sessionStorage.getItem('rentalCart')) || [];
    setCartItems(storedCart);
  };

  const analyteTotal = selections.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
  const equipmentTotal = cartItems.reduce((sum, item) => {
    const startDate = new Date(item.StartDate);
    const endDate = new Date(item.ReturnDate);
    const rentalDays = Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)));
    return sum + (rentalDays * (item.DailyCost || 0) * (item.Quantity || 0));
  }, 0);

  const subtotal = analyteTotal + equipmentTotal;
  const gst = subtotal * 0.05;
  const total = subtotal + gst;

  const orderDate = values.orderDate || new Date().toLocaleDateString();
  setValue('orderDate', orderDate);
  const paymentMethod = values.paymentMethod || 'Credit Card';
  setValue('paymentMethod', paymentMethod);

 const handleFinalSubmit = async () => {
  if (selections.length === 0 && cartItems.length === 0) {
    alert('You must select at least one analyte or equipment item.');
    return;
  }

  if (!confirm('Are you sure you want to submit this order?')) return;

  setSubmitting(true);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  console.log("🚀 Starting Order Submit Flow");
  console.log("🌐 BASE URL =", baseUrl);
  console.log("🧪 Selections =", selections);
  console.log("🧰 Cart Items =", cartItems);

  try {
    // Step 1: Fetch CSRF cookie (optional)
    console.log("🔐 [1] Fetching CSRF cookie...");
    await fetch(`${baseUrl}/sanctum/csrf-cookie`, {
      credentials: 'include',
    });

    const xsrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1];

    if (!xsrfToken) {
      console.warn("⚠️ CSRF token not found in cookies. Continuing with CSRF disabled (bypass must exist).");
    }

    const userJson = sessionStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;

    // Step 2: Create Transaction
    const transactionPayload = {
      transaction: { subtotal, gst, total_amount: total },
      account: {
        first_name: user?.first_name ?? '',
        last_name: user?.last_name ?? '',
        email: user?.email ?? '',
        phone_number: user?.phone_number ?? '',
        street_address: user?.street_address ?? '',
        city: user?.city ?? '',
        province: user?.province ?? '',
        postal_code: user?.postal_code ?? '',
        country: user?.country ?? '',
        cardholder_name: `${user?.first_name ?? ''} ${user?.last_name ?? ''}`,
      },
    };

    console.log("💳 [2] Creating transaction at:", `${baseUrl}/api/transactions/create`);
    console.log("📦 Transaction Payload:", transactionPayload);

    const transactionRes = await fetch(`${baseUrl}/api/transactions/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(xsrfToken && { 'X-XSRF-TOKEN': decodeURIComponent(xsrfToken) }),
      },
      credentials: 'include',
      body: JSON.stringify(transactionPayload),
    });

    console.log("✅ [2] Transaction response status:", transactionRes.status);
    const transactionData = await transactionRes.json();
    console.log("📥 [2] Transaction response body:", transactionData);

    const transactionId = transactionData.transaction_id;
    if (!transactionId) throw new Error('❌ Missing transaction_id in response');
    sessionStorage.setItem('transactionId', transactionId);

    // Step 3: Stripe Checkout
    const stripePayload = {
      amount: Math.round(total * 100),
      transaction_id: transactionId,
      user: {
        first_name: user?.first_name ?? '',
        last_name: user?.last_name ?? '',
        email: user?.email ?? '',
      },
      analytes: selections.map(s => ({
        analyte: s.analyte,
        method: s.method,
        turnaround_time_id: s.turnaround?.id ?? null,
        price: s.price,
      })),
      equipment: cartItems.map(e => ({
        equipment_id: e.EquipmentID,
        start_date: e.StartDate,
        return_date: e.ReturnDate,
        quantity: e.Quantity,
        daily_cost: e.DailyCost,
      })),
    };

    console.log("💳 [3] Creating Stripe session at:", `${baseUrl}/api/create-checkout-session`);
    console.log("📦 Stripe Payload:", stripePayload);

    const stripeRes = await fetch(`${baseUrl}/api/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(xsrfToken && { 'X-XSRF-TOKEN': decodeURIComponent(xsrfToken) }),
      },
      credentials: 'include',
      body: JSON.stringify(stripePayload),
    });

    console.log("✅ [3] Stripe response status:", stripeRes.status);
    const stripeData = await stripeRes.json();
    console.log("📥 [3] Stripe response body:", stripeData);

    if (!stripeData?.url) {
      throw new Error('❌ Stripe session did not return a redirect URL.');
    }

    // Step 4: Redirect
    console.log("🚀 [4] Redirecting to Stripe URL:", stripeData.url);
    window.location.href = stripeData.url;

  } catch (err) {
    console.error('[ERROR] Order flow failed:', err);
    alert(err.message || 'Something went wrong while submitting the order.');
  }

  setSubmitting(false);
};

  const handleDelete = (indexToDelete) => {
    const confirmed = confirm("Are you sure you want to delete this analyte?");
    if (!confirmed) return;
    const updated = selections.filter((_, i) => i !== indexToDelete);
    setSelections(updated);
    sessionStorage.setItem("orderSelections", JSON.stringify(updated));
  };

  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
    {/* Left Coloumn*/}
    <div className="lg:col-span-2 bg-white shadow-md rounded-lg p-8 space-y-6 overflow-y-auto max-h-[80vh]">
        <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>

        {/* Contact Info */}
         <div className="border border-gray-200 rounded-md p-4 text-gray-700 mb-4">
         <div className="flex justify-between items-center mb-4">
         <h3 className="text-lg font-semibold mb-2">Contact Details</h3>
         <button
              className="w-9 h-9 flex items-center justify-center bg-enviro_blue text-white p-2 rounded hover:bg-blue-700 transition"
              onClick={() => onStepChange(1)}
            >
              <Edit fontSize ="small" />
            </button>
          </div>
            <p><strong>Name:</strong> {values.firstName} {values.lastName}</p>
            <p><strong>Email:</strong> {values.email}</p>
            <p><strong>Phone:</strong> {values.phone}</p>
          </div>
          <div>
            
        </div>

        <hr />

      
  <div className="border border-gray-200 rounded-md p-4 text-gray-700 mb-4">
  <div className="flex justify-between items-center mb-4">
     <h3 className="text-lg font-semibold">Analytes Selected</h3>
  <button
    className="w-36 flex items-center justify-center gap-1 px-4 py-2 rounded bg-enviro_blue text-white text-sm font-semibold hover:bg-blue-700 transition"
    onClick={() => onStepChange(4)}
  >
    Add Analyte
  </button>
  </div>
 
  {Array.isArray(selections) && selections.length > 0 ? (
    <ul className="text-gray-700 space-y-4">
      {selections.map((s, index) => (
        <li
          key={index}
          className="flex justify-between items-center"
        >
          <div>
            <p><strong>Name:</strong> {s.analyte}</p>
            <p><strong>Method:</strong> {s.method}</p>
            <p><strong>Turnaround Time:</strong> {s.turnaround?.label}</p>
            <p><strong>Price:</strong> ${parseFloat(s.price || 0).toFixed(2)}</p>
          </div>
          <div className= "flex items-center gap-2">
              <button
                    className="w-9 h-9 flex items-center justify-center bg-enviro_blue text-white rounded hover:bg-blue-700 transition"
                    // onClick={() => onStepChange(4)} 
                    onClick={() => {
  sessionStorage.setItem('editIndex', index);
  sessionStorage.setItem('selectedAnalyte', JSON.stringify(selections[index]));
  onStepChange(4);
}}
                  >
                    <Edit fontSize="small" />
                  </button>
            <button
                    className="w-9 h-9 flex items-center justify-center rounded bg-red-500 text-white hover:bg-red-700 transition"
                    onClick={() => handleDelete(index)}
                  >
                    <Delete fontSize="small" />
                  </button>
          </div>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-gray-500 italic">No analytes selected.</p>
  )}
</div>

        <hr />

        {/* Equipment Rental */}
          <div className="mt-10">
          <div className="border border-gray-200 rounded-md p-4 text-gray-700 mb-4">
            <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Equipment Rental Summary</h3>
              <div className="flex gap-2">
                <button
                  className="w-36 flex items-center justify-center gap-1 px-4 py-2 rounded bg-enviro_blue text-white text-sm font-semibold hover:bg-blue-700 transition"
                  onClick={() => onStepChange(7)}
                >
                  Add Equipment
            </button>
            </div>
          </div>
         {Array.isArray(cartItems) && cartItems.length > 0 ? (
  <ul className="text-gray-700 space-y-4">
    {cartItems.map((item, index) => {
      const startDate = new Date(item.StartDate);
      const endDate = new Date(item.ReturnDate);
      const rentalDays = Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)));
      const totalCost = rentalDays * (item.DailyCost || 0) * (item.Quantity || 0);

      return (
        <li key={index} className="flex justify-between items-center">
          <div>
            <p><strong>Equipment:</strong> {item.EquipmentName}</p>
            <p><strong>Category:</strong> {item.EquipmentCategory ?? item.Category ?? item.category ?? 'N/A'}</p>
            <p><strong>Start Date:</strong> {item.StartDate}</p>
            <p><strong>Return Date:</strong> {item.ReturnDate}</p>
            <p><strong>Quantity:</strong> {item.Quantity}</p>
            <p><strong>Cost:</strong> ${totalCost.toFixed(2)}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="w-9 h-9 flex items-center justify-center bg-enviro_blue text-white rounded hover:bg-blue-700 transition"
              onClick={() => {
                sessionStorage.setItem("editEquipmentIndex", index);
                sessionStorage.setItem("selectedEquipment", JSON.stringify(item));
                onStepChange(7);
              }}
            >
              <Edit fontSize="small" />
            </button>
            <button
              className="w-9 h-9 flex items-center justify-center rounded bg-red-500 text-white hover:bg-red-700 transition"
              onClick={() => {
                const confirmed = confirm("Are you sure you want to delete this equipment?");
                if (!confirmed) return;
                const updatedCart = cartItems.filter((_, i) => i !== index);
                sessionStorage.setItem("rentalCart", JSON.stringify(updatedCart));
                setCartItems(updatedCart);
              }}
            >
              <Delete fontSize="small" />
            </button>
          </div>
        </li>
      );
    })}
  </ul>
) : (
  <p className="text-gray-500 italic">No equipment selected.</p>
)}

        </div>
        </div>
      </div>
        
        {/* Right Column */}
        {/* Pricing */}
        <div className="space-y-6 bg-white shadow-md rounded-lg p-8 h-fit">
          <div className="text-gray-700 space-y-2">
            <h3 className="text-lg font-semibold mb-2">Pricing Breakdown</h3>
            <p><strong>Analytes Total:</strong> ${analyteTotal.toFixed(2)}</p>
            <p><strong>Equipment Total:</strong> ${equipmentTotal.toFixed(2)}</p>
            <p><strong>Subtotal:</strong> ${subtotal.toFixed(2)}</p>
            <p><strong>GST (5%):</strong> ${gst.toFixed(2)}</p>
            <p className="text-lg font-bold"><strong>Total:</strong> ${total.toFixed(2)}</p>
          </div>
          <hr />
          {/* Order Metadata */}
          <div className="text-gray-700 space-y-2">
            <h3 className="text-lg font-semibold mb-2">Additional Details</h3>
            <p><strong>Order Date:</strong> {orderDate}</p>
            <p><strong>Payment Method:</strong> {paymentMethod}</p>
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
            onClick={handleFinalSubmit}
            disabled={submitting}
            className={`text-white text-lg px-6 py-3 rounded-lg transition-all ${
              submitting ? 'bg-gray-500' : 'bg-enviro_blue hover:bg-blue-700'
            }`}
          >
            {submitting ? 'Submitting...' : 'Submit Order'}
          </button>
                </div>
        </div>
    </div>
  );
}
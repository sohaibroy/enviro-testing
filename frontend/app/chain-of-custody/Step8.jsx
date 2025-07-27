'use client';

import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Edit, Delete } from '@mui/icons-material';
import RentalCart from '../components/equipment-rental/RentalCart';
import { useRouter } from 'next/navigation'; //App Router

export default function Step8({ onBack, onStepChange, onSubmit }) {

  const router = useRouter();

  const [cartItems, setCartItems] = useState([]);
 
  useEffect(() => {
  refreshCartItems();
  }, []);

  const refreshCartItems = () => {
  const storedCart = JSON.parse(sessionStorage.getItem('rentalCart')) || [];
  setCartItems(storedCart);
  }; 

   // React Hook Form context
  const { getValues, setValue } = useFormContext();
  const values = getValues();
  // Selections from Step 6 (analyte method quantity turnaround page)
  const [selections, setSelections] = useState([]);
  //Tracking load state during final submit
  const [submitting, setSubmitting] = useState(false);

  // load the saved selections from session storage 
  useEffect(() => {
    const saved = sessionStorage.getItem('orderSelections');
    if (saved) {
      setSelections(JSON.parse(saved));
    }
  }, []);
  
    // Calculate total price for analytes
    const analyteTotal = selections.reduce((sum, item) => {
      return sum + (parseFloat(item.price) || 0);
    }, 0);

   // Calculate total price for equipment rentals
    const equipmentTotal = cartItems.reduce((sum, item) => {
      const startDate = new Date(item.StartDate);
      const endDate = new Date(item.ReturnDate);
      //convert milliseconds to days
      let rentalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
      rentalDays = rentalDays > 0 ? rentalDays : 1;

      return sum + (rentalDays * (item.DailyCost || 0) * (item.Quantity || 0));
    }, 0);

  //Combined pricing
  const analyteCount = selections.length;
  const equipmentCount = values.equipment?.length || 0;

  //combined pricing
  const subtotal = analyteTotal + equipmentTotal;
  const gst = subtotal * 0.05;
  const total = subtotal + gst;

  //setting default order date and paument method in the form state
  const orderDate = values.orderDate || new Date().toLocaleDateString();
  setValue('orderDate', orderDate);

  const paymentMethod = values.paymentMethod || 'Credit Card';
  setValue('paymentMethod', paymentMethod);

  function getXsrfTokenFromCookie() {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

  //handle for order submission with confiramtion dialogue
const handleFinalSubmit = async () => {
  if (selections.length === 0 && cartItems.length === 0) {
    alert('You must select at least one analyte or equipment item.');
    return;
  }

  if (!confirm('Are you sure you want to submit this order?')) return;

  setSubmitting(true);

  try {
    //Fetch CSRF cookie
    const csrfRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sanctum/csrf-cookie`, {
      credentials: 'include',
    });

    const xsrfToken = getXsrfTokenFromCookie();

    if (!xsrfToken) {
      throw new Error('[ERROR] XSRF-TOKEN not found in cookies');
    }

    //Get user info
    const userJson = sessionStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;

    //Guest mode fallback
    const isGuest = true;

    //Build transaction payload
    const transactionPayload = {
      transaction: {
        subtotal,
        gst,
        total_amount: total,
      },
      ...(isGuest && {
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
          credit_card: null,
          expiry_month: '',
          expiry_year: '',
        },
      }),
    };

    const transactionRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/transactions/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': xsrfToken,
      },
      credentials: 'include',
      body: JSON.stringify(transactionPayload),
    });

    const transactionText = await transactionRes.text();

    if (!transactionRes.ok || !transactionText.includes('transaction_id')) {
      throw new Error('Transaction creation failed');
    }

    const transactionData = JSON.parse(transactionText);
    const transactionId = transactionData.transaction_id;
    sessionStorage.setItem('transactionId', transactionId);

    //Validate turnaround structure before submission
    if (selections.some((s) => typeof s.turnaround !== 'object' || !s.turnaround.id)) {
      alert('Please ensure all analytes have a valid turnaround time selected.');
      return;
    }

    //Build order payload

    const orderPayload = {
      order: {
        transaction_id: transactionId,
        subtotal,
        gst,
        total_amount: total,
      },
      order_details: selections.map((s) => {
        return {
          turn_around_id: typeof s.turnaround === 'object' ? s.turnaround.id : undefined,
          price: Number(s.price) || 0,
          required_quantity: s.quantity ?? 1,
          required_pumps: s.pumps ?? 0,
          required_media: s.media ?? '',
          customer_comment: s.comment ?? '',
        };
      }),
    };

    const orderRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': xsrfToken,
      },
      credentials: 'include',
      body: JSON.stringify(orderPayload),
    });

    const orderText = await orderRes.text();

    if (!orderRes.ok || !orderText.includes('order_id')) {
      console.error('[ERROR] Order failed or did not return expected data');
      alert('Order submission failed.');
      return;
    }

    const orderData = JSON.parse(orderText);
    sessionStorage.setItem('lastOrderId', orderData.order_id);

//Clear old form data state
sessionStorage.removeItem('orderSelections');
sessionStorage.removeItem('rentalCart');
sessionStorage.removeItem('editIndex');
sessionStorage.removeItem('selectedAnalyte');
sessionStorage.removeItem('selectedEquipment');

    router.push('/order-confirmation');

  } catch (error) {
    console.error('Order submission error:', error);
    alert('Something went wrong.');
  }

  setSubmitting(false);
  console.log('[DEBUG] Final submit finished.');
};

  //handle for deleting one analyte information and also browser confirmation pops up for confirmation
const handleDelete = (indexToDelete) => {
  const confirmed = confirm("Are you sure you want to delete this analyte?");
  if (!confirmed) return;

  const updated = selections.filter((_, i) => i !== indexToDelete);
  setSelections(updated);
  sessionStorage.setItem("orderSelections", JSON.stringify(updated));
};
  //handle clearing all equippment
const [refreshCount, setRefreshCount] = useState(0);

const handleClearEquipment = () => {
  if (!confirm('Are you sure you want to clear all equipment selections?')) return;

  sessionStorage.removeItem('rentalCart');
  refreshCartItems();
  setRefreshCount(prev => prev + 1);
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
            <p><strong>Category:</strong> {item.EquipmentCategory}</p>
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
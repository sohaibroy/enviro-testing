// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useFormContext } from 'react-hook-form';
// import { Edit, Delete } from '@mui/icons-material';
// import { useRouter } from 'next/navigation';

// export default function Step8({ onBack, onStepChange }) {
//   const router = useRouter();
//   const { getValues, setValue } = useFormContext();
//   const values = getValues();

//   const [cartItems, setCartItems] = useState([]);
//   const [selections, setSelections] = useState([]);
//   const [submitting, setSubmitting] = useState(false);

//   // payment controls
//   const [paymentMethod, setPaymentMethod] = useState(
//     values.paymentMethod || sessionStorage.getItem('paymentMethod') || 'Credit Card'
//   );
//   const [poNumber, setPoNumber] = useState(
//     values.poNumber || sessionStorage.getItem('poNumber') || ''
//   );

//   useEffect(() => {
//     refreshCartItems();

//     const saved = sessionStorage.getItem('orderSelections');
//     if (saved) setSelections(JSON.parse(saved));

//     // user info (prefill)
//     const userJson = sessionStorage.getItem('user');
//     const user = userJson ? JSON.parse(userJson) : null;
//     const formValues = getValues();

//     if (user) {
//       if (!formValues.firstName) setValue('firstName', user.first_name);
//       if (!formValues.lastName) setValue('lastName', user.last_name);
//       if (!formValues.email) setValue('email', user.email);
//       if (!formValues.phone) setValue('phone', user.phone_number);
//     }

//     // mirror to RHF
//     setValue('paymentMethod', paymentMethod);
//     setValue('poNumber', poNumber);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   useEffect(() => {
//     setValue('paymentMethod', paymentMethod);
//     sessionStorage.setItem('paymentMethod', paymentMethod);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [paymentMethod]);

//   useEffect(() => {
//     setValue('poNumber', poNumber);
//     sessionStorage.setItem('poNumber', poNumber);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [poNumber]);

//   const refreshCartItems = () => {
//     const storedCart = JSON.parse(sessionStorage.getItem('rentalCart')) || [];
//     setCartItems(storedCart);
//   };

//   // totals
//   const analyteTotal = selections.reduce(
//     (sum, item) => sum + (parseFloat(item.price || 0) * (item.required_quantity ?? 1)),
//     0
//   );
//   const equipmentTotal = cartItems.reduce((sum, item) => {
//     const startDate = new Date(item.StartDate);
//     const endDate = new Date(item.ReturnDate);
//     const rentalDays = Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)));
//     return sum + (rentalDays * (item.DailyCost || 0) * (item.Quantity || 0));
//   }, 0);

//   const subtotal = analyteTotal + equipmentTotal;
//   const gst = +(subtotal * 0.05).toFixed(2);
//   const total = +(subtotal + gst).toFixed(2);

//   const orderDate = values.orderDate || new Date().toLocaleDateString();
//   setValue('orderDate', orderDate);

//   // XSRF helper (Sanctum)
//   function getXsrf() {
//     const m = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
//     return m ? decodeURIComponent(m[1]) : '';
//   }

//   // shared payload builders
//   // const buildAnalyteDetails = () =>
//   //   selections.map((s) => ({
//   //     turn_around_id: s.turnaround?.id ?? s.turnaround_time_id ?? null,
//   //     price: Number(s.price || 0) * (s.required_quantity ?? 1),
//   //     required_quantity: s.required_quantity ?? 1,
//   //     required_pumps: s.required_pumps ?? null,
//   //     required_media: s.required_media ?? null,
//   //     customer_comment: s.customer_comment || null,
//   //   }));

//   const buildAnalyteDetails = () =>
//   selections.map((s) => {
//     const mediaRaw = s.required_media;
//     const required_media =
//       mediaRaw === undefined || mediaRaw === null || mediaRaw === ''
//         ? null
//         : String(mediaRaw); // validator expects string

//     return {
//       turn_around_id: Number(
//         s.turnaround?.id ?? s.turnaround_time_id
//       ), // make sure it's an integer
//       price: Number(s.price || 0) * (s.required_quantity ?? 1),
//       required_quantity: Number(s.required_quantity ?? 1),
//       required_pumps:
//         s.required_pumps === '' || s.required_pumps === undefined
//           ? null
//           : Number(s.required_pumps),
//       required_media, // now string or null
//       customer_comment: s.customer_comment?.toString?.() ?? null,
//     };
//   });

//   const buildRentalItems = () =>
//     cartItems.map((e) => ({
//       equipment_name: e.EquipmentName,
//       category: e.EquipmentCategory ?? e.Category ?? e.category ?? 'Unknown',
//       start_date: e.StartDate,
//       return_date: e.ReturnDate,
//       quantity: e.Quantity,
//       daily_cost: e.DailyCost,
//     }));

//   async function primeCsrfOrRedirect(baseUrl) {
//     await fetch(`${baseUrl}/sanctum/csrf-cookie`, { credentials: 'include' });
//     const xsrf = getXsrf();
//     if (!xsrf) {
//       alert('Your session expired. Please log in again.');
//       router.push('/admin-login'); // or your login route
//       throw new Error('No CSRF token present');
//     }
//     return xsrf;
//   }

//   const submitPO = async () => {

//     const baseUrl = process.env.NEXT_PUBLIC_API_URL;
//     const xsrf = await primeCsrfOrRedirect(baseUrl);

//     const payload = {
//       order: { subtotal, gst, total_amount: total },
//       order_details: buildAnalyteDetails(),
//       rental_items: buildRentalItems(),
//       po_number: poNumber || null,
//     };

//     const res = await fetch(`${baseUrl}/api/orders/purchase-order`, {
//       method: 'POST',
//       credentials: 'include',
//       headers: {
//         'Content-Type': 'application/json',
//         'X-XSRF-TOKEN': xsrf,
//         'X-Requested-With': 'XMLHttpRequest',
//         Accept: 'application/json',
//       },
//       body: JSON.stringify(payload),
//     });

//     const ct = res.headers.get('content-type') || '';
//     const body = ct.includes('application/json') ? await res.json() : await res.text();

//     if (!res.ok) {
//       const msg = typeof body === 'string' ? body : body?.message || body?.error;
//       throw new Error(msg || `PO order failed (HTTP ${res.status})`);
//     }

// if (body?.order_id) {
//   sessionStorage.setItem('lastOrderId', String(body.order_id));   // add this
//   router.push(`/order-confirmation?order_id=${body.order_id}`);
//   return;
// }
//   };

//   const submitCard = async () => {
//     const baseUrl = process.env.NEXT_PUBLIC_API_URL;
//     const xsrfToken = await primeCsrfOrRedirect(baseUrl);

//     const userJson = sessionStorage.getItem('user');
//     const user = userJson ? JSON.parse(userJson) : null;

//     // 1) Create Transaction
//     const transactionPayload = {
//       transaction: { subtotal, gst, total_amount: total },
//       account: {
//         first_name: user?.first_name ?? '',
//         last_name: user?.last_name ?? '',
//         email: user?.email ?? '',
//         phone_number: user?.phone_number ?? '',
//         street_address: user?.street_address ?? '',
//         city: user?.city ?? '',
//         province: user?.province ?? '',
//         postal_code: user?.postal_code ?? '',
//         country: user?.country ?? '',
//         cardholder_name: `${user?.first_name ?? ''} ${user?.last_name ?? ''}`,
//       },
//     };

//     const transactionRes = await fetch(`${baseUrl}/api/transactions/create`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'X-XSRF-TOKEN': xsrfToken,
//         'X-Requested-With': 'XMLHttpRequest',
//         Accept: 'application/json',
//       },
//       credentials: 'include',
//       body: JSON.stringify(transactionPayload),
//     });

//     const txnData = await transactionRes.json();
//     if (!transactionRes.ok) {
//       throw new Error(txnData?.error || 'Failed to create transaction');
//     }

//     const transactionId = txnData.transaction_id;
//     if (!transactionId) throw new Error('Missing transaction_id in response');
//     sessionStorage.setItem('transactionId', transactionId);

//     // 2) Create Stripe Checkout session
//     const stripePayload = {
//       amount: Math.round(total * 100),
//       transaction_id: transactionId,
//       user: {
//         first_name: user?.first_name ?? '',
//         last_name: user?.last_name ?? '',
//         email: user?.email ?? '',
//       },
//       analytes: selections.map((s) => ({
//         analyte: s.analyte,
//         method: s.method,
//         turnaround_time_id: s.turnaround?.id ?? null,
//         price: s.price,
//         required_quantity: s.required_quantity ?? 1,
//         required_pumps: s.required_pumps ?? 0,
//         required_media: s.required_media ?? 0,
//         customer_comment: s.customer_comment || '',
//       })),
//       equipment: cartItems.map((e) => ({
//         equipment_id: e.EquipmentID,
//         start_date: e.StartDate,
//         return_date: e.ReturnDate,
//         quantity: e.Quantity,
//         daily_cost: e.DailyCost,
//       })),
//     };

//     const stripeRes = await fetch(`${baseUrl}/api/create-checkout-session`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'X-XSRF-TOKEN': xsrfToken,
//         'X-Requested-With': 'XMLHttpRequest',
//         Accept: 'application/json',
//       },
//       credentials: 'include',
//       body: JSON.stringify(stripePayload),
//     });

//     const stripeData = await stripeRes.json();
//     if (!stripeRes.ok || !stripeData?.url) {
//       throw new Error(stripeData?.error || 'Stripe session did not return a redirect URL.');
//     }

//     window.location.href = stripeData.url;
//   };

//   const handleFinalSubmit = async () => {
//     if (selections.length === 0 && cartItems.length === 0) {
//       alert('You must select at least one analyte or equipment item.');
//       return;
//     }

//     if (paymentMethod === 'PO' && !poNumber.trim()) {
//       const ok = confirm('No PO Number entered. Continue without it?');
//       if (!ok) return;
//     }

//     if (!confirm('Are you sure you want to submit this order?')) return;

//     setSubmitting(true);
//     try {
//       if (paymentMethod === 'PO') {
//         await submitPO();
//       } else {
//         await submitCard();
//       }
//     } catch (err) {
//       console.error('[Submit] Error occurred:', err);
//       alert(err.message || 'Something went wrong while submitting the order.');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleDelete = (indexToDelete) => {
//     const confirmed = confirm('Are you sure you want to delete this analyte?');
//     if (!confirmed) return;
//     const updated = selections.filter((_, i) => i !== indexToDelete);
//     setSelections(updated);
//     sessionStorage.setItem('orderSelections', JSON.stringify(updated));
//   };

//   return (
//     <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
//       {/* Left Column */}
//       <div className="lg:col-span-2 bg-white shadow-md rounded-lg p-8 space-y-6 max-h-none overflow-y-visible lg:max-h-[85vh] lg:overflow-y-auto">
//         <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>

//         {/* Contact Info */}
//         <div className="border border-gray-200 rounded-md p-4 text-gray-700 mb-4">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-lg font-semibold mb-2">Contact Details</h3>
//             <button
//               className="w-9 h-9 flex items-center justify-center bg-enviro_blue text-white p-2 rounded hover:bg-blue-700 transition"
//               onClick={() => onStepChange(1)}
//             >
//               <Edit fontSize="small" />
//             </button>
//           </div>
//           <p><strong>Name:</strong> {values.firstName} {values.lastName}</p>
//           <p><strong>Email:</strong> {values.email}</p>
//           <p><strong>Phone:</strong> {values.phone}</p>
//         </div>

//         <hr />

//         {/* Analytes */}
//         <div className="border border-gray-200 rounded-md p-4 text-gray-700 mb-4">
//           <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
//             <h3 className="text-lg font-semibold">Analytes Selected</h3>
//             <button
//               className="w-full sm:w-36 px-4 py-2 rounded bg-enviro_blue text-white text-sm font-semibold hover:bg-blue-700 transition"
//               onClick={() => onStepChange(4)}
//             >
//               Add Analyte
//             </button>
//           </div>

//           {Array.isArray(selections) && selections.length > 0 ? (
//             <ul className="text-gray-700 space-y-4">
//               {selections.map((s, index) => (
//                 <li key={index} className="flex justify-between items-center">
//                   <div>
//                     <p><strong>Name:</strong> {s.analyte}</p>
//                     <p><strong>Method:</strong> {s.method}</p>
//                     <p><strong>Turnaround Time:</strong> {s.turnaround?.label}</p>
//                     <p><strong>Quantity:</strong> {s.required_quantity ?? 1}</p>
//                     <p><strong>Price:</strong> ${(parseFloat(s.price || 0) * (s.required_quantity ?? 1)).toFixed(2)}</p>
//                     <p><strong>Pump Quantity:</strong> {s.required_pumps ?? 0}</p>
//                     <p><strong>Media Quantity:</strong> {s.required_media ?? 0}</p>
//                     <p><strong>Comments:</strong> {s.customer_comment || 'N/A'}</p>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <button
//                       className="w-9 h-9 flex items-center justify-center bg-enviro_blue text-white rounded hover:bg-blue-700 transition"
//                       onClick={() => {
//                         sessionStorage.setItem('editIndex', index);
//                         sessionStorage.setItem('selectedAnalyte', JSON.stringify(selections[index]));
//                         onStepChange(4);
//                       }}
//                     >
//                       <Edit fontSize="small" />
//                     </button>
//                     <button
//                       className="w-9 h-9 flex items-center justify-center rounded bg-red-500 text-white hover:bg-red-700 transition"
//                       onClick={() => handleDelete(index)}
//                     >
//                       <Delete fontSize="small" />
//                     </button>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p className="text-gray-500 italic">No analytes selected.</p>
//           )}
//         </div>

//         <hr />

//         {/* Equipment Rental */}
//         <div className="mt-10">
//           <div className="border border-gray-200 rounded-md p-4 text-gray-700 mb-4">
//             <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
//               <h3 className="text-lg font-semibold">Equipment Rental Summary</h3>
//               <div className="flex gap-2">
//                 <button
//                   className="w-full sm:w-36 px-4 py-2 rounded bg-enviro_blue text-white text-sm font-semibold hover:bg-blue-700 transition"
//                   onClick={() => onStepChange(7)}
//                 >
//                   Add Equipment
//                 </button>
//               </div>
//             </div>

//             {Array.isArray(cartItems) && cartItems.length > 0 ? (
//               <ul className="text-gray-700 space-y-4">
//                 {cartItems.map((item, index) => {
//                   const startDate = new Date(item.StartDate);
//                   const endDate = new Date(item.ReturnDate);
//                   const rentalDays = Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)));
//                   const totalCost = rentalDays * (item.DailyCost || 0) * (item.Quantity || 0);

//                   return (
//                     <li key={index} className="flex justify-between items-center">
//                       <div>
//                         <p><strong>Equipment:</strong> {item.EquipmentName}</p>
//                         <p><strong>Category:</strong> {item.EquipmentCategory ?? item.Category ?? item.category ?? 'N/A'}</p>
//                         <p><strong>Start Date:</strong> {item.StartDate}</p>
//                         <p><strong>Return Date:</strong> {item.ReturnDate}</p>
//                         <p><strong>Quantity:</strong> {item.Quantity}</p>
//                         <p><strong>Cost:</strong> ${totalCost.toFixed(2)}</p>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <button
//                           className="w-9 h-9 flex items-center justify-center bg-enviro_blue text-white rounded hover:bg-blue-700 transition"
//                           onClick={() => {
//                             sessionStorage.setItem('editEquipmentIndex', index);
//                             sessionStorage.setItem('selectedEquipment', JSON.stringify(item));
//                             onStepChange(7);
//                           }}
//                         >
//                           <Edit fontSize="small" />
//                         </button>
//                         <button
//                           className="w-9 h-9 flex items-center justify-center rounded bg-red-500 text-white hover:bg-red-700 transition"
//                           onClick={() => {
//                             const confirmed = confirm('Are you sure you want to delete this equipment?');
//                             if (!confirmed) return;
//                             const updatedCart = cartItems.filter((_, i) => i !== index);
//                             sessionStorage.setItem('rentalCart', JSON.stringify(updatedCart));
//                             setCartItems(updatedCart);
//                           }}
//                         >
//                           <Delete fontSize="small" />
//                         </button>
//                       </div>
//                     </li>
//                   );
//                 })}
//               </ul>
//             ) : (
//               <p className="text-gray-500 italic">No equipment selected.</p>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Right Column */}
//       <div className="space-y-6 bg-white shadow-md rounded-lg p-8 h-fit">
//         {/* Pricing */}
//         <div className="text-gray-700 space-y-2">
//           <h3 className="text-lg font-semibold mb-2">Pricing Breakdown</h3>
//           <p><strong>Analytes Total:</strong> ${analyteTotal.toFixed(2)}</p>
//           <p><strong>Equipment Total:</strong> ${equipmentTotal.toFixed(2)}</p>
//           <p><strong>Subtotal:</strong> ${subtotal.toFixed(2)}</p>
//           <p><strong>GST (5%):</strong> ${gst.toFixed(2)}</p>
//           <p className="text-lg font-bold"><strong>Total:</strong> ${total.toFixed(2)}</p>
//         </div>

//         <hr />

//         {/* Payment choice */}
//         <div className="text-gray-700 space-y-3">
//           <h3 className="text-lg font-semibold mb-2">Payment</h3>

//           <label className="flex items-center gap-2">
//             <input
//               type="radio"
//               name="payment_method"
//               value="Credit Card"
//               checked={paymentMethod === 'Credit Card'}
//               onChange={() => setPaymentMethod('Credit Card')}
//             />
//             Credit Card (via Stripe)
//           </label>

//           <label className="flex items-center gap-2">
//             <input
//               type="radio"
//               name="payment_method"
//               value="PO"
//               checked={paymentMethod === 'PO'}
//               onChange={() => setPaymentMethod('PO')}
//             />
//             Purchase Order (PO)
//           </label>

//           {paymentMethod === 'PO' && (
//             <div className="mt-2">
//               <label className="block text-sm mb-1">PO Number (optional)</label>
//               <input
//                 type="text"
//                 className="w-full border rounded p-2"
//                 placeholder="e.g., PO-12345"
//                 value={poNumber}
//                 onChange={(e) => setPoNumber(e.target.value)}
//               />
//               <p className="text-xs text-gray-500 mt-1">
//                 You can leave this blank and enviro-works can add it later.
//               </p>
//             </div>
//           )}
//         </div>

//         <hr />

//         {/* Order Metadata */}
//         <div className="text-gray-700 space-y-2">
//           <h3 className="text-lg font-semibold mb-2">Additional Details</h3>
//           <p><strong>Order Date:</strong> {orderDate}</p>
//           <p><strong>Payment Method:</strong> {paymentMethod}</p>
//         </div>

//         {/* Buttons */}
//         <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mt-8 pb-10">
//           <button
//             type="button"
//             onClick={onBack}
//             className="bg-gray-300 hover:bg-gray-400 text-gray-800 text-lg px-6 py-3 rounded-lg transition-all"
//           >
//             Back
//           </button>
//           <button
//             type="button"
//             onClick={handleFinalSubmit}
//             disabled={submitting}
//             className={`text-white text-lg px-6 py-3 rounded-lg transition-all ${
//               submitting ? 'bg-gray-500' : 'bg-enviro_blue hover:bg-blue-700'
//             }`}
//           >
//             {submitting ? 'Submitting...' : 'Submit Order'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

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

  // payment controls
  const [paymentMethod, setPaymentMethod] = useState(
    values.paymentMethod || sessionStorage.getItem('paymentMethod') || 'Credit Card'
  );
  const [poNumber, setPoNumber] = useState(
    values.poNumber || sessionStorage.getItem('poNumber') || ''
  );

  useEffect(() => {
    refreshCartItems();

    const saved = sessionStorage.getItem('orderSelections');
    if (saved) setSelections(JSON.parse(saved));

    // user info (prefill)
    const userJson = sessionStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;
    const formValues = getValues();

    if (user) {
      if (!formValues.firstName) setValue('firstName', user.first_name);
      if (!formValues.lastName) setValue('lastName', user.last_name);
      if (!formValues.email) setValue('email', user.email);
      if (!formValues.phone) setValue('phone', user.phone_number);
    }

    // mirror to RHF
    setValue('paymentMethod', paymentMethod);
    setValue('poNumber', poNumber);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setValue('paymentMethod', paymentMethod);
    sessionStorage.setItem('paymentMethod', paymentMethod);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentMethod]);

  useEffect(() => {
    setValue('poNumber', poNumber);
    sessionStorage.setItem('poNumber', poNumber);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poNumber]);

  const refreshCartItems = () => {
    const storedCart = JSON.parse(sessionStorage.getItem('rentalCart')) || [];
    setCartItems(storedCart);
  };

  // totals
  const analyteTotal = selections.reduce(
    (sum, item) => sum + (parseFloat(item.price || 0) * (item.required_quantity ?? 1)),
    0
  );
  const equipmentTotal = cartItems.reduce((sum, item) => {
    const startDate = new Date(item.StartDate);
    const endDate = new Date(item.ReturnDate);
    const rentalDays = Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)));
    return sum + (rentalDays * (item.DailyCost || 0) * (item.Quantity || 0));
  }, 0);

  const subtotal = analyteTotal + equipmentTotal;
  const gst = +(subtotal * 0.05).toFixed(2);
  const total = +(subtotal + gst).toFixed(2);

  const orderDate = values.orderDate || new Date().toLocaleDateString();
  setValue('orderDate', orderDate);

  // Builders (strict types for server validator)
  const buildAnalyteDetails = () =>
    selections.map((s) => {
      const mediaRaw = s.required_media;
      const required_media =
        mediaRaw === undefined || mediaRaw === null || mediaRaw === ''
          ? null
          : String(mediaRaw);

      return {
        turn_around_id: Number(s.turnaround?.id ?? s.turnaround_time_id),
        price: Number(s.price || 0) * (s.required_quantity ?? 1),
        required_quantity: Number(s.required_quantity ?? 1),
        required_pumps:
          s.required_pumps === '' || s.required_pumps === undefined
            ? null
            : Number(s.required_pumps),
        required_media,
        customer_comment: s.customer_comment?.toString?.() ?? null,
      };
    });

  const buildRentalItems = () =>
    cartItems.map((e) => ({
      equipment_name: e.EquipmentName,
      category: e.EquipmentCategory ?? e.Category ?? e.category ?? 'Unknown',
      start_date: e.StartDate,
      return_date: e.ReturnDate,
      quantity: e.Quantity,
      daily_cost: e.DailyCost,
    }));

  // ==== SUBMITTERS (STAT ELESS: no CSRF needed) ====

  const submitPO = async () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    const payload = {
      order: { subtotal, gst, total_amount: total },
      order_details: buildAnalyteDetails(),
      rental_items: buildRentalItems(),
      po_number: poNumber || null,
    };

    const res = await fetch(`${baseUrl}/api/orders/purchase-order`, {
      method: 'POST',
      // stateless call:
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const ct = res.headers.get('content-type') || '';
    const body = ct.includes('application/json') ? await res.json() : await res.text();

    if (!res.ok) {
      const msg = typeof body === 'string' ? body : body?.message || body?.error;
      throw new Error(msg || `PO order failed (HTTP ${res.status})`);
    }

    if (body?.order_id) {
      sessionStorage.setItem('lastOrderId', String(body.order_id));
      router.push(`/order-confirmation?order_id=${body.order_id}`);
      return;
    }
  };

  const submitCard = async () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    const userJson = sessionStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;

    // 1) Create Transaction (stateless)
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

    const transactionRes = await fetch(`${baseUrl}/api/transactions/create`, {
      method: 'POST',
      credentials: 'omit', // stateless
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(transactionPayload),
    });

    const txnData = await transactionRes.json();
    if (!transactionRes.ok) {
      throw new Error(txnData?.error || 'Failed to create transaction');
    }

    const transactionId = txnData.transaction_id;
    if (!transactionId) throw new Error('Missing transaction_id in response');
    sessionStorage.setItem('transactionId', transactionId);

    // 2) Create Stripe Checkout session (stateless)
    const stripePayload = {
      amount: Math.round(total * 100),
      transaction_id: transactionId,
      user: {
        first_name: user?.first_name ?? '',
        last_name: user?.last_name ?? '',
        email: user?.email ?? '',
      },
      analytes: selections.map((s) => ({
        analyte: s.analyte,
        method: s.method,
        turnaround_time_id: s.turnaround?.id ?? null,
        price: s.price,
        required_quantity: s.required_quantity ?? 1,
        required_pumps: s.required_pumps ?? 0,
        required_media: s.required_media ?? 0,
        customer_comment: s.customer_comment || '',
      })),
      equipment: cartItems.map((e) => ({
        equipment_id: e.EquipmentID,
        start_date: e.StartDate,
        return_date: e.ReturnDate,
        quantity: e.Quantity,
        daily_cost: e.DailyCost,
      })),
    };

    const stripeRes = await fetch(`${baseUrl}/api/create-checkout-session`, {
      method: 'POST',
      credentials: 'omit', // stateless
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(stripePayload),
    });

    const stripeData = await stripeRes.json();
    if (!stripeRes.ok || !stripeData?.url) {
      throw new Error(stripeData?.error || 'Stripe session did not return a redirect URL.');
    }

    window.location.href = stripeData.url;
  };

  const handleFinalSubmit = async () => {
    if (selections.length === 0 && cartItems.length === 0) {
      alert('You must select at least one analyte or equipment item.');
      return;
    }

    if (paymentMethod === 'PO' && !poNumber.trim()) {
      const ok = confirm('No PO Number entered. Continue without it?');
      if (!ok) return;
    }

    if (!confirm('Are you sure you want to submit this order?')) return;

    setSubmitting(true);
    try {
      if (paymentMethod === 'PO') {
        await submitPO();
      } else {
        await submitCard();
      }
    } catch (err) {
      console.error('[Submit] Error occurred:', err);
      alert(err.message || 'Something went wrong while submitting the order.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (indexToDelete) => {
    const confirmed = confirm('Are you sure you want to delete this analyte?');
    if (!confirmed) return;
    const updated = selections.filter((_, i) => i !== indexToDelete);
    setSelections(updated);
    sessionStorage.setItem('orderSelections', JSON.stringify(updated));
  };

  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column */}
      <div className="lg:col-span-2 bg-white shadow-md rounded-lg p-8 space-y-6 max-h-none overflow-y-visible lg:max-h-[85vh] lg:overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>

        {/* Contact Info */}
        <div className="border border-gray-200 rounded-md p-4 text-gray-700 mb-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold mb-2">Contact Details</h3>
            <button
              className="w-9 h-9 flex items-center justify-center bg-enviro_blue text-white p-2 rounded hover:bg-blue-700 transition"
              onClick={() => onStepChange(1)}
            >
              <Edit fontSize="small" />
            </button>
          </div>
          <p><strong>Name:</strong> {values.firstName} {values.lastName}</p>
          <p><strong>Email:</strong> {values.email}</p>
          <p><strong>Phone:</strong> {values.phone}</p>
        </div>

        <hr />

        {/* Analytes */}
        <div className="border border-gray-200 rounded-md p-4 text-gray-700 mb-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
            <h3 className="text-lg font-semibold">Analytes Selected</h3>
            <button
              className="w-full sm:w-36 px-4 py-2 rounded bg-enviro_blue text-white text-sm font-semibold hover:bg-blue-700 transition"
              onClick={() => onStepChange(4)}
            >
              Add Analyte
            </button>
          </div>

          {Array.isArray(selections) && selections.length > 0 ? (
            <ul className="text-gray-700 space-y-4">
              {selections.map((s, index) => (
                <li key={index} className="flex justify-between items-center">
                  <div>
                    <p><strong>Name:</strong> {s.analyte}</p>
                    <p><strong>Method:</strong> {s.method}</p>
                    <p><strong>Turnaround Time:</strong> {s.turnaround?.label}</p>
                    <p><strong>Quantity:</strong> {s.required_quantity ?? 1}</p>
                    <p><strong>Price:</strong> ${(parseFloat(s.price || 0) * (s.required_quantity ?? 1)).toFixed(2)}</p>
                    <p><strong>Pump Quantity:</strong> {s.required_pumps ?? 0}</p>
                    <p><strong>Media Quantity:</strong> {s.required_media ?? 0}</p>
                    <p><strong>Comments:</strong> {s.customer_comment || 'N/A'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="w-9 h-9 flex items-center justify-center bg-enviro_blue text-white rounded hover:bg-blue-700 transition"
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
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
              <h3 className="text-lg font-semibold">Equipment Rental Summary</h3>
              <div className="flex gap-2">
                <button
                  className="w-full sm:w-36 px-4 py-2 rounded bg-enviro_blue text-white text-sm font-semibold hover:bg-blue-700 transition"
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
                            sessionStorage.setItem('editEquipmentIndex', index);
                            sessionStorage.setItem('selectedEquipment', JSON.stringify(item));
                            onStepChange(7);
                          }}
                        >
                          <Edit fontSize="small" />
                        </button>
                        <button
                          className="w-9 h-9 flex items-center justify-center rounded bg-red-500 text-white hover:bg-red-700 transition"
                          onClick={() => {
                            const confirmed = confirm('Are you sure you want to delete this equipment?');
                            if (!confirmed) return;
                            const updatedCart = cartItems.filter((_, i) => i !== index);
                            sessionStorage.setItem('rentalCart', JSON.stringify(updatedCart));
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
      <div className="space-y-6 bg-white shadow-md rounded-lg p-8 h-fit">
        {/* Pricing */}
        <div className="text-gray-700 space-y-2">
          <h3 className="text-lg font-semibold mb-2">Pricing Breakdown</h3>
          <p><strong>Analytes Total:</strong> ${analyteTotal.toFixed(2)}</p>
          <p><strong>Equipment Total:</strong> ${equipmentTotal.toFixed(2)}</p>
          <p><strong>Subtotal:</strong> ${subtotal.toFixed(2)}</p>
          <p><strong>GST (5%):</strong> ${gst.toFixed(2)}</p>
          <p className="text-lg font-bold"><strong>Total:</strong> ${total.toFixed(2)}</p>
        </div>

        <hr />

        {/* Payment choice */}
        <div className="text-gray-700 space-y-3">
          <h3 className="text-lg font-semibold mb-2">Payment</h3>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="payment_method"
              value="Credit Card"
              checked={paymentMethod === 'Credit Card'}
              onChange={() => setPaymentMethod('Credit Card')}
            />
            Credit Card (via Stripe)
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="payment_method"
              value="PO"
              checked={paymentMethod === 'PO'}
              onChange={() => setPaymentMethod('PO')}
            />
            Purchase Order (PO)
          </label>

          {paymentMethod === 'PO' && (
            <div className="mt-2">
              <label className="block text-sm mb-1">PO Number (optional)</label>
              <input
                type="text"
                className="w-full border rounded p-2"
                placeholder="e.g., PO-12345"
                value={poNumber}
                onChange={(e) => setPoNumber(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                You can leave this blank and enviro-works can add it later.
              </p>
            </div>
          )}
        </div>

        <hr />

        {/* Order Metadata */}
        <div className="text-gray-700 space-y-2">
          <h3 className="text-lg font-semibold mb-2">Additional Details</h3>
          <p><strong>Order Date:</strong> {orderDate}</p>
          <p><strong>Payment Method:</strong> {paymentMethod}</p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mt-8 pb-10">
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

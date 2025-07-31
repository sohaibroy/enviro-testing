'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export default function OrderConfirmationPage() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
  async function loadOrder() {
  const sessionId = params.get('session_id');
  let orderId = sessionStorage.getItem('lastOrderId');

  if (sessionId) {
    try {
      const res = await fetch(`${baseUrl}/api/stripe/session/${sessionId}`);
      const data = await res.json();

      if (!data || !data.order_id) {
        router.replace('/payment-failed');
        return;
      }

      orderId = data.order_id;
      sessionStorage.setItem('lastOrderId', orderId);
    } catch (err) {
      router.replace('/payment-failed');
      return;
    }
  }

  if (!orderId) {
    router.replace('/payment-failed');
    return;
  }

  try {
  const res = await fetch(`${baseUrl}/api/orders/full/${orderId}`);
  const data = await res.json();

  const selections = JSON.parse(sessionStorage.getItem('orderSelections')) || [];

  const enrichedDetails = (data.details || []).map((d, i) => ({
    ...d,
    analyte_name: d.analyte_name ?? selections[i]?.analyte ?? '',
    method_name: d.method_name ?? selections[i]?.method ?? '',
    turnaround_time: d.turnaround_time ?? selections[i]?.turnaround?.label ?? '',
  }));

  setOrder({
    ...data,
    details: enrichedDetails,
  });

  //Delay clearing storage only after successful load
  setTimeout(() => {
    sessionStorage.removeItem('orderSelections');
    sessionStorage.removeItem('rentalCart');
    sessionStorage.removeItem('transactionId');
  }, 5000); // 1 second is enough, fast but safe

} catch (err) {
  //Do NOT clear anything here — allow Try Again to work
  router.replace('/payment-failed');
}

  setLoading(false);
}

    loadOrder();
  }, [params]);

  if (loading) return <div className="p-6 text-center">Loading order confirmation...</div>;
  if (!order) return <div className="p-6 text-center text-red-500">Order not found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-green-700 mb-4">Order Confirmed!</h1>

      <div className="space-y-2 text-gray-800">
        <p><strong>Order ID:</strong> {order.order_id}</p>
        <p><strong>Order Date:</strong> {order.order_date}</p>
        <p><strong>Subtotal:</strong> ${parseFloat(order.subtotal).toFixed(2)}</p>
        <p><strong>Payment Status:</strong> {order.payment_status || 'Pending'}</p>
      </div>

      <hr className="my-6" />

      <h2 className="text-xl font-semibold mb-3">Analyte Details</h2>
      {order.details?.length > 0 ? (
        <ul className="space-y-4">
          {order.details.map((item, index) => (
            <li key={index} className="p-4 border rounded-md">
              <p><strong>Analyte:</strong> {item.analyte_name}</p>
              <p><strong>Method:</strong> {item.method_name}</p>
              <p><strong>Turnaround:</strong> {item.turnaround_time}</p>
              <p><strong>Quantity:</strong> {item.required_quantity}</p>
              <p><strong>Price:</strong> ${parseFloat(item.price).toFixed(2)}</p>
              {item.customer_comment && <p><strong>Comments:</strong> {item.customer_comment}</p>}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 italic">No analytes listed for this order.</p>
      )}

      <h2 className="text-xl font-semibold mb-3">Equipment Rental</h2>
      {order.equipment_items?.length > 0 ? (
        <ul className="space-y-4">
          {order.equipment_items.map((item, index) => (
            <li key={index} className="p-4 border rounded-md">
              <p><strong>Equipment:</strong> {item.equipment_name}</p>
              <p><strong>Category:</strong> {item.category}</p>
              <p><strong>Start Date:</strong> {item.start_date}</p>
              <p><strong>Return Date:</strong> {item.return_date}</p>
              <p><strong>Quantity:</strong> {item.quantity}</p>
              <p><strong>Daily Cost:</strong> ${parseFloat(item.daily_cost).toFixed(2)}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 italic">No rental equipment for this order.</p>
      )}

      <div className="mt-8 text-center">
        <button
          className="px-6 py-2 rounded bg-enviro_blue text-white font-semibold hover:bg-blue-700 transition"
          onClick={() => window.print()}
        >
          Print Receipt
        </button>
      </div>
    </div>
  );
}
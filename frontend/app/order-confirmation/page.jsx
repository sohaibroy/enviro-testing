'use client';

import { useEffect, useState } from 'react';
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export default function OrderConfirmationPage() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orderId = sessionStorage.getItem('lastOrderId');
    if (!orderId) {
      setLoading(false);
      return;
    }

    fetch(`${baseUrl}/api/orders/full/${orderId}`)
      .then((res) => res.json())
      .then((data) => {
        setOrder(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading order:', err);
        setLoading(false);
      });
  }, []);

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
              <p><strong>Quantity:</strong> {item.quantity}</p>
              <p><strong>Price:</strong> ${parseFloat(item.price).toFixed(2)}</p>
              {item.comments && <p><strong>Comments:</strong> {item.comments}</p>}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 italic">No analytes listed for this order.</p>
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
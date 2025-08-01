'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export default function OrderConfirmationClient() {
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

        setTimeout(() => {
          sessionStorage.removeItem('orderSelections');
          sessionStorage.removeItem('rentalCart');
          sessionStorage.removeItem('transactionId');
        }, 5000);
      } catch (err) {
        router.replace('/payment-failed');
      }

      setLoading(false);
    }

    loadOrder();
  }, [params, router]);

  const printReceipt = () => {
    const printContent = document.getElementById('print-content').innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;

    window.location.reload();
  };

  if (loading) return <div className="p-6 text-center">Loading order confirmation...</div>;
  if (!order) return <div className="p-6 text-center text-red-500">Order not found.</div>;

  return (
    <div className="w-full flex justify-center bg-gray-50 px-4 sm:px-6 py-10 sm:py-16">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-screen-md xl:max-w-3xl bg-white rounded-2xl shadow-xl p-6 sm:p-10 transition">

        <div className="bg-green-100 text-green-800 rounded-lg p-3 mb-6 text-center font-semibold tracking-wide">
          Order Confirmed Successfully!
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-gray-800 mb-6">
          <p><strong>Order ID:</strong> {order.order_id}</p>
          <p><strong>Order Date:</strong> {order.order_date}</p>
          <p><strong>Subtotal:</strong> ${parseFloat(order.subtotal).toFixed(2)}</p>
          <p><strong>Payment Status:</strong> {order.payment_status || 'Pending'}</p>
        </div>

        <div className="border-t pt-6 mt-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 tracking-wide">Analyte Details</h2>
          {order.details?.length > 0 ? (
            <ul className="space-y-4">
              {order.details.map((item, index) => (
                <li key={index} className="p-4 rounded-lg shadow-sm hover:shadow-md bg-gray-50 transition">
                  <p className="text-sm sm:text-base"><strong>Analyte:</strong> {item.analyte_name}</p>
                  <p className="text-sm sm:text-base"><strong>Method:</strong> {item.method_name}</p>
                  <p className="text-sm sm:text-base"><strong>Turnaround:</strong> {item.turnaround_time}</p>
                  <p className="text-sm sm:text-base"><strong>Quantity:</strong> {item.required_quantity}</p>
                  <p className="text-sm sm:text-base"><strong>Pump Quantity:</strong> {item.required_pumps ?? 0}</p>
                  <p className="text-sm sm:text-base"><strong>Media Quantity:</strong> {item.required_media ?? 'N/A'}</p>
                  <p className="text-sm sm:text-base"><strong>Price:</strong> ${parseFloat(item.price).toFixed(2)}</p>
                  {item.customer_comment && (
                    <p className="text-sm sm:text-base"><strong>Comments:</strong> {item.customer_comment}</p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 italic">No analytes listed for this order.</p>
          )}
        </div>

        <div className="border-t pt-6 mt-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 tracking-wide">Equipment Rental</h2>
          {order.equipment_items?.length > 0 ? (
            <ul className="space-y-4">
              {order.equipment_items.map((item, index) => (
                <li key={index} className="p-4 rounded-lg shadow-sm hover:shadow-md bg-gray-50 transition">
                  <p className="text-sm sm:text-base"><strong>Equipment:</strong> {item.equipment_name}</p>
                  <p className="text-sm sm:text-base"><strong>Category:</strong> {item.category}</p>
                  <p className="text-sm sm:text-base"><strong>Start Date:</strong> {item.start_date}</p>
                  <p className="text-sm sm:text-base"><strong>Return Date:</strong> {item.return_date}</p>
                  <p className="text-sm sm:text-base"><strong>Quantity:</strong> {item.quantity}</p>
                  <p className="text-sm sm:text-base"><strong>Daily Cost:</strong> ${parseFloat(item.daily_cost).toFixed(2)}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 italic">No rental equipment for this order.</p>
          )}
        </div>

        <div className="mt-8 text-center">
          <button
            className="rounded-lg px-4 sm:px-6 py-2 sm:py-3 font-bold bg-enviro_orange text-white transition-transform duration-200 ease-in-out hover:scale-[1.03]"
            onClick={printReceipt}
          >
            Print Receipt
          </button>
        </div>

        {/* Print receipt content */}
        <div id="print-content" className="hidden">
          <div className="p-6 max-w-md mx-auto">
            <div className="flex justify-center mb-4">
              <div className="text-center">
                <img
                  src="/img/eurofins-logo.png"
                  alt="Eurofins Logo"
                  className="h-15 mx-auto mb-2 pl-14"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    document.getElementById('company-name-fallback').style.display = 'block';
                  }}
                />
                <p className="text-sm text-gray-600">18949 111 Ave NW</p>
                <p className="text-sm text-gray-600">Edmonton, Alberta</p>
                <p className="text-sm text-gray-600">Canada</p>
                <p className="text-sm text-gray-600">Phone: (780) 457-4652</p>
              </div>
            </div>

            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold">Order Receipt</h1>
              <p className="text-sm text-gray-600">Thank you for your order!</p>
            </div>

            <div className="grid grid-cols-2 gap-y-2 mb-6">
              <p className="font-semibold">Order ID:</p>
              <p>{order.order_id}</p>
              <p className="font-semibold">Date:</p>
              <p>{order.order_date}</p>
              <p className="font-semibold">Subtotal:</p>
              <p>${parseFloat(order.subtotal).toFixed(2)}</p>
              <p className="font-semibold">Payment Status:</p>
              <p>{order.payment_status || 'Pending'}</p>
            </div>

            {order.details?.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold border-b pb-1 mb-3">Analyte Details</h2>
                <ul className="space-y-3">
                  {order.details.map((item, index) => (
                    <li key={index} className="border-b pb-3">
                      <p><span className="font-medium">Analyte:</span> {item.analyte_name}</p>
                      <p><span className="font-medium">Method:</span> {item.method_name}</p>
                      <p><span className="font-medium">Turnaround:</span> {item.turnaround_time}</p>
                      <p><span className="font-medium">Quantity:</span> {item.required_quantity}</p>
                      <p><span className="font-medium">Pump Quantity:</span> {item.required_pumps ?? 0}</p>
                      <p><span className="font-medium">Media Quantity:</span> {item.required_media ?? 'N/A'}</p>
                      <p><span className="font-medium">Price:</span> ${parseFloat(item.price).toFixed(2)}</p>
                      {item.customer_comment && (
                        <p><span className="font-medium">Comments:</span> {item.customer_comment}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {order.equipment_items?.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold border-b pb-1 mb-3">Equipment Rental</h2>
                <ul className="space-y-3">
                  {order.equipment_items.map((item, index) => (
                    <li key={index} className="border-b pb-3">
                      <p><span className="font-medium">Equipment:</span> {item.equipment_name}</p>
                      <p><span className="font-medium">Category:</span> {item.category}</p>
                      <p><span className="font-medium">Start Date:</span> {item.start_date}</p>
                      <p><span className="font-medium">Return Date:</span> {item.return_date}</p>
                      <p><span className="font-medium">Quantity:</span> {item.quantity}</p>
                      <p><span className="font-medium">Daily Cost:</span> ${parseFloat(item.daily_cost).toFixed(2)}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="border-t pt-4 mt-4 text-right">
              <p className="font-bold">Total: ${parseFloat(order.subtotal).toFixed(2)}</p>
            </div>

            <div className="mt-8 text-center text-xs text-gray-500">
              <p>Thank you for your business!</p>
              <p>For any questions, please contact our support team.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
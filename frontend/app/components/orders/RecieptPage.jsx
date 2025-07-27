"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

//helper
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ReceiptPage() {
  const params = useSearchParams();
  const orderId = params.get("order_id");
  const status = params.get("status");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    fetch(`/api/orders/full/${orderId}`)
      .then((res) => res.json())
      .then((data) => {
        setOrder(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [orderId]);

  if (loading) return <p className="text-center">Loading receipt...</p>;
  if (!order) return <p className="text-center text-red-500">Order not found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 border rounded shadow-sm bg-white">
      <h1 className="text-2xl font-bold mb-2 text-green-700">
        Payment {status === "approved" ? "Successful" : "Failed"}
      </h1>
      <p className="text-sm text-gray-600 mb-4">
        Thank you for your order. Below is your receipt.
      </p>

      <div className="mb-6 space-y-1">
        <p><strong>Order ID:</strong> {order.id}</p>
        <p><strong>Date:</strong> {formatDate(order.order_date)}</p>
        <p><strong>Status:</strong> {order.payment_status || "Pending"}</p>
        <p><strong>Subtotal:</strong> ${order.subtotal.toFixed(2)}</p>
      </div>

      <h2 className="text-xl font-semibold mb-2">Order Items</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm text-left">
          <thead>
  <tr>
    <th>Analyte</th>
    <th>Method</th>
    <th>Turnaround</th>
    <th>Qty</th>
    <th>Pumps</th>
    <th>Media</th>
    <th>Price</th>
    <th>Comments</th>
  </tr>
</thead>
<tbody>
  {order.details.map((item, idx) => (
    <tr key={idx}>
      <td>{item.analyte_name}</td>
      <td>{item.method_name}</td>
      <td>{item.turnaround_time}</td>
      <td>{item.quantity}</td>
      <td>{item.quantity_pumps}</td>
      <td>{item.quantity_media}</td>
      <td>${item.price.toFixed(2)}</td>
      <td>{item.comments || "-"}</td>
    </tr>
  ))}
</tbody>
        </table>
      </div>

      <p className="mt-6 text-center text-sm text-gray-500">
        You will receive a confirmation email with your receipt shortly.
      </p>
    </div>
  );
}
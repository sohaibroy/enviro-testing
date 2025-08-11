"use client";
import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { OrdersListItem } from "../components/orders/OrdersListItem";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function CustomerPortalPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchOrders(); }, []);

  async function fetchOrders() {
    try {
      const userJson = typeof window !== "undefined" ? sessionStorage.getItem("user") : null;
      const user = userJson ? JSON.parse(userJson) : null;
      const accountId = (user && (user.account_id || user.id)) || null;

      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/my-orders`);
      if (accountId) url.searchParams.set("account_id", String(accountId));

      const res = await fetch(url.toString(), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load orders");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  async function handlePayNow(orderId) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}/checkout-session`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Could not start checkout");

      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe failed to initialize");
      const { error } = await stripe.redirectToCheckout({ sessionId: data.id });
      if (error) alert(error.message);
    } catch (e) {
      alert(e.message || "Payment error");
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <OrdersListItem
              key={o.order_id}
              order={o}
              showPayControls
              onPayNow={handlePayNow}
              hideAdminActions
            />
          ))}
        </div>
      )}
    </div>
  );
}
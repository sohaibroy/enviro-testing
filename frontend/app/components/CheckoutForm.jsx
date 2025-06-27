"use client";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useState } from "react";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [status, setStatus] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Processing...");

    try {
      const res = await fetch(`${baseUrl}/api/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 2000 }), // $20 dollars
      });

      const { clientSecret } = await res.json();

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            address: {
              postal_code: postalCode, // Send postal code manually to stri[e]
            },
          },
        },
      });

      if (result.error) {
        setStatus(`${result.error.message}`);
      } else if (result.paymentIntent.status === "succeeded") {
        setStatus("Payment successful! I AM RICH WOOHOO");
      }
    } catch (error) {
      setStatus("You have no money.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <CardElement
        options={{
          style: { base: { fontSize: "16px" } },
          hidePostalCode: true, // hiding the default stripe ZIP Code
        }}
        className="border p-4 rounded"
      />

      {/* Added custom postal code field in the payment */}
      <input
        type="text"
        placeholder="Postal Code"
        value={postalCode}
        onChange={(e) => setPostalCode(e.target.value)}
        className="border p-2 rounded w-full"
      />

      <button
        type="submit"
        disabled={!stripe}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Pay $20 CAD PLZ
      </button>

      {status && <p className="text-sm mt-2">{status}</p>}
    </form>
  );
}
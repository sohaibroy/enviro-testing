// "use client";
// import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
// import { useState } from "react";
// const baseUrl = process.env.NEXT_PUBLIC_API_URL;

// export default function CheckoutForm() {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [status, setStatus] = useState("");
//   const [postalCode, setPostalCode] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setStatus("Processing...");

//     try {
//       const res = await fetch(`${baseUrl}/api/create-payment-intent`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ amount: 2000 }), // $20 dollars
//       });

//       const { clientSecret } = await res.json();

//       const result = await stripe.confirmCardPayment(clientSecret, {
//         payment_method: {
//           card: elements.getElement(CardElement),
//           billing_details: {
//             address: {
//               postal_code: postalCode, // Send postal code manually to stri[e]
//             },
//           },
//         },
//       });

//       if (result.error) {
//         setStatus(`${result.error.message}`);
//       } else if (result.paymentIntent.status === "succeeded") {
//         setStatus("Payment successful! I AM RICH WOOHOO");
//       }
//     } catch (error) {
//       setStatus("You have no money.");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
//       <CardElement
//         options={{
//           style: { base: { fontSize: "16px" } },
//           hidePostalCode: true, // hiding the default stripe ZIP Code
//         }}
//         className="border p-4 rounded"
//       />

//       {/* Added custom postal code field in the payment */}
//       <input
//         type="text"
//         placeholder="Postal Code"
//         value={postalCode}
//         onChange={(e) => setPostalCode(e.target.value)}
//         className="border p-2 rounded w-full"
//       />

//       <button
//         type="submit"
//         disabled={!stripe}
//         className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//       >
//         Pay $20 CAD PLZ
//       </button>

//       {status && <p className="text-sm mt-2">{status}</p>}
//     </form>
//   );
// }


"use client";
import { useState } from "react";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export default function MonerisCheckoutForm() {
  const [status, setStatus] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Redirecting to Moneris...");

    try {
      const res = await fetch(`${baseUrl}/api/moneris/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 20.0, 
          postal_code: postalCode,
        }),
      });

      const data = await res.json();
      const { redirectUrl, payload } = data;

      // Create and submit a form to Moneris
      const form = document.createElement("form");
      form.method = "POST";
      form.action = redirectUrl;

      Object.entries(payload).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      console.error(err);
      setStatus("Failed to initiate Moneris payment.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <input
        type="text"
        placeholder="Postal Code"
        value={postalCode}
        onChange={(e) => setPostalCode(e.target.value)}
        className="border p-2 rounded w-full"
      />

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Pay $20 CAD on Moneris Website
      </button>

      {status && <p className="text-sm mt-2">{status}</p>}
    </form>
  );
}
"use client";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../components/CheckoutForm"; 

//STRIPE KEYYY
const stripePromise = loadStripe("pk_test_51RYczePMyO2VbquMk4DjMBit9TmcTC8fmu6yAjlQaalTuKykDRUatrtNVKleQEkxilpX1WtUU3qhpjV8IvRcKE8z00ZhTxMd0C"); 

export default function CheckoutPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
}
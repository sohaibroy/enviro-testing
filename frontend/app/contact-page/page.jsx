"use client";

import React from "react";
// import ContactUsForm from "@/components/contact-us/ContactUsForm";
import ContactUsForm from "../components/contact-us/ContactUsForm";

// Contact Us page 
// <ContactUsForm> is the actual form imported that the user fills out

export default function ContactPage() {
  return (
    <main className="flex flex-col items-center justify-start p-4 min-h-screen bg-white text-black">
      <div className="w-full max-w-4xl mt-8">
        <ContactUsForm />
      </div>
    </main>
  );
}

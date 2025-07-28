"use client";

import React, { useState } from "react";
import BasePopup from "../basic/BasePopup";
import { ValidationInput } from "../basic/ValidationInput";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export function ReturnEquipmentPopup({ isOpen, onClose, equipment, onReturnSuccess }) {
  const [quantity, setQuantity] = useState("");
  const [orderId, setOrderId] = useState(""); 
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleReturn = async () => {
    setError("");
    setSuccess("");

    if (!orderId || !quantity) {
      setError("Order ID and quantity are required.");
      return;
    }

    try {
      const res = await fetch(`${baseUrl}/api/equipment/return`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_id: parseInt(orderId),
          equipment_name: equipment.equipment_name,
          quantity: parseInt(quantity),
        }),
      });

      if (!res.ok) throw new Error("Return failed");

      setSuccess("Equipment returned successfully");
      setTimeout(() => {
        setSuccess("");
        onReturnSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
      setError("Failed to return equipment.");
    }
  };

  return (
    <BasePopup
      isOpen={isOpen}
      onClose={onClose}
      title={`Return Equipment - ${equipment?.equipment_name}`}
      activityText="Return"
      onActivityClicked={handleReturn}
    >
      <ValidationInput
        title="Order ID"
        type="number"
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
      />

      <ValidationInput
        title="Quantity to Return"
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />

      {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}
      {success && <p className="text-green-600 font-semibold mt-2">{success}</p>}
    </BasePopup>
  );
}
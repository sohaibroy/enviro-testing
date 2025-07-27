'use client';

import React, { useState, useEffect } from "react";
import { LoadingIcon } from "../loading/LoadingIcon";
import { MdAddShoppingCart } from "react-icons/md";
import { useRouter } from "next/navigation";

const QuantityDetails = ({ quantityData }) => {
  const [required_pumps, setRequiredPumps] = useState(0);
  const [required_media, setRequiredMedia] = useState(0);
  const [customer_comment, setCustomerComment] = useState("");
  const router = useRouter();

  const [selectedTurnaroundTime, setSelectedTurnaroundTime] = useState(
    quantityData[0]?.turn_around_times.find((time) => time.is_default_price === 1) || null
  );

  //Store full turnaround object in sessionStorage when selection changes
  useEffect(() => {
    if (selectedTurnaroundTime) {
      sessionStorage.setItem("selectedTurnaround", JSON.stringify({
        id: selectedTurnaroundTime.turn_around_id,
        label: selectedTurnaroundTime.turnaround_time
      }));
      sessionStorage.setItem("selectedPrice", selectedTurnaroundTime.price?.toString() || "0");
    }
  }, [selectedTurnaroundTime]);

  //dropdown change, update selectedTurnaroundTime and sessionStorage
  const handleTurnaroundTimeChange = (e) => {
    const selected = quantityData[0]?.turn_around_times.find(
      (time) => time.turn_around_id === parseInt(e.target.value)
    );

    if (selected) {
      sessionStorage.setItem("selectedTurnaround", JSON.stringify({
        id: selected.turn_around_id,
        label: selected.turnaround_time
      }));
      sessionStorage.setItem("selectedPrice", selected.price?.toString() || "0");
      setSelectedTurnaroundTime(selected);
    }
  };

  const handleAddToCart = () => {
    const existingCartItems = JSON.parse(sessionStorage.getItem("cartItems")) || [];
    const updatedCartItems = [
      ...existingCartItems,
      {
        ...quantityData[0],
        matrix: quantityData[0]?.matrix,
        media: quantityData[0]?.media,
        measurement: quantityData[0]?.measurement,
        sample_rate: quantityData[0]?.sample_rate,
        limit_of_quantification: quantityData[0]?.limit_of_quantification,
        required_pumps,
        required_media,
        customer_comment,
        required_quantity: 1,
        selectedTurnaroundTime,
      },
    ];

    sessionStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    sessionStorage.setItem("selectedMethodId", quantityData[0]?.method_id);
    router.push("/view-cart");
  };

  if (!quantityData) return <LoadingIcon />;

  const method = quantityData[0];

  return (
    <div className="bg-white border border-gray-100 shadow-2xl p-6 sm:p-8 md:p-10 rounded-xl w-full mb-6 sm:mb-10 md:mb-20 overflow-x-hidden">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-enviro_orange">{method.analyte_name}</h1>
          <h2 className="text-xl font-semibold text-enviro_blue">{method.method_name}</h2>
        </div>

        {/* Info Fields */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Info */}
          <div className="w-full md:w-1/2 space-y-4 text-black">
            <p><span className="font-semibold">Matrix:</span> {method.matrix}</p>
            <p><span className="font-semibold">Media:</span> {method.media}</p>
            <p><span className="font-semibold">Measurement:</span> {method.measurement}</p>
            <p><span className="font-semibold">Sample Rate:</span> {method.sample_rate}</p>
            <p><span className="font-semibold">Limit of Quantification:</span> {method.limit_of_quantification}</p>
            <p><span className="font-semibold">Time Frame:</span> {selectedTurnaroundTime?.turnaround_time || "N/A"}</p>
            <p><span className="font-semibold">Price:</span> ${selectedTurnaroundTime?.price || "N/A"}</p>
          </div>

          {/* Right Controls */}
          <div className="w-full md:w-1/2 space-y-5">
            {/* Turnaround Dropdown */}
            <div>
              <label htmlFor="turnaround_time" className="block font-semibold mb-1">
                Turnaround Times:
              </label>
              <select
                id="turnaround_time"
                value={selectedTurnaroundTime?.turn_around_id || ""}
                onChange={handleTurnaroundTimeChange}
                className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-enviro_blue"
              >
                {method.turn_around_times.map((time) => (
                  <option key={time.turn_around_id} value={time.turn_around_id}>
                    {time.turnaround_time} - ${time.price}
                  </option>
                ))}
              </select>
            </div>

            {/* Required Media */}
            <div>
              <label htmlFor="required_media" className="block font-semibold mb-1">
                Required Media:
              </label>
              <input
                type="number"
                id="required_media"
                min="0"
                defaultValue={0}
                onChange={(e) => setRequiredMedia(parseInt(e.target.value))}
                className="w-full border border-gray-300 p-2 rounded-md"
              />
            </div>

            {/* Required Pumps */}
            <div>
              <label htmlFor="required_pumps" className="block font-semibold mb-1">
                Required Pumps:
              </label>
              <input
                type="number"
                id="required_pumps"
                min="0"
                defaultValue={0}
                onChange={(e) => setRequiredPumps(parseInt(e.target.value))}
                className="w-full border border-gray-300 p-2 rounded-md"
              />
            </div>

            {/* Comments */}
            <div>
              <label htmlFor="customer_comment" className="block font-semibold mb-1">
                Comments:
              </label>
              <textarea
                id="customer_comment"
                value={customer_comment}
                onChange={(e) => setCustomerComment(e.target.value)}
                rows={4}
                className="w-full border border-gray-300 p-2 rounded-md resize-none"
                placeholder="Leave a comment..."
                maxLength={255}
              />
            </div>
          </div>
        </div>

        {/* Optional Add to Cart button (commented out) */}
        {/* 
        <div className="flex justify-end">
          <button
            onClick={handleAddToCart}
            className={`flex items-center bg-enviro_blue text-white px-6 py-3 rounded-md hover:scale-105 transition-transform ${
              !selectedTurnaroundTime ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={!selectedTurnaroundTime}
          >
            <MdAddShoppingCart className="mr-2" />
            Add to Cart
          </button>
        </div>
        */}
      </div>
    </div>
  );
};

export default QuantityDetails;


'use client';

import React, { useState, useEffect } from "react";
import { LoadingIcon } from "../loading/LoadingIcon";

const QuantityDetails = ({ quantityData, onSelectOptions }) => {
  const [required_pumps, setRequiredPumps] = useState(0);
  const [required_media, setRequiredMedia] = useState(0);
  const [customer_comment, setCustomerComment] = useState("");

  const [selectedTurnaroundTime, setSelectedTurnaroundTime] = useState(
    quantityData[0]?.turn_around_times.find((time) => time.is_default_price === 1) || null
  );

  // Update sessionStorage and notify parent with all selections
  useEffect(() => {
    if (selectedTurnaroundTime) {
      const turnaround = {
        id: selectedTurnaroundTime.turn_around_id,
        label: selectedTurnaroundTime.turnaround_time,
      };
      const price = selectedTurnaroundTime.price?.toString() || "0";

      sessionStorage.setItem("selectedTurnaround", JSON.stringify(turnaround));
      sessionStorage.setItem("selectedPrice", price);

      if (onSelectOptions) {
        onSelectOptions({
          turnaround,
          price,
          required_pumps,
          required_media,
          customer_comment,
        });
      }
    }
  }, [selectedTurnaroundTime, required_pumps, required_media, customer_comment]);

  const handleTurnaroundTimeChange = (e) => {
    const selected = quantityData[0]?.turn_around_times.find(
      (time) => time.turn_around_id === parseInt(e.target.value)
    );
    if (selected) {
      setSelectedTurnaroundTime(selected);
    }
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
                value={required_media}
                onChange={(e) => setRequiredMedia(parseInt(e.target.value) || 0)}
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
                value={required_pumps}
                onChange={(e) => setRequiredPumps(parseInt(e.target.value) || 0)}
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
      </div>
    </div>
  );
};

export default QuantityDetails;


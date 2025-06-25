"use client";

import React, { useState } from "react";
import { LoadingIcon } from "../loading/LoadingIcon";
import { MdAddShoppingCart } from "react-icons/md";
import { useRouter } from "next/navigation";

const QuantityDetails = ({ quantityData }) => {
  const [required_pumps, setRequiredPumps] = useState(0);
  const [required_media, setRequiredMedia] = useState(0);
  const [customer_comment, setCustomerComment] = useState("");
  const router = useRouter();
  const [selectedTurnaroundTime, setSelectedTurnaroundTime] = useState(
    quantityData[0]?.turn_around_times.find(
      (time) => time.is_default_price === 1
    ) || null
  );

  const handleTurnaroundTimeChange = (e) => {
    const selectedTurnaround = quantityData[0]?.turn_around_times.find(
      (time) => time.turn_around_id === parseInt(e.target.value)
    );

    setSelectedTurnaroundTime(selectedTurnaround);
  };

  const handleAddToCart = () => {
    if (typeof window !== "undefined") {
      const existingCartItems =
        JSON.parse(sessionStorage.getItem("cartItems")) || [];
      const updatedCartItems = [
        ...existingCartItems,
        {
          ...quantityData[0],
          matrix: quantityData[0]?.matrix, 
          media: quantityData[0]?.media, 
          measurement: quantityData[0]?.measurement, 
          sample_rate: quantityData[0]?.sample_rate, 
          limit_of_quantification: quantityData[0]?.limit_of_quantification,
          required_pumps: required_pumps,
          required_media: required_media,
          customer_comment: customer_comment,
          required_quantity: 1,
          selectedTurnaroundTime: selectedTurnaroundTime,
        },
      ];
      sessionStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
      //ADDED THIS LINE
      sessionStorage.setItem("selectedMethodId", quantityData[0]?.method_id);
      router.push("/view-cart");
    }
  };

  return (
    <div className="bg-white border-grey-50 border-[.025rem] drop-shadow-2xl p-[2rem] mb-[4rem] rounded-xl flex">
      {quantityData ? (
        <div className="w-full flex flex-wrap justify-between gap-y-[2rem]">
          <section className="w-full flex flex-col gap-[.5rem]">
            <h1 className="text-2xl font-semibold text-enviro_orange">
              {quantityData[0]?.analyte_name}
            </h1>
            <h2 className="text-xl font-semibold text-enviro_blue">
              {quantityData[0]?.method_name}
            </h2>
          </section>
          <section className="w-full md:w-[49%] flex flex-col gap-[1rem] text-black">
            <p className="flex justify-between gap-[1rem]">
              <span className="font-semibold">Matrix:</span>
              {quantityData[0]?.matrix}
            </p>
            <p className="flex justify-between gap-[1rem]">
              <span className="font-semibold">Media:</span>
              {quantityData[0]?.media}
            </p>
            <p className="flex justify-between gap-[1rem]">
              <span className="font-semibold">Measurement:</span>
              {quantityData[0]?.measurement}
            </p>
            <p className="flex justify-between gap-[1rem]">
              <span className="font-semibold">Sample Rate:</span>
              {quantityData[0]?.sample_rate}
            </p>
            <p className="flex justify-between gap-[1rem]">
              <span className="font-semibold">Limit of Quantification:</span>
              {quantityData[0]?.limit_of_quantification}
            </p>
            <p className="flex justify-between gap-[1rem]">
              <span className="font-semibold">Time Frame:</span>
              {selectedTurnaroundTime
                ? selectedTurnaroundTime.turnaround_time
                : "N/A"}
            </p>
            <p className="flex justify-between gap-[1rem]">
              <span className="font-semibold">Price:</span>$
              {selectedTurnaroundTime ? selectedTurnaroundTime.price : "N/A"}
            </p>
          </section>

          <section className="w-full md:w-[49%] flex flex-col gap-[1rem] text-black">
            <div className="flex justify-between items-center">
              <label htmlFor="turnaround_time" className="font-semibold">
                Turnaround Times:
              </label>
              <select
                id="turnaround_time"
                value={selectedTurnaroundTime?.turn_around_id || ""}
                onChange={handleTurnaroundTimeChange}
                className="border border-gray-300 p-2 rounded-md text-sm text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-[#003883] focus:border-transparent w-[10rem]"
              >
                {quantityData &&
                quantityData[0]?.turn_around_times.length > 0 ? (
                  quantityData[0]?.turn_around_times.map((time) => (
                    <option
                      key={time.turn_around_id}
                      value={time.turn_around_id}
                    >
                      {time.turnaround_time} - ${time.price}
                    </option>
                  ))
                ) : (
                  <option value="NA">N/A</option>
                )}
              </select>
            </div>
            <div className="flex justify-between items-center">
              <label htmlFor="required_media" className="block font-semibold">
                Required Media:
              </label>
              <input
                type="number"
                id="required_media"
                name="required_media"
                defaultValue="0"
                onChange={(e) => setRequiredMedia(parseInt(e.target.value))}
                min="0"
                className="appearance-none border border-gray-300 p-2 rounded-md text-sm text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#003883] focus:border-transparent w-[6rem]"
              />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="required_pumps" className="block font-semibold">
                Required Pump:
              </label>
              <input
                type="number"
                id="required_pumps"
                name="required_pumps"
                defaultValue="0"
                onChange={(e) => setRequiredPumps(parseInt(e.target.value))}
                min="0"
                className="appearance-none border border-gray-300 p-2 rounded-md text-sm text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#003883] focus:border-transparent w-[6rem]"
              />
            </div>
            <div className="flex justify-between mt-[1rem]">
              <h3 className="font-semibold">Comments:</h3>
              <textarea
                className="border border-gray-300 ml-3 p-2 rounded-md w-full max-w-[40rem] min-w-[5rem] max-h-[8rem] min-h-[5rem] text-black"
                placeholder="Leave a comment..."
                maxLength={255}
                value={customer_comment}
                onChange={(e) => setCustomerComment(e.target.value)}
              />
            </div>
          </section>

          <section className="w-full flex justify-end gap-4">
            <button
              onClick={handleAddToCart}
              className={` text-white px-4 py-2 rounded-md flex items-center ${
                selectedTurnaroundTime === null
                  ? "bg-gray-400"
                  : "bg-enviro_blue transition-all hover:scale-[102%] duration-300"
              }`}
              disabled={selectedTurnaroundTime === null}
            >
              <MdAddShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </button>
          </section>
        </div>
      ) : (
        <LoadingIcon />
      )}
    </div>
  );
};

export default QuantityDetails;

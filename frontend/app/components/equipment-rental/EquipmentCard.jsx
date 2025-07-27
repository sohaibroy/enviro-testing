import React, { useState, useEffect } from "react";
import NotificationPopup from "../popup/NotificationPopup";
function EquipmentRentalCard({ equipment }) {
    const [quantity, setQuantity] = useState(1);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [popupMessage, setPopupMessage] = useState("");
    const [popupTitle, setPopupTitle] = useState("");
    const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false);
    const [availableOnDate, setAvailableOnDate] = useState(true);
    const [serials, setSerials] = useState([]);
    const [availableQuantity, setAvailableQuantity] = useState(0);
    const [isSerialsLoading, setIsSerialsLoading] = useState(true);
    const [showAddedMessage, setShowAddedMessage] = useState(false);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!equipment) return null;

    const {
        equipment_id,
        serial_number,
        equipment_name,
        image_url,
        equipment_type_name,
        daily_cost,
        custom_price,
        description,
        specsheet,
    } = equipment;

    const category_name = equipment_type_name ?? "No category";
    const finalPrice = custom_price ?? daily_cost;

    useEffect(() => {
        const fetchRelatedSerials = async () => {
            try {
                const res = await fetch(`${baseUrl}/api/public/equipment/${equipment.equipment_id}/serials`);
                if (!res.ok) throw new Error("Failed to fetch related serials");

                const data = await res.json();
                setSerials(data);

                const available = data.filter((s) => s.status === "available").length;
                setAvailableQuantity(available);
                 if (available === 0) {
                setQuantity(0);
            } else if (quantity > available) {
                // If current quantity exceeds new availability, adjust it 
                setQuantity(available);
            }
            } catch (err) {
                console.error("Failed to load serial list:", err);
            } finally {
                setIsSerialsLoading(false);
            }
        };

        if (equipment?.equipment_id) {
            fetchRelatedSerials();
        }
    }, [equipment?.equipment_id]);

    const handleEndDateChange = (e) => {
        const selectedDate = e.target.value;
        setEndDate(selectedDate);

        const unavailableDates = ["2025-02-28", "2025-03-05"];
        setAvailableOnDate(!unavailableDates.includes(selectedDate));

        if (new Date(selectedDate) <= new Date(startDate)) {
            setPopupTitle("Invalid Date Selection");
            setPopupMessage("Return date must be after the start date.");
            setIsErrorPopupOpen(true);
            setEndDate("");
        }
    };

    const handleQuantityChange = (e) => {
        const newQuantity = Number(e.target.value);
        setQuantity(Math.max(1, Math.min(newQuantity, availableQuantity)));
    };

    const handleAddToCart = () => {
        if (!startDate || !endDate || new Date(endDate) <= new Date(startDate)) {
            setPopupTitle("Invalid Rental Details");
            setPopupMessage(
                !startDate
                    ? "Please select a start date."
                    : !endDate
                        ? "Please select a return date."
                        : "Return date must be after the start date."
            );
            setIsErrorPopupOpen(true);
            return;
        }
        
        if (availableQuantity === 0 ) {
            setPopupTitle("Out of Stock");
            setPopupMessage("This equipment is currently out of stock.");
            setIsErrorPopupOpen(true);
            return;
        }
         if (quantity < 1) {
        setPopupTitle("Invalid Quantity");
        setPopupMessage("Please select at least 1 item.");
        setIsErrorPopupOpen(true);
        return;
    }

        const rentalCart = JSON.parse(sessionStorage.getItem("rentalCart")) || [];
        const newItem = {
            EquipmentID: equipment_id,
            EquipmentName: equipment_name,
            Category: category_name,
            SerialNumber: serial_number,
            DailyCost: finalPrice,
            Quantity: quantity,
            StartDate: startDate,
            ReturnDate: endDate,
            ImageUrl: image_url,
        };
      const editIndex = sessionStorage.getItem("editEquipmentIndex");

  if (editIndex !== null) {
   
    rentalCart[parseInt(editIndex)] = newItem;
    sessionStorage.removeItem("editEquipmentIndex");
    sessionStorage.removeItem("selectedEquipment");
  } else {
        rentalCart.push(newItem);
  }

      sessionStorage.setItem("rentalCart", JSON.stringify(rentalCart));
      window.dispatchEvent(new Event("cartUpdated"));
        
        // Show added message and hide after 3 seconds
      setShowAddedMessage(true);
        setTimeout(() => setShowAddedMessage(false), 3000);
    };

    return (
        <div className="bg-white shadow-lg rounded-xl p-10 transition-transform hover:scale-105 border border-gray-200 max-w-[45rem]">
            <div className="flex flex-col items-center text-center">
                <img
                    src={image_url || "https://via.placeholder.com/150"}
                    alt={equipment_name}
                    className="w-full h-44 object-cover rounded-lg mb-3"
                />

                <h2 className="text-lg font-bold text-gray-900 leading-tight">{equipment_name}</h2>

                <p className="text-sm text-e mt-1">
                    Type: <span className="font-semibold text-[#003883]">{category_name}</span>
                </p>

                <p className="text-sm text-gray-600 mt-1">
                    Spec Sheet:{" "}
                    {specsheet ? (
                        <a
                            href={specsheet}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline hover:text-[#003883]"
                        >
                            View
                        </a>
                    ) : (
                        <span className="italic text-gray-400">Not available</span>
                    )}
                </p>

                {description && <p className="text-sm text-gray-500 mt-2 italic">{description}</p>}

                {Array.isArray(equipment.attributes) && equipment.attributes.length > 0 && (
                    <div className="mt-2 text-sm text-left w-full">
                        <h3 className="font-semibold text-gray-700 mb-1">Specifications:</h3>
                        <ul className="list-disc list-inside text-gray-600">
                            {equipment.attributes.map((attr) => (
                                <li key={attr.attribute_id}>
                                    <span className="text-gray-800 font-medium">{attr.attribute_name}:</span>{" "}
                                    {attr.value}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {isSerialsLoading ? (
                    <p className="mt-2 text-sm italic text-gray-500">Checking availability...</p>
                ) : (
                    <p
                        className={`mt-2 text-sm font-semibold ${availableQuantity > 0 ? "text-[#003883]" : "text-[#EE7D11]"
                            }`}
                    >
                        {availableQuantity > 0 ? `Available: ${availableQuantity}` : "Out of Stock"}
                    </p>
                )}

                <div className="mt-3 bg-gray-100 p-2 rounded-md w-full text-sm text-center">
                    <span className="text-base font-semibold">Daily Pricing:</span>{" "}
                    <span className="text-base text-gray-800">${finalPrice?.toFixed(2) ?? "N/A"}</span>
                    {custom_price && (
                        <span className="ml-2 text-green-600 font-medium text-sm">(Client Rate:)</span>
                    )}
                </div>

                <div className="mt-6 flex flex-col gap-4 w-full text-sm text-left">
                    <div className="flex items-center gap-6">
                        <label className="text-base font-semibold min-w-[6rem]">Quantity:</label>
                        <input
                            type="number"
                            className="w-20 border border-gray-300 rounded-md px-2 py-1 text-gray-700"
                            value={quantity}
                            onChange={handleQuantityChange}
                            min={availableQuantity === 0 ? 0 : 1}
                            max={availableQuantity}
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        <label className="text-base font-semibold min-w-[6rem]">Start Date:</label>
                        <input
                            type="date"
                            className="w-44 border border-gray-300 rounded-md px-2 py-1 text-gray-700"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        <label className="text-base font-semibold min-w-[6rem]">Return Date:</label>
                        <input
                            type="date"
                            className="w-44 border border-gray-300 rounded-md px-2 py-1 text-gray-700"
                            value={endDate}
                            onChange={handleEndDateChange}
                            disabled={!startDate}
                        />
                    </div>
                </div>

                {/* Added to cart message */}
                {showAddedMessage && (
                    <div className="w-full mt-2 p-2 bg-green-100 text-green-800 rounded-md text-sm">
                        Added to cart successfully!
                    </div>
                )}

                <button
                    className="mt-5 w-full bg-[#003883] text-white py-3 rounded-md font-bold hover:bg-[#002f6c] disabled:bg-[#EE7D11] disabled:cursor-not-allowed transition-all"
                    onClick={handleAddToCart}
                    disabled={availableQuantity === 0 || !availableOnDate}
                >
                    {availableQuantity > 0 && availableOnDate ? "Add To Cart" : "Unavailable"}
                </button>
            </div>

        
            <NotificationPopup
                isOpen={isErrorPopupOpen}
                onClose={() => setIsErrorPopupOpen(false)}
                onActivityClicked={() => setIsErrorPopupOpen(false)}
                activityText="OK"
                title={popupTitle}
            >
                <p className="text-gray-700">{popupMessage}</p>
            </NotificationPopup>
        </div>
    );
}

export default EquipmentRentalCard;
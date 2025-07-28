"use client";

import React, { useState, useEffect } from "react";
import { BaseListItem } from "../basic/BaseListItem";
import { EquipmentUpdatePopup } from "./EquipmentUpdatePopup";
import { EquipmentSerialStatusPopup } from "./EquipmentSerialList";
import { ReturnEquipmentPopup } from "./ReturnEquipmentPopup";
import BasePopup from "../basic/BasePopup";
import { isTokenExpired } from "@/utils/session";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;


function EquipmentCRUDListItem({ equipment, fetchEquipment }) {
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [isSkuPopupOpen, setIsSkuPopupOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [serials, setSerials] = useState([]);
    const [calculatedAvailable, setCalculatedAvailable] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isReturnPopupOpen, setIsReturnPopupOpen] = useState(false);


    useEffect(() => {
    if (!equipment?.equipment_id) return;

    const accessToken = sessionStorage.getItem("accessToken");

    if (!accessToken) {
        alert("You are not logged in as an admin.");
        return;
    }

    const fetchRelatedSerials = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${baseUrl}/api/public/equipment/${equipment.equipment_id}/serials`);

            if (!res.ok) {
                const text = await res.text();
                console.error("Serial fetch error:", res.status, text);
                throw new Error(`Failed to fetch related serials (status ${res.status})`);
            }

            const data = await res.json(); // ✅ FIX
            setSerials(data);              // ✅ Needed for popup
            calculateAvailableSerials(data);
        } catch (err) {
            console.error("Failed to load serial list:", err);
            alert("Could not load related serials.");
        } finally {
            setIsLoading(false);
        }
    };

    fetchRelatedSerials();
}, [equipment?.equipment_id]);

    // Calculate how many serials are available
    const calculateAvailableSerials = (serialList) => {
        const availableCount = serialList.filter((serial) => serial.status === "available").length;
        setCalculatedAvailable(availableCount);
    };

    const handleUpdateClose = () => {
        fetchEquipment();
        setIsUpdateOpen(false);
    };

    const handleSkuPopupClose = () => {
        setIsSkuPopupOpen(false);
    };


    const handleDelete = () => {
        if (isTokenExpired()) {
            window.location.href = "/admin-login";
            return;
        }

        //fetch(`http://localhost:80/api/equipment/${equipment.equipment_id}`, {
        fetch(`${baseUrl}/api/equipment/${equipment.equipment_id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to delete equipment");
                return res.json();
            })
            .then(() => {
                setIsDeleteOpen(false);
                fetchEquipment(); // refresh the list
            })
            .catch((err) => {
                console.error("Delete error:", err);
                alert("There was a problem deleting this equipment.");
            });
    };

    return (
        <BaseListItem className="flex justify-between items-start gap-4">
            {/* Left info block */}
            <div className="flex flex-wrap w-[80%]">
                <p className={`text-xl font-bold mb-2 w-full ${equipment.is_active ? "text-[#003883]" : "text-[#EE7D11]"}`}>
                    {equipment.is_active ? "Active" : "Inactive"}
                </p>

                <p className="text-xl font-semibold mb-2 w-full">
                    <span className="font-normal mr-[.25rem]">Name:</span>
                    {equipment.equipment_name}
                </p>

                <p className="text-xl font-semibold mb-2 w-full">
                    <span className="font-normal mr-[.25rem]">Model #:</span>
                    {equipment.model_number || "-"}
                </p>

                <p className="text-xl font-semibold mb-2 w-full">
                    <span className="font-normal mr-[.25rem]">Type:</span>
                    {equipment.equipment_type_name || "-"}
                </p>

                <p className="text-xl font-semibold mb-2 w-full">
                    <span className="font-normal mr-[.25rem]">Available:</span>
                    {isLoading ? (
                        <span className="italic text-gray-400">Loading Available Serial Numbers...</span>
                    ) : calculatedAvailable > 0 ? (
                        <span className="text-[#003883] font-bold">{calculatedAvailable}</span>
                    ) : (
                        <span className="text-[#EE7D11] italic font-semibold">All equipment in use.</span>
                    )}
                </p>


                <p className="text-xl font-semibold mb-2 w-full">
                    <span className="font-normal mr-[.25rem]">Daily Cost:</span>
                    ${equipment.daily_cost}
                </p>

                {equipment.description && (
                    <p className="text-xl font-semibold mb-2 w-full">
                        <span className="font-normal mr-[.25rem]">Description:</span>
                        {equipment.description}
                    </p>
                )}
            </div>

            {/* Right button stack */}
            <div className="flex flex-col justify-start gap-2 w-[10rem]">
                <button
                    className="bg-[#003883] p-2 rounded-md text-white shadow font-bold transition hover:scale-[101%]"
                    onClick={() => setIsUpdateOpen(true)}
                >
                    Edit
                </button>
                <button
                    className="bg-[#003883] p-2 rounded-md text-white shadow font-bold transition hover:scale-[101%]"
                    onClick={() => setIsSkuPopupOpen(true)}
                >
                    View Serial Numbers
                </button>
                <button
                    className="bg-[#ee7d11] p-2 rounded-md text-white shadow font-bold transition hover:scale-[101%]"
                    onClick={() => setIsDeleteOpen(true)}
                >
                    Delete
                </button>
                <button
  className="bg-[#003883] p-2 rounded-md text-white shadow font-bold transition hover:scale-[101%]"
  onClick={() => setIsReturnPopupOpen(true)}
>
  Return Equipment
</button>

            </div>

            {/* Delete confirmation popup */}
            <BasePopup
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                title="Confirm Delete"
                activityText="Delete"
                onActivityClicked={handleDelete}
                activityTextColor="text-[#ee7d11]"
            >
                <p className="text-lg font-semibold">
                    Are you sure you want to delete this equipment?
                </p>
            </BasePopup>

            {/* Update popup */}
            <EquipmentUpdatePopup
                equipment={equipment}
                title="Update Equipment"
                isOpen={isUpdateOpen}
                onClose={handleUpdateClose}
            />

            {/* Serial Status popup */}
            <EquipmentSerialStatusPopup
                equipment={equipment}
                isOpen={isSkuPopupOpen}
                onClose={handleSkuPopupClose}
                serialList={serials}
            />

            <ReturnEquipmentPopup
  isOpen={isReturnPopupOpen}
  onClose={() => setIsReturnPopupOpen(false)}
  equipment={equipment}
  onReturnSuccess={fetchEquipment}
/>
        </BaseListItem>

    );
}

export { EquipmentCRUDListItem };

"use client";

import React, { useState, useEffect } from "react";
import { BaseListItem } from "../basic/BaseListItem";
import { EquipmentUpdatePopup } from "./EquipmentUpdatePopup";
import { EquipmentSerialStatusPopup } from "./EquipmentSerialList";
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

    useEffect(() => {
        if (!equipment?.equipment_id) {
            console.warn("⛔ equipment_id missing, skipping serial fetch");
            return;
        }

        const accessToken = sessionStorage.getItem("accessToken");
        if (!accessToken) {
            alert("You are not logged in as an admin.");
            return;
        }

        const fetchRelatedSerials = async () => {
            setIsLoading(true);

            const url = `${baseUrl}/api/public/equipment/${equipment.equipment_id}/serials`;
            console.log(`📦 Fetching serials for equipment_id: ${equipment.equipment_id}`);
            console.log(`➡️ GET ${url}`);

            try {
                const res = await fetch(url);

                if (!res.ok) {
                    const text = await res.text();
                    console.error(`❌ API Error for ${url} — Status: ${res.status}`);
                    console.error(`❌ Response:`, text);
                    throw new Error(`Failed to fetch related serials (status ${res.status})`);
                }

                const data = await res.json();
                console.log(`✅ Received serials:`, data);

                setSerials(data);
                calculateAvailableSerials(data);
            } catch (err) {
                console.error("🚨 Serial fetch failed:", err);
                alert("Could not load related serials.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchRelatedSerials();
    }, [equipment?.equipment_id]);

    const calculateAvailableSerials = (serialList) => {
        const availableCount = serialList.filter((serial) => serial.status === "available").length;
        console.log(`📊 Calculated available serials: ${availableCount}`);
        setCalculatedAvailable(availableCount);
    };

    const handleUpdateClose = () => {
        console.log("🔄 Equipment updated, refreshing list");
        fetchEquipment();
        setIsUpdateOpen(false);
    };

    const handleSkuPopupClose = () => {
        console.log("📦 Serial popup closed");
        setIsSkuPopupOpen(false);
    };

    const handleDelete = () => {
        if (isTokenExpired()) {
            window.location.href = "/admin-login";
            return;
        }

        const url = `${baseUrl}/api/equipment/${equipment.equipment_id}`;
        console.log(`🗑 Attempting to delete equipment: ${equipment.equipment_id}`);

        fetch(url, {
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
                console.log(`✅ Equipment ${equipment.equipment_id} deleted`);
                setIsDeleteOpen(false);
                fetchEquipment();
            })
            .catch((err) => {
                console.error("❌ Delete error:", err);
                alert("There was a problem deleting this equipment.");
            });
    };

    return (
        <BaseListItem className="flex justify-between items-start gap-4">
            {/* Info Block */}
            <div className="flex flex-wrap w-[80%]">
                <p className={`text-xl font-bold mb-2 w-full ${equipment.is_active ? "text-[#003883]" : "text-[#EE7D11]"}`}>
                    {equipment.is_active ? "Active" : "Inactive"}
                </p>
                <p className="text-xl font-semibold mb-2 w-full"><span className="font-normal mr-[.25rem]">Name:</span>{equipment.equipment_name}</p>
                <p className="text-xl font-semibold mb-2 w-full"><span className="font-normal mr-[.25rem]">Model #:</span>{equipment.model_number || "-"}</p>
                <p className="text-xl font-semibold mb-2 w-full"><span className="font-normal mr-[.25rem]">Type:</span>{equipment.equipment_type_name || "-"}</p>

                <p className="text-xl font-semibold mb-2 w-full">
                    <span className="font-normal mr-[.25rem]">Available:</span>
                    {isLoading ? (
                        <span className="italic text-gray-400">Loading...</span>
                    ) : calculatedAvailable > 0 ? (
                        <span className="text-[#003883] font-bold">{calculatedAvailable}</span>
                    ) : (
                        <span className="text-[#EE7D11] italic font-semibold">All equipment in use.</span>
                    )}
                </p>

                <p className="text-xl font-semibold mb-2 w-full"><span className="font-normal mr-[.25rem]">Daily Cost:</span>${equipment.daily_cost}</p>

                {equipment.description && (
                    <p className="text-xl font-semibold mb-2 w-full">
                        <span className="font-normal mr-[.25rem]">Description:</span>
                        {equipment.description}
                    </p>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col justify-start gap-2 w-[10rem]">
                <button className="bg-[#003883] p-2 rounded-md text-white shadow font-bold transition hover:scale-[101%]" onClick={() => setIsUpdateOpen(true)}>Edit</button>
                <button className="bg-[#003883] p-2 rounded-md text-white shadow font-bold transition hover:scale-[101%]" onClick={() => setIsSkuPopupOpen(true)}>View Serial Numbers</button>
                <button className="bg-[#ee7d11] p-2 rounded-md text-white shadow font-bold transition hover:scale-[101%]" onClick={() => setIsDeleteOpen(true)}>Delete</button>
            </div>

            {/* Popups */}
            <BasePopup
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                title="Confirm Delete"
                activityText="Delete"
                onActivityClicked={handleDelete}
                activityTextColor="text-[#ee7d11]"
            >
                <p className="text-lg font-semibold">Are you sure you want to delete this equipment?</p>
            </BasePopup>

            <EquipmentUpdatePopup equipment={equipment} title="Update Equipment" isOpen={isUpdateOpen} onClose={handleUpdateClose} />
            <EquipmentSerialStatusPopup equipment={equipment} isOpen={isSkuPopupOpen} onClose={handleSkuPopupClose} serialList={serials} />
        </BaseListItem>
    );
}

export { EquipmentCRUDListItem };
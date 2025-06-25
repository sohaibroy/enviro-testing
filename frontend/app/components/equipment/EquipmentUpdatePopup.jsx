"use client";

import React, { useState, useEffect } from "react";
import BasePopup from "../basic/BasePopup";
import { ValidationInput } from "../basic/ValidationInput";
import { RadioBoolInput } from "../basic/RadioBoolInput";
import { isTokenExpired } from "@/utils/session";

const EquipmentUpdatePopup = ({ equipment, isOpen, onClose, title, fetchEquipment }) => {
    const [form, setForm] = useState({
        equipment_name: "",
        available_quantity: 0,
        daily_cost: 0,
        description: "",
        is_active: 1,
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");
    useEffect(() => {
        if (equipment) {
            setForm({
                equipment_name: equipment.equipment_name || "",
                available_quantity: equipment.available_quantity || 0,
                daily_cost: equipment.daily_cost || 0,
                description: equipment.description || "",
                is_active: equipment.is_active !== null ? equipment.is_active : 1,
            });
        }
    }, [equipment]);

    const validateInput = () => {
        const newErrors = {};
        if (!form.equipment_name.trim()) newErrors.equipment_name = "Equipment Name is required";
        if (form.available_quantity === "") newErrors.available_quantity = "Quantity is required";
        if (isNaN(form.available_quantity)) newErrors.available_quantity = "Quantity must be a number";
        if (form.available_quantity < 0) newErrors.available_quantity = "Quantity cannot be negative";
        if (form.daily_cost === "") newErrors.daily_cost = "Cost is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const updateEquipment = () => {
        if (!validateInput()) return;

        if (isTokenExpired()) {
            window.location.href = "/admin-login";
            return;
        }

        fetch(`http://localhost:80/api/equipment/update/${equipment.equipment_id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
            },
            body: JSON.stringify({
                equipment_name: form.equipment_name,
                description: form.description || null,
                daily_cost: parseFloat(form.daily_cost),
                available_quantity: parseInt(form.available_quantity),
                is_active: form.is_active ? 1 : 0,
                specsheet: null,
            }),
        })
            .then(() => {
                setSuccessMessage("Equipment updated successfully.");
                setTimeout(() => {
                    setSuccessMessage("");
                    onClose();
                }, 2000); // Show for 2 seconds before closing
            })
            .catch((error) => {
                console.error("error updating equipment:", error);
            });
    };

    return (
        <BasePopup
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            onActivityClicked={updateEquipment}
            activityText="Update"
        >
            <form className="flex flex-wrap justify-between gap-y-4">
                <ValidationInput
                    title="Equipment Name"
                    value={form.equipment_name}
                    className="md:w-full"
                    onChange={(e) => setForm({ ...form, equipment_name: e.target.value })}
                    errorMessage={errors.equipment_name}
                />

                <ValidationInput
                    title="Available Quantity"
                    type="number"
                    value={form.available_quantity}
                    className="md:w-full"
                    onChange={(e) => setForm({ ...form, available_quantity: e.target.value })}
                    errorMessage={errors.available_quantity}
                />

                <ValidationInput
                    title="Daily Cost"
                    type="number"
                    step="0.01"
                    value={form.daily_cost}
                    className="md:w-full"
                    onChange={(e) => setForm({ ...form, daily_cost: e.target.value })}
                    errorMessage={errors.daily_cost}
                />

                <ValidationInput
                    title="Description"
                    value={form.description}
                    className="md:w-full"
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                />

                <RadioBoolInput
                    title="Active Status"
                    value={form.is_active}
                    onChange={(val) => setForm({ ...form, is_active: val })}
                />
            </form>
            {successMessage && (
                <div className="w-full text-white p-2 rounded-md text-center mb-4" style={{ backgroundColor: "#EE7D11" }}>
                    {successMessage}
                </div>
            )}
        </BasePopup>
    );
};

export { EquipmentUpdatePopup };

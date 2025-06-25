"use client";

import React, { useState, useEffect } from "react";
import BasePopup from "../basic/BasePopup";
import { ValidationInput } from "../basic/ValidationInput";
import { isTokenExpired } from "@/utils/session";

const EquipmentCreatePopup = ({ isOpen, onClose, title, fetchEquipment }) => {
    const [form, setForm] = useState({
        equipment_name: "",
        equipment_type_id: "",
        available_quantity: "",
        daily_cost: "",
        is_active: true,
        model_number: "",
        sku: "",
        description: "",
    });


    const [errors, setErrors] = useState({});
    const [equipmentTypes, setEquipmentTypes] = useState([]);

    useEffect(() => {
        if (!isOpen) return;

        fetch("http://localhost:80/api/equipment-types", {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
            },
        })
            .then((res) => res.json())
            .then((data) => setEquipmentTypes(data))
            .catch((err) => console.error("Failed to load equipment types:", err));
    }, [isOpen]);

    const validateForm = () => {
        const newErrors = {};
        if (!form.equipment_name.trim()) newErrors.equipment_name = "Name is required";
        if (!form.equipment_type_id) newErrors.equipment_type_id = "Type is required";
        if (!form.available_quantity || isNaN(form.available_quantity)) newErrors.available_quantity = "Quantity must be a number";
        if (!form.daily_cost || isNaN(form.daily_cost)) newErrors.daily_cost = "Daily Cost must be a number";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const postEquipment = () => {
        if (!validateForm()) return;

        if (isTokenExpired()) {
            window.location.href = "/admin-login";
            return;
        }

        // Create the equipment
        fetch("http://localhost:80/api/equipment/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
            },
            body: JSON.stringify({
                ...form,
                is_active: form.is_active ? 1 : 0,
            }),
        })
            .then((res) => {
                if (!res.ok) throw new Error(`http error: ${res.status}`);
                return res.json();
            })
            .then((data) => {
                const created = data.message;

                // You can either trigger the update or creation of related attributes here, or let it be handled by the database.

                // After the equipment creation, refresh the equipment list and close the popup
                fetchEquipment();
                onClose();
            })
            .catch((err) => {
                console.error("Error creating equipment:", err);
            });
    };



    if (!isOpen) return null;

    return (
        <BasePopup
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            onActivityClicked={postEquipment}
            activityText="Save"
        >
            <form className="flex flex-wrap justify-between gap-y-4">
                <ValidationInput
                    title="Equipment Name"
                    value={form.equipment_name}
                    onChange={(e) => setForm({ ...form, equipment_name: e.target.value })}
                    errorMessage={errors.equipment_name}
                    className="md:w-full"
                />

                <div className="md:w-full">
                    <label className="text-sm font-semibold block mb-1">Equipment Type</label>
                    <select
                        value={form.equipment_type_id}
                        onChange={(e) => setForm({ ...form, equipment_type_id: e.target.value })}
                        className="w-full border px-2 py-1 rounded"
                    >
                        <option value="">-- Select Type --</option>
                        {equipmentTypes.map((type) => (
                            <option key={type.equipment_type_id} value={type.equipment_type_id}>
                                {type.equipment_type_name}
                            </option>
                        ))}
                    </select>
                    {errors.equipment_type_id && (
                        <p className="text-red-500 text-sm">{errors.equipment_type_id}</p>
                    )}
                </div>

                <ValidationInput
                    title="Available Quantity"
                    type="number"
                    value={form.available_quantity}
                    onChange={(e) => setForm({ ...form, available_quantity: e.target.value })}
                    errorMessage={errors.available_quantity}
                    className="md:w-full"
                />
                <ValidationInput
                    title="Daily Cost"
                    type="number"
                    step="0.01"
                    value={form.daily_cost}
                    onChange={(e) => setForm({ ...form, daily_cost: e.target.value })}
                    errorMessage={errors.daily_cost}
                    className="md:w-full"
                />
                <ValidationInput
                    title="Model Number"
                    value={form.model_number}
                    onChange={(e) => setForm({ ...form, model_number: e.target.value })}
                    className="md:w-full"
                />
                <ValidationInput
                    title="SKU"
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    className="md:w-full"
                />

                <ValidationInput
                    title="Description"
                    type="textarea"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="md:w-full"
                />
                <label className="flex items-center gap-2 text-sm mt-2">
                    <input
                        type="checkbox"
                        checked={form.is_active}
                        onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    />
                    Active
                </label>
            </form>
        </BasePopup>
    );
};

export { EquipmentCreatePopup };

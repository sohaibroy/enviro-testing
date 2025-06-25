"use client";

import React, { useState } from "react";
import BasePopup from "../basic/BasePopup";
import { RadioBoolInput } from "../basic/RadioBoolInput";
import { isTokenExpired } from "@/utils/session";

const RentalUpdatePopup = ({ rental, isOpen, onClose, title }) => {
    if (!isOpen) return null;

    const [currentRental, setRental] = useState({
        is_active: rental.is_active !== null ? rental.is_active : 1,
    });

    const updateRental = () => {
        if (isTokenExpired()) {
            window.location.href = "/admin-login";
            return;
        }

        fetch(`http://localhost:80/api/rental/update/${rental.rental_id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
            },
            body: JSON.stringify({
                is_active: currentRental.is_active,
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log("Rental updated:", data);
                onClose();
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    return (
        <BasePopup
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            activityText="Update"
            onActivityClicked={updateRental}
        >
            <form className="flex flex-wrap justify-between gap-y-4 min-w-[20rem]">
                <RadioBoolInput
                    title="Status"
                    value={currentRental.is_active}
                    onChange={(val) => setRental({ ...currentRental, is_active: val })}
                />
            </form>
        </BasePopup>
    );
};

export { RentalUpdatePopup };

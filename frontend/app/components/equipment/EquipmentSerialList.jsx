"use client";

import React, { useEffect, useState } from "react";
import BasePopup from "../basic/BasePopup";

const EquipmentSerialStatusPopup = ({ isOpen, onClose, serialList }) => {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && !serialList) {
            setIsLoading(true);
        } else {
            setIsLoading(false);
        }
    }, [isOpen, serialList]);

    if (!isOpen || !serialList) return null;


    return (
        <BasePopup
            isOpen={isOpen}
            onClose={onClose}
            title="Serial Numbers"
            activityText="Close"
            onActivityClicked={onClose}
            isLoading={isLoading}
        >
            <div className="grid grid-cols-2 gap-4">
                {serialList.length > 0 ? (
                    serialList.map((serial_item) => (
                        <div key={serial_item.serial_id} className="bg-white p-4 shadow-lg rounded-lg">
                            <p><strong>Serial ID:</strong> {serial_item.serial_id || "N/A"}</p>
                            <p><strong>Equipment:</strong> {serial_item.equipment_name || "Unknown"}</p>
                            <p><strong>Serial Number:</strong> {serial_item.serial_number || "N/A"}</p>
                            <p>
                                <strong>Status:</strong>{" "}
                                {serial_item.status === "rented" ? (
                                    <span className="text-[#EE7D11]">Rented</span>
                                ) : (
                                    <span className="text-[#003883]">Available</span>
                                )}
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center">No serial numbers found for this item.</p>
                )}
            </div>
        </BasePopup>
    );
};

export { EquipmentSerialStatusPopup };

"use client";

import React from "react";
import { BaseListItem } from "../basic/BaseListItem";

function RentalDetailsListItem({ rentalDetail }) {
    const formattedCost = new Intl.NumberFormat("en-CA", {
        style: "currency",
        currency: "CAD",
    }).format(rentalDetail.daily_rate);

    return (
        <BaseListItem>
            <div className="flex flex-wrap justify-between w-full">
                <section className="flex flex-col w-full md:w-1/2 lg:w-1/3 mb-4">
                    <p className="text-lg font-semibold mb-2">
                        <span className="text-gray-600 mr-2">Equipment:</span>
                        {rentalDetail.equipment_name}
                    </p>
                    <p className="text-lg font-semibold mb-2">
                        <span className="text-gray-600 mr-2">Model #:</span>
                        {rentalDetail.model_number}
                    </p>
                </section>
                <section className="flex flex-col w-full md:w-1/2 lg:w-1/3 mb-4">
                    <p className="text-lg font-semibold mb-2">
                        <span className="text-gray-600 mr-2">Quantity:</span>
                        {rentalDetail.quantity}
                    </p>
                    <p className="text-lg font-semibold mb-2">
                        <span className="text-gray-600 mr-2">Duration:</span>
                        {rentalDetail.duration_days} day(s)
                    </p>
                </section>
                <section className="flex flex-col w-full md:w-1/2 lg:w-1/3 mb-4">
                    <p className="text-lg font-semibold mb-2">
                        <span className="text-gray-600 mr-2">Daily Rate:</span>
                        {formattedCost}
                    </p>
                    <p className="text-lg font-semibold mb-2">
                        <span className="text-gray-600 mr-2">Notes:</span>
                        {rentalDetail.comments || "None"}
                    </p>
                </section>
            </div>
        </BaseListItem>
    );
}

export { RentalDetailsListItem };

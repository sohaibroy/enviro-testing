"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BaseListItem } from "../basic/BaseListItem";
import { RentalUpdatePopup } from "./RentalUpdatePopup";

function RentalsListItem({ rental, fetchRentals }) {
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);

    const handleUpdateOpen = () => setIsUpdateOpen(true);
    const handleUpdateClose = () => {
        fetchRentals();
        setIsUpdateOpen(false);
    };

    const formattedDate = new Date(rental.created_at).toLocaleDateString("en-CA");

    const formattedCost = new Intl.NumberFormat("en-CA", {
        style: "currency",
        currency: "CAD",
    }).format(rental.total_amount);

    return (
        <>
            <BaseListItem>
                <div className="flex flex-wrap max-w-[58rem] mr-[.5rem]">

                    <p
                        className={`text-xl font-bold mb-2 w-full ${rental.is_active ? "text-blue-500" : "text-orange-500"
                            }`}
                    >
                        {rental.is_active ? "Processed" : "Pending"}
                    </p>
                    <p className="text-xl font-semibold mb-2 w-1/2">
                        <span className="font-normal mr-[.25rem]">Order Id:</span>
                        {rental.order_id}
                    </p>
                    <p className="text-xl font-semibold mb-2 w-1/2 text-end">
                        <span className="font-normal mr-[.25rem]">Created On:</span>
                        {rental.created_at ? formattedDate : "-"}
                    </p>

                    <div className="w-full h-[.125rem] bg-gray-200 my-[1rem]" />

                    <div className="text-xl font-semibold mb-2 w-full flex justify-between">
                        <div className="flex flex-col gap-2">
                            <Link
                                className="hover:underline"
                                href={`/manage-accounts/${rental.company_id}`}
                            >
                                {`${rental.company_name}`}
                            </Link>
                            <a
                                className="font-normal hover:underline"
                                href={`tel:${rental.company_phone}`}
                            >
                                {rental.company_phone}
                            </a>
                            <a
                                className="font-normal hover:underline"
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                    rental.address
                                )}`}
                                target="_blank"
                            >
                                {rental.address}
                            </a>
                        </div>
                        <div className="flex flex-col gap-2 text-sm">
                            <p className="font-normal text-end">
                                {`${rental.customer.first_name} ${rental.customer.last_name}`}
                            </p>
                            <a
                                className="font-normal text-end hover:underline"
                                href={`tel:${rental.phone_number}`}
                            >
                                {rental.phone_number}
                            </a>
                            <a
                                className="font-normal text-end hover:underline"
                                href={`mailto:${rental.email}`}
                            >
                                {rental.email}
                            </a>
                        </div>
                    </div>

                    <div className="w-full h-[.125rem] bg-gray-200 my-[1rem]" />

                    <div className="flex w-full flex-wrap mt-[2rem]">
                        <p className="text-xl font-semibold mb-2 w-full md:w-1/2 md:text-start">
                            <span className="font-normal mr-[.25rem]">Total Cost:</span>
                            {formattedCost}
                        </p>
                        <p className="text-xl font-semibold mb-2 w-full md:w-1/2 md:text-end">
                            <span className="font-normal mr-[.25rem]">Equipment:</span>
                            {rental.equipment.map((item) => (
                                <span key={item.equipment_id} className="font-normal mr-[.25rem]">
                                    {item.equipment_name} ({item.sku})
                                    {item.equipment_id !== rental.equipment[rental.equipment.length - 1].equipment_id && ", "}
                                </span>
                            ))}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col gap-1 min-w-[8rem] justify-end text-white">
                    <Link
                        href={`/manage-rental-details/${rental.rental_id}`}
                        className="bg-[#003883] justify-center text-center p-2 shadow-2xl rounded-md font-bold transition-all hover:scale-[101%]"
                    >
                        Rental Details
                    </Link>
                    <button
                        className="bg-[#003883] justify-center text-center p-2 shadow-2xl font-bold rounded-md transition-all hover:scale-[101%]"
                        onClick={handleUpdateOpen}
                    >
                        Edit
                    </button>
                </div>
            </BaseListItem>

            <RentalUpdatePopup
                rental={rental}
                title={`Update Rental #${rental.rental_id}`}
                isOpen={isUpdateOpen}
                onClose={handleUpdateClose}
            />
        </>
    );
}

export { RentalsListItem };

"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { RentalDetailsListItem } from "../rentals/RentalDetailsListItem";
import { RentalUpdatePopup } from "../rentals/RentalUpdatePopup";
import BasePopup from "../basic/BasePopup";
import { isTokenExpired } from "@/utils/session";

export default function RentalDetailsPage() {
    const { rentalId } = useParams();
    const router = useRouter();
    const [rental, setRental] = useState(null);
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);

    useEffect(() => {
        if (!rentalId) return;
        fetchRental();
    }, [rentalId]);

    const fetchRental = async () => {
        try {
            const res = await fetch(`http://localhost:80/api/rental/${rentalId}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
                },
            });
            if (!res.ok) throw new Error("Failed to fetch rental");
            const data = await res.json();
            setRental(data);
        } catch (err) {
            console.error(err);
            alert("Could not load rental details.");
        }
    };

    const handleUpdateClose = () => {
        fetchRental();
        setIsUpdateOpen(false);
    };

    if (!rental) return <p className="p-4">Loading...</p>;

    const formattedTotal = new Intl.NumberFormat("en-CA", {
        style: "currency",
        currency: "CAD",
    }).format(rental.total_amount);

    return (
        <main className="p-6 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Rental #{rental.rental_id}</h1>

            <section className="mb-4">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-2xl font-semibold">Rental Overview</h2>
                    <button
                        className="bg-[#003883] text-white px-4 py-2 rounded shadow hover:scale-[101%] transition"
                        onClick={() => setIsUpdateOpen(true)}
                    >
                        Edit Status
                    </button>
                </div>

                <div className="bg-white shadow rounded p-4 mb-4">
                    <p className="text-lg mb-1"><strong>Customer:</strong> {rental.customer.first_name} {rental.customer.last_name}</p>
                    <p className="text-lg mb-1"><strong>Email:</strong> {rental.email}</p>
                    <p className="text-lg mb-1"><strong>Phone:</strong> {rental.phone_number}</p>
                    <p className="text-lg mb-1"><strong>Company:</strong> {rental.company_name}</p>
                    <p className="text-lg mb-1"><strong>Address:</strong> {rental.address}</p>
                    <p className="text-lg mb-1"><strong>Status:</strong> {rental.is_active ? "Processed" : "Pending"}</p>
                    <p className="text-lg"><strong>Total:</strong> {formattedTotal}</p>
                </div>
            </section>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">Rental Equipment</h2>
                {rental.details.map((detail) => (
                    <RentalDetailsListItem key={detail.equipment_id} rentalDetail={detail} />
                ))}
            </section>

            {/* Stripe or Payment Control Placeholder */}
            <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">Payment</h2>
                <p className="text-lg mb-4">Payment functionality will go here (Stripe charge, etc.).</p>
                <button className="bg-[#ee7d11] text-white px-4 py-2 rounded font-bold hover:scale-[101%] transition">
                    Charge Customer
                </button>
            </section>

            <RentalUpdatePopup
                rental={rental}
                title={`Update Rental #${rental.rental_id}`}
                isOpen={isUpdateOpen}
                onClose={handleUpdateClose}
            />
        </main>
    );
}

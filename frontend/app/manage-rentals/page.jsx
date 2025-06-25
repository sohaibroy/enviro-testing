"use client";

import React, { useState, useEffect } from "react";
import { AdminSearch } from "../components/adminsearch/AdminSearch";
import { CRUDHeader } from "../components/navigation/CRUDHeader";
import { RentalsListItem } from "../components/rentals/RentalsListItem";
import { LoadingIcon } from "../components/loading/LoadingIcon";
import { ErrorMessage } from "../components/basic/ErrorMessage";
import { GeneralMessage } from "../components/basic/GeneralMessage";
import { isTokenExpired } from "@/utils/session";

function ManageRentals() {
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchRentals = async () => {
        try {
            if (isTokenExpired()) {
                window.location.href = "/admin-login";
                return;
            }

            const response = await fetch("http://localhost/api/rentals", {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
                },
            });

            if (!response.ok) throw new Error("Failed to fetch rentals");

            const data = await response.json();
            setRentals(Array.isArray(data.message) ? data.message : data);
            setLoading(false);
        } catch (error) {
            setError(error.toString());
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchRentals();
    }, []);

    return (
        <div className="mb-[5rem] flex flex-col gap-4">
            <CRUDHeader title="Manage Rentals" href="./admin-selection" />
            <section className="w-full max-w-[70rem] mx-auto">
                <div className="flex gap-[.25rem]">
                    <AdminSearch
                        onSearch={fetchRentals}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                    />
                </div>

                {loading ? (
                    <LoadingIcon />
                ) : error ? (
                    <ErrorMessage error={error} />
                ) : Array.isArray(rentals) && rentals.length > 0 ? (
                    <ul>
                        {rentals.map((rental) => (
                            <RentalsListItem
                                key={rental.rental_id}
                                rental={rental}
                                fetchRentals={fetchRentals}
                            />
                        ))}
                    </ul>
                ) : (
                    <GeneralMessage message={`No Rentals Found`} />
                )}
            </section>
        </div>
    );
}

export default ManageRentals;

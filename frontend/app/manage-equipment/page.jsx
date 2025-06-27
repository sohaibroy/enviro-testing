"use client";

import React, { useState, useEffect } from "react";
import { AdminSearch } from "../components/adminsearch/AdminSearch";
import { CRUDHeader } from "../components/navigation/CRUDHeader";
import { EquipmentCRUDListItem } from "../components/equipment/EquipmentCRUDListItem";
import { EquipmentCreatePopup } from "../components/equipment/EquipmentCreatePopup";
import { LoadingIcon } from "../components/loading/LoadingIcon";
import { ErrorMessage } from "../components/basic/ErrorMessage";
import { GeneralMessage } from "../components/basic/GeneralMessage";
import { isTokenExpired } from "@/utils/session";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;


function ManageEquipment() {

    const [equipment, setEquipment] = useState([]);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchEquipment = async () => {
        try {
            if (isTokenExpired()) {
                window.location.href = "/admin-login";
                return;
            }

            //const response = await fetch("http://localhost:80/api/equipment-data", {
            const response = await fetch(`${baseUrl}/api/equipment-data`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
                },
            });

            if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

            const rawData = await response.json();

            const grouped = Object.values(
                rawData.reduce((acc, row) => {
                    const id = row.equipment_id;

                    if (!acc[id]) {
                        acc[id] = {
                            ...row,
                            attributes: [],
                        };
                    }

                    acc[id].attributes.push({
                        attribute_id: row.attribute_id,
                        attribute_name: row.attribute_name,
                        attribute_value: row.attribute_value,
                    });

                    return acc;
                }, {})
            );

            setEquipment(grouped);  // Ensure you are correctly updating the state with the new data
            setLoading(false);
        } catch (error) {
            const errorMessage = error.toString();
            setError(errorMessage);
            setLoading(false);
        }
    };

    const fetchSearchResults = async () => {
        setLoading(true);
        try {
            if (isTokenExpired()) {
                window.location.href = "/admin-login";
                return;
            }

            const response = await fetch(
                //`http://localhost/api/equipment/search?search=${encodeURIComponent(searchTerm)}`,
                `${baseUrl}/api/equipment/search?search=${encodeURIComponent(searchTerm)}`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
                    },
                }
            );


            const rawData = await response.json();

            if (rawData.message) {
                setError(rawData.message);
                setEquipment([]);
            } else {
                setError(null);

                const grouped = Object.values(
                    rawData.reduce((acc, row) => {
                        const id = row.equipment_id;

                        if (!acc[id]) {
                            acc[id] = {
                                ...row,
                                attributes: [],
                            };
                        }

                        acc[id].attributes.push({
                            attribute_id: row.attribute_id,
                            attribute_name: row.attribute_name,
                            attribute_value: row.attribute_value,
                        });

                        return acc;
                    }, {})
                );

                setEquipment(grouped);
            }


            setLoading(false);
        } catch (error) {
            const errorMessage = error.toString();
            setError(errorMessage);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (searchTerm.trim() !== "") {
            fetchSearchResults();
        } else {
            fetchEquipment();
        }
    }, [searchTerm]);


    const handleCreateOpen = () => setIsCreateOpen(true);
    const handleCreateClose = () => {
        fetchEquipment();
        setIsCreateOpen(false);
    };

    return (
        <div className="mb-[5rem] flex flex-col gap-4">
            <CRUDHeader title="Manage Equipment" href="./admin-selection" />
            <section className="w-full max-w-[70rem] mx-auto">
                <div className="flex gap-[.25rem]">
                    <button
                        className="bg-[#003883] p-2 shadow-2xl font-bold text-center rounded-md transition-all hover:scale-[101%] text-white"
                        onClick={handleCreateOpen}
                    >
                        Create New
                    </button>
                    <AdminSearch
                        onSearch={fetchSearchResults}  // Trigger search on input change
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                    />
                </div>

                {loading ? (
                    <LoadingIcon />
                ) : error ? (
                    <ErrorMessage error={error} />
                ) : equipment.length > 0 ? (
                    <ul>
                        {equipment.map((item) => (
                            <EquipmentCRUDListItem
                                key={item.equipment_id}
                                equipment={item}
                                fetchEquipment={fetchEquipment}
                            />
                        ))}
                    </ul>
                ) : (
                    <GeneralMessage message="No Equipment Found" />
                )}
            </section>

            <EquipmentCreatePopup
                title="Create Equipment"
                isOpen={isCreateOpen}
                onClose={handleCreateClose}
                fetchEquipment={fetchEquipment}
            />
        </div>
    );
}


export default ManageEquipment;

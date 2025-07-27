import React, { useState, useEffect } from "react";
import { GeneralMessage } from "../basic/GeneralMessage";
import EquipmentRentalCard from "./EquipmentCard";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;


function EquipmentRentalList({ searchTerm, searchType, selectedCategory, onSelectedEquipment }) {
    const [equipmentList, setEquipmentList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [user, setUser] = useState({
        isLoggedIn: false,
        companyId: null,
        isMember: false,
    });

    useEffect(() => {
        const accessToken = sessionStorage.getItem("accessToken");
        if (!accessToken) return;

        const fetchUser = async () => {
            try {
                //const res = await fetch("http://localhost/api/account/me", {
                const res = await fetch(`${baseUrl}/api/account/me`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });

                if (!res.ok) throw new Error("User fetch failed");

                const userData = await res.json();

                setUser({
                    isLoggedIn: true,
                    companyId: userData.company_id,
                    isMember: true, // or infer from userData if you track member status
                });
            } catch (err) {
                console.error("Error fetching user:", err);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        const fetchEquipment = async () => {
            setLoading(true);
            const accessToken = sessionStorage.getItem("accessToken");

            const headers = accessToken
                ? { Authorization: `Bearer ${accessToken}` }
                : {};

            try {
                //const res = await fetch("http://localhost/api/equipment-data", {
                const res = await fetch(`${baseUrl}/api/equipment-data`, {
                    headers,
                    credentials: "include",   //ADDED
                });

                if (!res.ok) throw new Error("Failed to load equipment.");

                const rawData = await res.json();
                const formatted = formatEquipmentData(rawData, {
                    isLoggedIn: !!accessToken,
                    companyId: sessionStorage.getItem("companyId"),
                    isMember: sessionStorage.getItem("accountType") === "true",
                });

                setEquipmentList(formatted);
                setFilteredList(formatted);
                setError(null);
            } catch (err) {
                console.error("Equipment load error:", err);
                setError("Error loading equipment.");
            } finally {
                setLoading(false);
            }
        };

        fetchEquipment();
    }, []);


    useEffect(() => {
        let filtered = [...equipmentList];

        if (selectedCategory) {
            filtered = filtered.filter(
                (item) => item.equipment_type_id === selectedCategory
            );
        }

        if (searchTerm) {
            const term = searchTerm.toLowerCase();

            filtered = filtered.filter((item) => {
                const name = item.equipment_name?.toLowerCase() || "";
                const description = item.description?.toLowerCase() || "";

                switch (searchType) {
                    case "Equals":
                        return name === term || description === term;
                    case "Starts With":
                        return name.startsWith(term) || description.startsWith(term);
                    case "Ends With":
                        return name.endsWith(term) || description.endsWith(term);
                    default:
                        return name.includes(term) || description.includes(term);
                }
            });
        }

        setFilteredList(filtered);
    }, [equipmentList, searchTerm, searchType, selectedCategory]);

    const handleSelect =(item) => {
        const alreadySelected =selectedItems.find(
            (e) = e.equipment_id === item.equipment_id
        );
        if (alreadySelected) return;
        
        const updated = [...selectedItems, item];
        setSelectedItems(updated);
        if (onSelectEquipment) {
            onSelectEquipment(updated);
        }
    }

    if (loading) return <p className="text-gray-500">Loading equipment list...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!filteredList.length) return <GeneralMessage message="No rental equipment available" />;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 w-full">
            {filteredList.map((equipment) => (
                <EquipmentRentalCard
                    key={equipment.equipment_id}
                    equipment={equipment}
                    onSelect={() => handleSelect(equipment)}
                />
            ))}
        </div>
    );
}

function formatEquipmentData(rawList, user) {
    const grouped = {};

    rawList.forEach(item => {
        const id = item.equipment_id;

        if (!grouped[id]) {
            const custom_price =
                (user?.companyId && item[`company_${user.companyId}_price`]) ||
                (user?.isMember && item["member_price"]) ||
                null;


            grouped[id] = {
                equipment_id: id,
                equipment_name: item.equipment_name,
                image_url: item.image_url || null,
                equipment_type_id: item.equipment_type_id ?? item.type_id ?? null,
                equipment_type_name: item.equipment_type_name ?? null,
                description: item.description || "",
                model_number: item.model_number || "",
                serial_number: item.serial_number || "",
                specsheet: item.specsheet || null,
                available_quantity: item.available_quantity ? parseInt(item.available_quantity) : 0,
                daily_cost: item.daily_cost ? parseFloat(item.daily_cost) : null,
                custom_price: custom_price !== null ? parseFloat(custom_price) : null,
                attributes: [],
            };
        }

        if (item.attribute_id && item.attribute_name) {
            grouped[id].attributes.push({
                attribute_id: item.attribute_id,
                attribute_name: item.attribute_name,
                value: item.attribute_value ?? "N/A",
            });
        }
    });

    return Object.values(grouped);
}
export default EquipmentRentalList;

import React, { useState } from "react";

function EquipmentCategories({ onSelectCategory, equipmentTypes }) {
    const [activeCategory, setActiveCategory] = useState("all"); // Initialize as "all"

    const handleSelect = (categoryId) => {
        const idStr = String(categoryId);
        setActiveCategory(idStr);
        onSelectCategory(idStr === "all" ? null : Number(categoryId));
    };

    if (!equipmentTypes?.length) {
        return <p className="text-gray-500">No categories found.</p>;
    }

    return (
        <div className="w-full">
            <ul className="text-sm font-medium text-gray-700 w-full">
                <li
                    key="all"
                    className={`cursor-pointer py-3 px-4 border-b transition-all text-left w-full block ${activeCategory === "all"
                        ? "text-[#EE7D11] font-semibold"
                        : "hover:text-[#003883]"
                        }`}
                    onClick={() => handleSelect("all")}
                >
                    All Categories
                </li>
                {equipmentTypes.map((category) => (
                    <li
                        key={category.equipment_type_id}
                        className={`cursor-pointer py-3 px-4 border-b transition-all text-left w-full block ${activeCategory === String(category.equipment_type_id)
                            ? "text-[#EE7D11] font-semibold"
                            : "hover:text-[#003883]"
                            }`}
                        onClick={() => handleSelect(category.equipment_type_id)}
                    >
                        {category.equipment_type_name}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default EquipmentCategories;

"use client";

import React, { useEffect, useState } from "react";
import { LoadingIcon } from "../loading/LoadingIcon";
import { ErrorMessage } from "../basic/ErrorMessage";
import { FaTrashCan } from "react-icons/fa6";
import FadeIn from "../basic/FadeIn";
import BasePopup from "../basic/BasePopup";

const RentalCart = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [cartItems, setCartItems] = useState([]);
    const [gst, setGst] = useState(0);
    const [subtotal, setSubtotal] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isConfirmClearOpen, setIsConfirmClearOpen] = useState(false);
    // function to calculate total price based on rental duration
    const calculateTotalPrice = (item) => {
        const startDate = new Date(item.StartDate);
        const endDate = new Date(item.ReturnDate);


        let rentalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));


        rentalDays = rentalDays > 0 ? rentalDays : 1;

        return rentalDays * item.DailyCost * item.Quantity;
    };

    useEffect(() => {
        setLoading(true);
        const storedCart = JSON.parse(sessionStorage.getItem("rentalCart")) || [];
        setCartItems(storedCart);
        setLoading(false);
    }, []);

    useEffect(() => {
        setIsAuthenticated(
            sessionStorage.getItem("accountType") === "true" &&
            sessionStorage.getItem("accessToken") !== null
        );
    }, []);

    useEffect(() => {
        const newSubtotal = cartItems.reduce((acc, item) => acc + calculateTotalPrice(item), 0);
        setSubtotal(newSubtotal);
        setGst(newSubtotal * 0.05);
        setTotalAmount(newSubtotal + newSubtotal * 0.05);
    }, [cartItems]);

    const handleQuantityChange = (index, change) => {
        const updatedCart = cartItems.map((item, i) =>
            i === index
                ? { ...item, Quantity: Math.max(1, item.Quantity + change) }
                : item
        );
        setCartItems(updatedCart);
        sessionStorage.setItem("rentalCart", JSON.stringify(updatedCart));
    };

    const handleDeleteItem = (index) => {
        const updatedCart = cartItems.filter((_, i) => i !== index);
        setCartItems(updatedCart);
        sessionStorage.setItem("rentalCart", JSON.stringify(updatedCart));
    };

    const handleClearCart = () => {
        setCartItems([]);
        sessionStorage.removeItem("rentalCart");
    };

    return (
        <div className="flex flex-col gap-6 my-[3rem] max-w-[70rem] mx-auto">
            {loading ? (
                <LoadingIcon />
            ) : error ? (
                <ErrorMessage error={error} />
            ) : submitted ? (
                <p className="text-center font-bold text-green-600">
                    Your rental request has been submitted!
                </p>
            ) : (
                <FadeIn>
                    <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
                        {cartItems.length === 0 ? (
                            <p className="text-center font-bold text-gray-500 mt-[4rem] mb-[8rem]">
                                No equipment in cart...
                            </p>
                        ) : (
                            <div className="w-full overflow-x-auto rounded-md border border-gray-200 shadow-md">
                                <table className="min-w-full table-auto divide-y divide-gray-200 text-sm shadow-md rounded-md overflow-hidden">

                                    <thead className="bg-[#003883] text-white text-sm tracking-wide">
                                        <tr>
                                            <th className="px-4 py-3 text-center">Product Image</th>
                                            <th className="px-4 py-3 text-left">Equipment</th>
                                            <th className="px-4 py-3 text-left">Category</th>
                                            <th className="px-4 py-3 text-left whitespace-nowrap">Daily Price</th>
                                            <th className="px-4 py-3 text-center">Qty</th>
                                            <th className="px-4 py-3 text-center">Total</th>
                                            <th className="px-4 py-3 text-center whitespace-nowrap">Start Date</th>
                                            <th className="px-4 py-3 text-center whitespace-nowrap">Return Date</th>
                                            <th className="px-4 py-3 text-center">Remove</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {cartItems.map((item, index) => (
                                            <tr key={index} className="hover:bg-gray-100 transition-all">
                                                <td className="px-4 py-3">
                                                    <img
                                                        src={item.ImageUrl}
                                                        alt={item.EquipmentName}
                                                        className="w-16 h-16 object-cover rounded-md shadow-md"
                                                    />
                                                </td>
                                                <td className="px-4 py-3 font-medium text-gray-900">
                                                    {item.EquipmentName}
                                                </td>
                                                <td className="px-6 py-3 text-gray-700">{item.Category}</td>
                                                <td className="px-4 py-3 font-bold">${item.DailyCost.toFixed(2)}</td>
                                                <td className="px-4 py-3 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            className="border border-gray-300 px-2 py-1 rounded-md bg-gray-100 hover:enviro_orange hover:text-white transition-all hover:scale-105"
                                                            onClick={() => handleQuantityChange(index, -1)}
                                                        >
                                                            -
                                                        </button>
                                                        {item.Quantity}
                                                        <button
                                                            className="border border-gray-300 px-2 py-1 rounded-md bg-gray-100 hover:enviro_orange hover:text-white transition-all hover:scale-105"
                                                            onClick={() => handleQuantityChange(index, 1)}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 font-bold">
                                                    ${(calculateTotalPrice(item)).toFixed(2)}
                                                </td>
                                                <td className="px-4 py-3 text-gray-700">{item.StartDate}</td>
                                                <td className="px-4 py-3 text-gray-700">{item.ReturnDate}</td>
                                                <td className="px-4 py-3 text-center">
                                                    <button
                                                        className="text-[#EE7D11] border border-[#EE7D11] px-4 py-2 rounded-md hover:[#EE7D11] hover:text-[#003883] transition-all hover:scale-105"
                                                        onClick={() => handleDeleteItem(index)}
                                                    >
                                                        <FaTrashCan />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {cartItems.length > 0 && (
                            <section className="drop-shadow-lg border p-[1.25rem] flex justify-between text-gray-700 font-semibold items-end bg-gray-100 rounded-xl mt-4">
                                <div
                                    className="flex flex-col items-center gap-1 px-3 py-2 border border-[#EE7D11] rounded-md text-[#EE7D11] cursor-pointer hover:bg-[#EE7D11] hover:text-white transition-all hover:scale-105"
                                    onClick={() => setIsConfirmClearOpen(true)}
                                >
                                    <p className="text-xs">Clear Cart</p>
                                    <FaTrashCan size={24} />
                                </div>
                                <div className="min-w-[16rem] flex flex-col gap-[.5rem] drop-shadow-xl">
                                    <p className="flex justify-between">
                                        Subtotal <span className="font-extrabold">${subtotal.toFixed(2)}</span>
                                    </p>
                                    <p className="flex justify-between">
                                        GST (5%) <span className="font-extrabold">${gst.toFixed(2)}</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <strong>Total</strong> <span className="text-xl font-extrabold">${totalAmount.toFixed(2)}</span>
                                    </p>
                                </div>
                            </section>
                        )}
                        <BasePopup
                            isOpen={isConfirmClearOpen}
                            onClose={() => setIsConfirmClearOpen(false)}
                            onActivityClicked={() => {
                                handleClearCart();
                                setIsConfirmClearOpen(false);
                            }}
                            activityText="Yes, Clear"
                            title="Clear Cart?"
                        >
                            <p className="text-gray-700 text-lg font-semibold">
                                Are you sure you want to clear your cart? This action cannot be undone.
                            </p>
                        </BasePopup>

                    </div>
                </FadeIn>
            )}
        </div>
    );
};


export default RentalCart;

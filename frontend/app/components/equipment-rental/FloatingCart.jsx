"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function FloatingCart() {
    const [cartItems, setCartItems] = useState([]);
    const [subtotal, setSubtotal] = useState(0);
    const [gst, setGst] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);

    const calculateTotalPrice = (item) => {
        const startDate = new Date(item.StartDate);
        const endDate = new Date(item.ReturnDate);

        const rentalDays = Math.max(
            1,
            Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
        );

        return rentalDays * item.DailyCost * item.Quantity;
    };

    useEffect(() => {
        const fetchCartData = () => {
            try {
                const storedCart = JSON.parse(sessionStorage.getItem("rentalCart")) || [];
                console.log("fetched cart items:", storedCart);

                if (Array.isArray(storedCart) && storedCart.length > 0) {
                    setCartItems(storedCart);

                    const subTotalCalc = storedCart.reduce((acc, item) => acc + calculateTotalPrice(item), 0);
                    setSubtotal(subTotalCalc);
                    setGst(subTotalCalc * 0.05);
                    setTotalAmount(subTotalCalc + subTotalCalc * 0.05);
                } else {
                    setCartItems([]);
                    setSubtotal(0);
                    setGst(0);
                    setTotalAmount(0);
                }
            } catch (error) {
                console.error("error loading cart data:", error);
                setCartItems([]);
            }
        };

        fetchCartData();

        // listeners for cart updates
        window.addEventListener("storage", fetchCartData);
        window.addEventListener("cartUpdated", fetchCartData);

        return () => {
            window.removeEventListener("storage", fetchCartData);
            window.removeEventListener("cartUpdated", fetchCartData);
        };
    }, []);

    return (
        <div className="fixed top-80 right-20 w-[18rem] bg-white shadow-lg rounded-xl p-4 border border-gray-300">
            <h3 className="text-lg font-bold text-gray-900">Your Cart</h3>
            <div className="mt-2 space-y-2">
                {cartItems.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center">No items in cart.</p>
                ) : (
                    cartItems.map((item, index) => (
                        <div key={index} className="flex justify-between items-center border-b py-2">
                            <div className="text-sm font-medium text-gray-800">{item.EquipmentName}</div>
                            <div className="text-sm text-gray-600">
                                ${calculateTotalPrice(item).toFixed(2)}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {cartItems.length > 0 && (
                <div className="mt-4 text-sm text-gray-800">
                    <p className="flex justify-between">
                        Subtotal: <span className="font-bold">${subtotal.toFixed(2)}</span>
                    </p>
                    <p className="flex justify-between">
                        Gst (5%): <span className="font-bold">${gst.toFixed(2)}</span>
                    </p>
                    <p className="flex justify-between text-lg font-bold">
                        Total: <span>${totalAmount.toFixed(2)}</span>
                    </p>
                    <Link href="/rental-cart">
                        <button className="w-full bg-[#003883] hover:bg-[#002f6c] text-white py-2 rounded-md mt-3 transition-all hover:scale-105">
                            Proceed to Checkout
                        </button>
                    </Link>
                </div>
            )}
        </div>
    );
}

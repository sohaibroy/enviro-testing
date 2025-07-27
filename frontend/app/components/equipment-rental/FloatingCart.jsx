"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import DeleteIcon from '@mui/icons-material/Delete';


export default function FloatingCart({ onProceedToCheckout }) {
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
     const handleRemoveItem = (indexToRemove) => {
        const updatedCart = cartItems.filter((_, i) => i !== indexToRemove);
        sessionStorage.setItem("rentalCart", JSON.stringify(updatedCart));
        setCartItems(updatedCart);
        window.dispatchEvent(new Event("cartUpdated"));
    };

    const handleClearCart = () => {
        sessionStorage.removeItem("rentalCart");
        setCartItems([]);
        setSubtotal(0);
        setGst(0);
        setTotalAmount(0);
        window.dispatchEvent(new Event("cartUpdated"));
    };

    return (
        <div className="fixed top-20 right-4 md:top-40 md:right-6 w-[90vw] md:w-[15rem] bg-white shadow-md rounded-lg p-3 border border-gray-200 z-50">
            <h3 className="text-lg font-bold text-gray-900">Your Cart</h3>
            <div className="mt-2 space-y-2">
                {cartItems.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center">No items in cart.</p>
                ) : (
                    cartItems.map((item, index) => (
                            <div className="flex justify-between items-start">
                            <div className="flex flex-col">
                                <span className="font-semibold text-gray-900">{item.EquipmentName}</span>
                                <button
                                onClick={() => handleRemoveItem(index)}
                                className="flex items-center text-xs text-red-600 hover:underline mt-1"
                                >                             
                                Remove
                                </button>
                            </div>
                            <span className="text-sm font-medium text-gray-800">
                                ${calculateTotalPrice(item).toFixed(2)}
                            </span>
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
                        <button
                         onClick = {onProceedToCheckout}
                         className="w-full bg-[#003883] hover:bg-[#002f6c] text-white py-2 rounded-md mt-3 transition-all hover:scale-105">
                            Proceed to Checkout
                        </button>
                      <button
                        onClick={handleClearCart}
                        className="w-full text-red-600 mt-2 text-sm underline"
                    >
                        Clear Cart
                    </button>
                </div>
            )}
        </div>
    );
}

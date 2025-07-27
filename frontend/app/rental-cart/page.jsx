// RentalCartPage.jsx
"use client";
//This is where the me call is
import React, { useEffect, useState } from "react";
import RentalCart from "../components/equipment-rental/RentalCart";
import NotificationPopup from "../components/popup/NotificationPopup";
import { isTokenExpired } from "@/utils/session";
import GuestRentalForm from "../components/rental-forms/GuestForm";
import AuthenticatedRentalForm from "../components/rental-forms/UserForm";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;


export default function RentalCartPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [formData, setFormData] = useState({
        firstName: "",
        company_id: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        streetAddress: "",
        city: "",
        province: "",
        postalCode: "",
        country: "",
        shippingMethod: "",
        cardholderName: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
    });

    const [errors, setErrors] = useState({});
    const [cartItems, setCartItems] = useState([]);
    const [subtotal, setSubtotal] = useState(0);
    const [gst, setGst] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);

    useEffect(() => {
        const accessToken = sessionStorage.getItem("accessToken");
        setIsAuthenticated(!!accessToken);

        if (accessToken) {
            //fetch("http://localhost/api/account/me", {
            fetch(`${baseUrl}/api/account/me`, {
                headers: { Authorization: `Bearer ${accessToken}` },
                //headers,
                credentials: "include",
            })
                .then((res) => {
                    if (!res.ok) throw new Error("Failed to fetch user info");
                    return res.json();
                })
                .then((data) => {
                    console.log("Fetched user data:", data);

                    sessionStorage.setItem("firstName", data.first_name);
                    sessionStorage.setItem("lastName", data.last_name);
                    sessionStorage.setItem("email", data.email);
                    sessionStorage.setItem("phoneNumber", data.phone_number ?? "");
                    sessionStorage.setItem("streetAddress", data.street_address ?? "");
                    sessionStorage.setItem("accountType", "true");
                    sessionStorage.setItem("companyId", data.company_id);

                    setUserInfo({
                        firstName: data.first_name,
                        lastName: data.last_name,
                        email: data.email,
                    });

                    setFormData((prev) => ({
                        ...prev,
                        firstName: data.first_name || "",
                        lastName: data.last_name || "",
                        email: data.email || "",
                        phoneNumber: data.phone_number || "",
                        streetAddress: data.street_address || "",
                        city: data.city || "",
                        province: data.province || "",
                        postalCode: data.postal_code || "",
                        country: data.country || "",
                        company_id: data.company_id || "",
                        cardholderName: `${data.first_name} ${data.last_name}`,
                        expiryDate: "",
                        cardNumber: "",
                        cvv: "",
                    }));
                })
                .catch((err) => console.error("Error fetching account info:", err));
        }

            // useEffect(() => {
            // const storedCart = JSON.parse(sessionStorage.getItem('rentalCart')) || [];
            // setCartItems(storedCart);
            // }, [onCartUpdate]);

            useEffect(() => {
  refreshCartItems();
}, []);

        const subTotalCalc = storedCart.reduce((acc, item) => {
            const startDate = new Date(item.StartDate);
            const endDate = new Date(item.ReturnDate);
            let rentalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
            rentalDays = rentalDays > 0 ? rentalDays : 1;
            return acc + rentalDays * item.DailyCost * item.Quantity;
        }, 0);

        setSubtotal(subTotalCalc);
        setGst(subTotalCalc * 0.05);
        setTotalAmount(subTotalCalc * 1.05);
    }, []);

    const validateInput = () => {
        const newErrors = {};
        if (!formData.firstName.trim()) newErrors.firstName = "First Name is required";
        if (!formData.lastName.trim()) newErrors.lastName = "Last Name is required";
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Enter a valid email address";
        }
        const phoneRegex = /^\+?[0-9]{7,15}$/;
        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = "Phone Number is required";
        } else if (!phoneRegex.test(formData.phoneNumber)) {
            newErrors.phoneNumber = "Enter a valid phone number";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePlaceOrder = async () => {
        if (!isAuthenticated && !validateInput()) return;
        if (!termsAccepted) {
            alert("Please accept the Terms & Conditions before placing your order.");
            return;
        }

        const orderData = {
            account: {
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                phone_number: formData.phoneNumber,
                street_address: formData.streetAddress,
                city: formData.city,
                province: formData.province,
                postal_code: formData.postalCode,
                country: formData.country,
                credit_card: formData.cardNumber || null,
                cardholder_name: formData.cardholderName,
                expiry_month: formData.expiryDate.split("/")[0] || "",
                expiry_year: formData.expiryDate.split("/")[1] || "",
                company_id: formData.company_id,
            },
            transaction: {
                subtotal: +subtotal.toFixed(2),
                gst: +gst.toFixed(2),
                total_amount: +totalAmount.toFixed(2),
            },
            rental: {
                rental_date: new Date().toISOString().slice(0, 19).replace("T", " "),
            },
            rental_details: cartItems.map((item) => ({
                equipment_id: item.EquipmentID,
                quantity: item.Quantity,
                price: item.DailyCost,
                start_date: item.StartDate,
                end_date: item.ReturnDate,
                condition: "good",
            })),
        };

        console.log("Submitting order:", orderData);

        try {
            const accessToken = sessionStorage.getItem("accessToken");
            if (accessToken && isTokenExpired()) {
                window.location.href = "/customer-login";
                return;
            }

            const headers = {
                "Content-Type": "application/json",
                ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
            };

            //const endpoint = accessToken ? "http://localhost:80/api/transactions/create" : "http://localhost:80/api/transactions/guest";
            const endpoint = accessToken   ? `${baseUrl}/api/transactions/create`          : `${baseUrl}/api/transactions/guest`;

            const response = await fetch(endpoint, {
                method: "POST",
                headers,
                body: JSON.stringify(orderData),
            });

            const cloned = response.clone();
            const rawText = await cloned.text();

            let data;
            try {
                data = await response.json();
            } catch {
                console.error("Response not JSON:", rawText);
                alert("Server error occurred. Check console for details.");
                return;
            }

            if (!response.ok) {
                console.error("order placement error:", data);
                alert(`Error: ${data.message || JSON.stringify(data.errors)}`);
            } else {
                setOrderSuccess(true);
                sessionStorage.removeItem("rentalCart");
                setCartItems([]);
                setTimeout(() => {
                    setOrderSuccess(false);
                    window.location.href = "/";
                }, 6000);
            }
        } catch (e) {
            console.error("unexpected error placing rental:", e);
            alert("An error occurred while placing the order.");
        }
    };

    const requiredGuestFields = [
        "firstName", "lastName", "email", "phoneNumber",
        "streetAddress", "city", "province", "postalCode", "country"
    ];

    const isGuestFormIncomplete = requiredGuestFields.some(
        (field) => !formData[field]?.trim()
    );

    const isPlaceOrderDisabled = !termsAccepted || (!isAuthenticated && isGuestFormIncomplete);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }; 

    const refreshCartItems = () => {
    const storedCart = JSON.parse(sessionStorage.getItem("rentalCart")) || [];
    setCartItems(storedCart);
    

    const subTotalCalc = storedCart.reduce((acc, item) => {
        const startDate = new Date(item.StartDate);
        const endDate = new Date(item.ReturnDate);
        let rentalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        rentalDays = rentalDays > 0 ? rentalDays : 1;
        return acc + rentalDays * item.DailyCost * item.Quantity;
    }, 0);

    setSubtotal(subTotalCalc);
    setGst(subTotalCalc * 0.05);
    setTotalAmount(subTotalCalc * 1.05);
};

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">Rental Cart</h1>
            <RentalCart onCartUpdate={refreshCartItems} />

            {cartItems.length > 0 && (
                <div className="mt-5 border border-gray-200 shadow-lg rounded-xl p-[2rem] max-w-[70rem] mx-auto flex flex-col gap-[.5rem]">
                    <h2 className="w-full text-2xl font-extrabold text-[#003883] mt-6 text-center">
                        {isAuthenticated ? "Confirm Your Info" : "Guest Checkout"}
                    </h2>

                    {!isAuthenticated && (
                        <h4 className="text-m font-semibold text-gray-600 text-center mt-4">
                            Please LOGIN to get customer pricing if you already have an account with us!
                        </h4>
                    )}

                    <h4 className="text-m font-semibold text-gray-600 text-center">
                        Please confirm your personal and payment information below.
                    </h4>

                    {isAuthenticated ? (
                        <AuthenticatedRentalForm
                            formData={formData}
                            errors={errors}
                            onInputChange={handleInputChange}
                        />
                    ) : (
                        <GuestRentalForm
                            formData={formData}
                            setFormData={setFormData}
                            errors={errors}
                            handleInputChange={handleInputChange}
                        />
                    )}
                </div>
            )}

            <div className="mt-6 p-6 border border-gray-300 rounded-xl bg-gray-50 shadow-sm max-w-[70rem] mx-auto">
                <h4 className="text-lg font-semibold text-gray-700 mb-2">Terms & Conditions</h4>
                <ul className="list-disc pl-6 text-m text-gray-600">
                    <li>All invoices are to be paid 30 days from the date of the invoice.</li>
                    <li>If unpaid after 30 days, we may charge the provided credit card.</li>
                    <li>We may validate data before confirming your rental.</li>
                </ul>
                <div className="mt-4">
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                            className="w-5 h-5"
                        />
                        <span className="text-m text-gray-700">
                            I have read and agree to the above Terms & Conditions.
                        </span>
                    </label>
                </div>
                <button
                    onClick={handlePlaceOrder}
                    disabled={isPlaceOrderDisabled}
                    className={`mt-8 px-6 py-3 rounded-xl font-semibold text-white shadow-lg transition-all duration-200
    ${isPlaceOrderDisabled
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-[#003883] hover:bg-[#0050b3] hover:scale-105"}`}
                >
                    Place Order
                </button>
            </div>



            <NotificationPopup
                isOpen={orderSuccess}
                onClose={() => setOrderSuccess(false)}
                onActivityClicked={() => setOrderSuccess(false)}
                activityText="OK"
                title="Order Placed Successfully"
                className="max-w-md p-4"
            >
                <p className="text-gray-700 text-m text-center">
                    Your rental order has been placed successfully!<br />
                    You will receive an order confirmation once your order has been processed.
                </p>
            </NotificationPopup>
        </div>
    );
}





















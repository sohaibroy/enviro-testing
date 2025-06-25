"use client";

import React from "react";
import { ValidationInput } from "../basic/ValidationInput";

export default function UserForm({ formData, errors, onInputChange }) {
    return (
        <>
            {/* Personal Info */}
            <h4 className="text-lg font-semibold text-gray-700 mt-6">Personal Information</h4>
            <ValidationInput
                name="firstName"
                type="text"
                title="First Name"
                value={formData.firstName}
                onChange={onInputChange}
                errorMessage={errors.firstName}
            />
            <ValidationInput
                name="lastName"
                type="text"
                title="Last Name"
                value={formData.lastName}
                onChange={onInputChange}
                errorMessage={errors.lastName}
            />
            <ValidationInput
                name="email"
                type="email"
                title="Email"
                value={formData.email}
                onChange={onInputChange}
                errorMessage={errors.email}
            />
            <ValidationInput
                name="phoneNumber"
                type="tel"
                title="Phone Number"
                value={formData.phoneNumber}
                onChange={onInputChange}
                errorMessage={errors.phoneNumber}
            />

            {/* Address Info */}
            <h4 className="text-lg font-semibold text-gray-700 mt-6">Address</h4>
            <ValidationInput
                name="streetAddress"
                type="text"
                title="Street Address"
                value={formData.streetAddress}
                onChange={onInputChange}
            />
            <ValidationInput
                name="city"
                type="text"
                title="City"
                value={formData.city}
                onChange={onInputChange}
            />
            <ValidationInput
                name="province"
                type="text"
                title="Province"
                value={formData.province}
                onChange={onInputChange}
            />
            <ValidationInput
                name="postalCode"
                type="text"
                title="Postal Code"
                value={formData.postalCode}
                onChange={onInputChange}
            />
            <ValidationInput
                name="country"
                type="text"
                title="Country"
                value={formData.country}
                onChange={onInputChange}
            />

            {/* Shipping Method */}
            <h4 className="text-lg font-semibold text-gray-700 mt-6">Shipping Method</h4>
            {["Purolator", "Canada Post", "UPS", "FedEx"].map((method) => (
                <label key={method} className="flex items-center gap-2">
                    <input
                        type="radio"
                        name="shippingMethod"
                        value={method}
                        checked={formData.shippingMethod === method}
                        onChange={onInputChange}
                    />
                    {method}
                </label>
            ))}

            {/* Payment Info */}
            <h4 className="text-lg font-semibold text-gray-700 mt-6">Payment Information</h4>
            <ValidationInput
                name="cardholderName"
                type="text"
                title="Cardholder Name"
                value={formData.cardholderName}
                onChange={onInputChange}
            />
            <ValidationInput
                name="cardNumber"
                type="text"
                title="Card Number"
                value={formData.cardNumber}
                onChange={onInputChange}
            />
            <ValidationInput
                name="expiryDate"
                type="text"
                title="Expiry Date (MM/YYYY)"
                value={formData.expiryDate}
                onChange={onInputChange}
            />
            <ValidationInput
                name="cvv"
                type="text"
                title="CVV"
                value={formData.cvv}
                onChange={onInputChange}
            />
        </>
    );
}

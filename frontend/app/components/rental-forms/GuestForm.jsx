"use client";

import React from "react";
import { ValidationInput } from "../basic/ValidationInput";

export default function GuestRentalForm({ formData, errors, handleInputChange }) {
    return (
        <form className="w-full flex flex-wrap justify-between gap-y-[1rem] py-[2.5rem]">

            {/* Personal Information */}
            <h4 className="w-full text-lg font-semibold text-gray-700 mt-6">Personal Information</h4>
            <ValidationInput
                id="firstName"
                name="firstName"
                type="text"
                title="First Name *"
                autoComplete="given-name"
                required
                onChange={handleInputChange}
                value={formData.firstName}
                errorMessage={errors.firstName}
            />
            <ValidationInput
                id="lastName"
                name="lastName"
                type="text"
                title="Last Name *"
                autoComplete="family-name"
                required
                onChange={handleInputChange}
                value={formData.lastName}
                errorMessage={errors.lastName}
            />
            <ValidationInput
                id="email"
                name="email"
                type="email"
                title="Email *"
                autoComplete="email"
                required
                onChange={handleInputChange}
                value={formData.email}
                errorMessage={errors.email}
            />
            <ValidationInput
                id="phoneNumber"
                name="phoneNumber"
                title="Phone Number *"
                type="tel"
                autoComplete="tel"
                required
                onChange={handleInputChange}
                value={formData.phoneNumber}
                errorMessage={errors.phoneNumber}
            />
            <ValidationInput
                id="streetAddress"
                name="streetAddress"
                type="text"
                title="Street Address *"
                autoComplete="street-address"
                required
                onChange={handleInputChange}
                value={formData.streetAddress}
                errorMessage={errors.streetAddress}
            />
            <ValidationInput
                id="city"
                name="city"
                type="text"
                title="City *"
                required
                onChange={handleInputChange}
                value={formData.city}
                errorMessage={errors.city}
            />
            <ValidationInput
                id="province"
                name="province"
                type="text"
                title="Province/State *"
                required
                onChange={handleInputChange}
                value={formData.province}
                errorMessage={errors.province}
            />
            <ValidationInput
                id="postalCode"
                name="postalCode"
                type="text"
                title="Postal Code/ZIP *"
                autoComplete="postal-code"
                required
                onChange={handleInputChange}
                value={formData.postalCode}
                errorMessage={errors.postalCode}
            />
            <ValidationInput
                id="country"
                name="country"
                type="text"
                title="Country *"
                autoComplete="country"
                required
                onChange={handleInputChange}
                value={formData.country}
                errorMessage={errors.country}
            />

            {/* Shipping Method */}
            <h4 className="w-full text-lg font-semibold text-gray-700 mt-6">
                Requested Shipping Method
            </h4>
            <div className="w-full flex flex-col gap-2">
                {["Purolator", "Canada Post", "UPS", "FedEx"].map((method) => (
                    <label key={method} className="flex items-center gap-2">
                        <input
                            type="radio"
                            name="shippingMethod"
                            value={method}
                            checked={formData.shippingMethod === method}
                            onChange={handleInputChange}
                        />
                        {method}
                    </label>
                ))}
            </div>

            {/* Payment Information */}
            <h4 className="w-full text-lg font-semibold text-gray-700 mt-6 mb-4">
                Payment Information
            </h4>
            <div className="w-full flex flex-col gap-2">
                <label className="flex flex-col w-full">
                    <span className="text-lg font-semibold text-gray-700">Cardholder Name</span>
                    <input
                        type="text"
                        name="cardholderName"
                        value={formData.cardholderName}
                        onChange={handleInputChange}
                        className="border rounded p-2 w-full"
                        placeholder="John Doe"
                    />
                </label>
                <label className="flex flex-col w-full">
                    <span className="text-lg font-semibold text-gray-700">Card Number</span>
                    <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        className="border rounded p-2 w-full"
                        placeholder="1234 5678 9012 3456"
                    />
                </label>
                <div className="flex gap-2">
                    <label className="flex flex-col w-1/4">
                        <span className="text-lg font-semibold text-gray-700">Expiry Date</span>
                        <input
                            type="text"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            className="border rounded p-2 w-full"
                            placeholder="MM/YY"
                        />
                    </label>
                    <label className="flex flex-col w-1/4">
                        <span className="text-lg font-semibold text-gray-700">CVV</span>
                        <input
                            type="text"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            className="border rounded p-2 w-full"
                            placeholder="123"
                        />
                    </label>
                </div>
            </div>
        </form>
    );
}

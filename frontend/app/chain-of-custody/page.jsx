"use client";

import React, { useEffect, useRef } from "react";
import { useForm, Controller, useFieldArray, FormProvider } from "react-hook-form";
import { useState } from "react";
import Link from "next/link";
import NotificationPopup from "../components/popup/NotificationPopup";

//MAIN FOCUS
//Chain of custody page

//analyte selection component must be part of this form
// equipment rental component must be part of this form

// neither should be their own separate pages

const CocForm = () => {
  const appendedRef = useRef(false);
  const [emailSentSuccess, setEmailSentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const methods = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      samples: []
    }
  });

  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors }
  } = methods;

  const { fields, append } = useFieldArray({
    control: methods.control,
    name: "samples"
  });

  const turnaroundOptions = [
    "Same Day",
    "24 Hours",
    "48 Hours",
    "3 Days",
    "5 Days",
    "7 Days",
    "Legionella -14 Days",
    "**Evening/Weekend (Surcharge applies)"
  ];

  // Autofill form based on stored user data
  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        methods.setValue("contactName", `${user.first_name} ${user.last_name}`);
        methods.setValue("email", user.email || "");
        methods.setValue("phone", user.phone_number || "");
        methods.setValue("streetAddress", user.street_address || "");
        methods.setValue("city", user.city || "");
        methods.setValue("province", user.province || "");
        methods.setValue("postalCode", user.postal_code || "");
        methods.setValue("country", user.country || "");
        methods.setValue("creditCard", user.credit_card || "");
        methods.setValue("jobTitle", user.job_title || "");
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, [methods]);

  // Append cart items to samples only once
  useEffect(() => {
    if (appendedRef.current) return;
    appendedRef.current = true;

    const cartItems = JSON.parse(sessionStorage.getItem("cartItems")) || [];
    console.log(cartItems);
    cartItems.forEach(item => {
      append({
        analyte: item.analyte_name,
        method: item.method_name,
        matrix: item.matrix,
        measurement: item.measurement,
        sample_rate: item.sample_rate,
        limit_of_quantification: item.limit_of_quantification,
        pumps: item.required_pumps,
        media: item.required_media,
        customer_comment: item.customer_comment,
        quantity: item.required_quantity,
        price: item.selectedTurnaroundTime.price * item.required_quantity
      });
    });
  }, [append]);

  const onSubmit = async (data) => {
    // Check if at least one analyte is present
    const hasAnalyte = data.samples.some(sample => sample.analyte && sample.analyte.trim() !== "");

    if (!hasAnalyte) {
      setErrorMessage("Please add at least one analyte before submitting.");
      return;
    }

    try {
      const url = `http://localhost/api/submit-coc`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        setEmailSentSuccess(true);
      } else {
        if (response.status === 422 && result.errors) {
          console.error('Validation Errors:', result.errors);

          Object.entries(result.errors).forEach(([fieldName, errorMessages]) => {
            console.error(`Field: ${fieldName} -> ${errorMessages.join(', ')}`);
          });
        } else {
          throw new Error(result.message || 'Submission failed');
        }
      }
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  return (
    <div className="max-w-screen-2xl mx-auto p-4 sm:p-6 lg:p-8">
      {errorMessage && (
        <div className="text-red-600 p-2 bg-red-100 border border-red-300 rounded-md mb-4">
          {errorMessage}
        </div>
      )}
      <div className="mb-4">
        <Link href="/view-cart">
          <button
            type="button"
            className="bg-[#003883] text-white px-6 py-2 rounded-md transition-all duration-300 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to Cart
          </button>
        </Link>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-6 pb-4 border-b-2 border-black">
        ENVIRO WORKS CHAIN OF CUSTODY
      </h1>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="labClient" className="block text-sm font-medium text-gray-700">
                LAB CLIENT:
              </label>
              <input
                id="labClient"
                type="text"
                {...register("labClient", {
                  required: "Lab Client is required",
                  minLength: { value: 3, message: "Lab Client must be at least 3 characters long" },
                  validate: (value) => value.trim() !== "" || "Lab Client cannot be blank"
                })}
                placeholder="Enter lab client"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                aria-required="true"
              />
              {errors.labClient && (
                <p className="text-red-600 text-xs">{errors.labClient.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                DATE:
              </label>
              <input
                id="date"
                type="date"
                {...register("date", { required: "Date is required" })}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                aria-required="true"
              />
              {errors.date && <p className="text-red-600 text-xs">{errors.date.message}</p>}
            </div>

            <div>
              <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700">
                Street Address:
              </label>
              <input
                id="streetAddress"
                type="text"
                {...register("streetAddress", {
                  required: "Street address is required",
                  minLength: { value: 5, message: "Street Address must be at least 5 characters long" },
                  validate: (value) => value.trim() !== "" || "Street address cannot be blank"
                })}
                placeholder="Enter street and number"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                aria-required="true"
              />
              {errors.streetAddress && (
                <p className="text-red-600 text-xs">{errors.streetAddress.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City:
                </label>
                <input
                  id="city"
                  type="text"
                  {...register("city", {
                    required: "City is required",
                    validate: (value) => value.trim() !== "" || "City cannot be blank"
                  })}
                  placeholder="Enter city"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
                {errors.city && <p className="text-red-600 text-xs">{errors.city.message}</p>}
              </div>

              <div>
                <label htmlFor="province" className="block text-sm font-medium text-gray-700">
                  Province:
                </label>
                <input
                  id="province"
                  type="text"
                  {...register("province", {
                    required: "Province is required",
                    validate: (value) => value.trim() !== "" || "Province cannot be blank"
                  })}
                  placeholder="Enter province"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
                {errors.province && <p className="text-red-600 text-xs">{errors.province.message}</p>}
              </div>

              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                  Postal Code:
                </label>
                <input
                  id="postalCode"
                  type="text"
                  {...register("postalCode", {
                    required: "Postal code is required",
                    pattern: {
                      value: /^[A-Za-z]\d[A-Za-z]\s?\d[A-Za-z]\d$/,
                      message: "Invalid postal code format. Example: T5V 0H6"
                    }
                  })}
                  placeholder="Enter postal code"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
                {errors.postalCode && (
                  <p className="text-red-600 text-xs">{errors.postalCode.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                Country:
              </label>
              <input
                id="country"
                type="text"
                {...register("country", {
                  required: "Country is required",
                  validate: (value) => value.trim() !== "" || "Country cannot be blank"
                })}
                placeholder="Enter country"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
              {errors.country && <p className="text-red-600 text-xs">{errors.country.message}</p>}
            </div>

            <div>
              <label htmlFor="contactName" className="block text-sm font-medium text-gray-700">
                CONTACT NAME:
              </label>
              <input
                id="contactName"
                type="text"
                {...register("contactName", {
                  required: "Contact Name is required",
                  validate: (value) => value.trim() !== "" || "Contact Name cannot be blank"
                })}
                placeholder="Enter contact name"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                aria-required="true"
              />
              {errors.contactName && (
                <p className="text-red-600 text-xs">{errors.contactName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                EMAIL:
              </label>
              <input
                id="email"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
                placeholder="Enter email"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                aria-required="true"
              />
              {errors.email && (
                <p className="text-red-600 text-xs">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="project" className="block text-sm font-medium text-gray-700">
                PROJECT:
              </label>
              <input
                id="project"
                type="text"
                {...register("project", {
                  required: "Project is required",
                  minLength: { value: 3, message: "Project Name must be at least 3 characters long" },
                  validate: (value) => value.trim() !== "" || "Project cannot be blank"
                })}
                placeholder="Enter project"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                aria-required="true"
              />
              {errors.project && (
                <p className="text-red-600 text-xs">{errors.project.message}</p>
              )}
            </div>
          </fieldset>

          <fieldset className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <legend className="sr-only">Billing Information</legend>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                PHONE:
              </label>
              <input
                id="phone"
                type="text"
                {...register("phone", {
                  required: "Phone is required",
                  pattern: {
                    value: /^\d{10}$/,
                    message: "Phone number must be exactly 10 digits"
                  }
                })}
                placeholder="Enter phone"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                aria-required="true"
              />
              {errors.phone && (
                <p className="text-red-600 text-xs">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="fax" className="block text-sm font-medium text-gray-700">
                FAX:
              </label>
              <input
                id="fax"
                type="text"
                {...register("fax", {
                  pattern: {
                    value: /^\d{10}$/,
                    message: "Fax number must be exactly 10 digits (if provided)"
                  }
                })}
                placeholder="Enter fax"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                aria-required="true"
              />
              {errors.fax && (
                <p className="text-red-600 text-xs">{errors.fax.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="poNumber" className="block text-sm font-medium text-gray-700">
                PO#:
              </label>
              <input
                id="poNumber"
                type="text"
                {...register("poNumber", {
                  required: "PO# is required",
                  validate: (value) => value.trim() !== "" || "PO# cannot be blank"
                })}
                placeholder="Enter PO#"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                aria-required="true"
              />
              {errors.poNumber && (
                <p className="text-red-600 text-xs">{errors.poNumber.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="creditCard" className="block text-sm font-medium text-gray-700">
                CREDIT CARD #:
              </label>
              <input
                id="creditCard"
                type="text"
                {...register("creditCard", {
                  required: "Credit Card is required",
                  pattern: {
                    value: /^\d{16}$/,
                    message: "Credit Card number must be exactly 16 digits"
                  }
                })}
                placeholder="Enter credit card number"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                aria-required="true"
              />
              {errors.creditCard && (
                <p className="text-red-600 text-xs">{errors.creditCard.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="expDate" className="block text-sm font-medium text-gray-700">
                EXP.
              </label>
              <input
                id="expDate"
                type="text"
                {...register("expDate", {
                  required: "Expiration date is required",
                  pattern: {
                    value: /^(0[1-9]|1[0-2])\/?([0-9]{2})$/,
                    message: "Expiration date must be in MM/YY format"
                  }
                })}
                placeholder="Enter expiration date"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                aria-required="true"
              />
              {errors.expDate && (
                <p className="text-red-600 text-xs">{errors.expDate.message}</p>
              )}
            </div>
          </fieldset>

          <fieldset className="border border-gray-800 p-4">
            <legend className="text-base font-semibold text-gray-700 mb-2">
              Turnaround Time:
            </legend>
            <Controller
              name="turnaround"
              control={control}
              rules={{ required: "Please select one turnaround option" }}
              render={({ field }) => (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {turnaroundOptions.map((label) => (
                    <div key={label} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`turnaround-${label}`}
                        checked={field.value === label}
                        onChange={() => field.onChange(label === field.value ? "" : label)}
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                      <label htmlFor={`turnaround-${label}`} className="ml-2 text-sm">
                        {label}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            />
            {errors.turnaround && (
              <p className="text-red-600 text-xs">{errors.turnaround.message}</p>
            )}
            <div className="mt-4">
              <label htmlFor="timeReceived" className="block text-sm font-medium text-gray-700">
                Time Received:
              </label>
              <input
                id="timeReceived"
                type="time"
                {...register("timeReceived", {
                  required: "Time Received is required"
                })}
                className="mt-1 block border border-gray-600 rounded-md p-2"
              />
            </div>
          </fieldset>

          <div className="border border-gray-800 p-4">
            <div className="flex justify-between items-center p-4 border-none">
              <h2 className="text-xl font-bold mb-4">Sample Details</h2>
              <Link href="/">
                <button
                  type="button"
                  className="bg-[#003883] text-white px-6 py-2 rounded-md transition-all duration-300 hover:bg-blue-500"
                >
                  Add New Analyte
                </button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="bg-[#003883] px-6 py-4">
                    <h3 className="text-lg font-semibold text-white">
                      {watch(`samples.${index}.analyte`) || field.analyte}
                    </h3>
                  </div>
                  <div className="px-6 py-4 border-t border-gray-200">
                    <p className="text-md">
                      <span className="font-semibold">Method:</span>{" "}
                      {watch(`samples.${index}.method`) || field.method}
                    </p>
                    <p className="mt-2">
                      <span className="font-semibold">Matrix:</span>{" "}
                      {watch(`samples.${index}.matrix`) || field.matrix}
                    </p>
                    <p className="mt-2">
                      <span className="font-semibold">Media:</span>{" "}
                      {watch(`samples.${index}.media`) || field.media}
                    </p>
                    <p className="mt-2">
                      <span className="font-semibold">Measurement:</span>{" "}
                      {watch(`samples.${index}.measurement`) || field.measurement}
                    </p>
                    <p className="mt-2">
                      <span className="font-semibold">Sample Rate:</span>{" "}
                      {watch(`samples.${index}.sample_rate`) || field.sample_rate}
                    </p>
                    <p className="mt-2">
                      <span className="font-semibold">LOQ:</span>{" "}
                      {watch(`samples.${index}.limit_of_quantification`) || field.limit_of_quantification}
                    </p>
                    <p className="mt-2">
                      <span className="font-semibold">Pumps:</span>{" "}
                      {watch(`samples.${index}.pumps`) || field.pumps}
                    </p>
                    <p className="mt-2">
                      <span className="font-semibold">Quantity:</span>{" "}
                      {watch(`samples.${index}.quantity`) || field.quantity}
                    </p>
                    <p className="mt-2">
                      <span className="font-semibold">Price:</span>{" "}
                      {watch(`samples.${index}.price`) || field.price}
                    </p>

                    <div className="mt-2">
                      <label className="font-semibold block">Time On:</label>
                      <input
                        type="time"
                        {...register(`samples.${index}.timeOn`)}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      />
                    </div>
                    <div className="mt-2">
                      <label className="font-semibold block">Time Off:</label>
                      <input
                        type="time"
                        {...register(`samples.${index}.timeOff`)}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      />
                    </div>
                    <div className="mt-2">
                      <label className="font-semibold block">Flow Rate:</label>
                      <input
                        type="text"
                        {...register(`samples.${index}.flowRate`)}
                        placeholder="L/min or cm²"
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      />
                    </div>
                    <p className="mt-2">
                      <span className="font-semibold">Sample Description</span>{" "}
                      {field.customer_comment}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-md space-y-1">
            <p className="text-sm italic">
              *Same Day turnaround availability is dependant on lab sample volume...
            </p>
            <p className="text-sm italic">
              *Lead Rush - 48 hour turnaround. VOC's - 5 days turnaround
            </p>
            <p className="text-sm italic">
              *Evening/Weekend analysis must be pre-arranged with the lab
            </p>
          </div>

          <div className="border-t border-gray-800 pt-4">
            <label htmlFor="signature" className="block text-sm font-medium text-gray-700">
              Signature:
            </label>
            <input
              id="signature"
              type="text"
              {...register("signature", {
                required: "Signature is required",
                validate: (value) => value.trim() !== "" || "Signature cannot be blank"
              })}
              placeholder="Enter signature"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              style={{ fontFamily: "'Pacifico', cursive", fontSize: "1.5rem" }}
              aria-required="true"
            />
            {errors.signature && (
              <p className="text-red-600 text-xs">{errors.signature.message}</p>
            )}
          </div>
          <div className="space-x-4">
            <a
              href="/LAB-010-025-COC.xlsx"
              download="LAB-010-025-COC.xlsx"
              className="bg-[#003883] text-white px-6 py-2 rounded-md transition-all duration-300 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 inline-block"
            >
              Download Excel Form
            </a>
            <button
              type="submit"
              className="mt-4 bg-[#003883] text-white px-6 py-2 rounded-md transition-all duration-300 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Submit Chain of Custody
            </button>
          </div>
        </form>
      </FormProvider>
      {emailSentSuccess && (
        <NotificationPopup
          isOpen={emailSentSuccess}
          onActivityClicked={() => setEmailSentSuccess(false)}
          title="Success!"
          activityText="Continue"
        >
          <p>Chain Of Custody sent successfully!</p>
        </NotificationPopup>
      )}
    </div>
  );
};
export default CocForm;
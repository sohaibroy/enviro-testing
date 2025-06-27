"use client";

import React, { useEffect, useState } from "react";
import { LoadingIcon } from "../components/loading/LoadingIcon";
import { ValidationInput } from "../components/basic/ValidationInput";
import { FaTrashCan } from "react-icons/fa6";
import { GeneralMessage } from "../components/basic/GeneralMessage";
import { ErrorMessage } from "../components/basic/ErrorMessage";
import Link from "next/link";
import FadeIn from "../components/basic/FadeIn";
import { isTokenExpired } from "@/utils/session";
import NPSSurvey from "../components/nps-survey/NPSSurvey";
import { useRouter } from "next/navigation";
import NotificationPopup from "../components/popup/NotificationPopup";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;


const EstimatePage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [header, setHeader] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [gst, setGst] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const [emailSentSuccess, setEmailSentSuccess] = useState(false);

  // For NPS Survey
  const [isPrompt, setPrompt] = useState(false);

  // For NPS Survey
  const handleClosePrompt = () => {
    setPrompt(false)
  };

  useEffect(() => {
    const storedCartItems = JSON.parse(sessionStorage.getItem("cartItems")) || [];
    setCartItems(storedCartItems);
  }, []);

  const handleGetEstimate = () => {
    router.push(`/get-estimate?cartItems=${encodeURIComponent(JSON.stringify(cartItems))}`);
  };

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

  const validateInput = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First Name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone Number is required";
    } else if (formData.phoneNumber.length > 20) {
      newErrors.phoneNumber =
        "Phone Number cannot be greater than 20 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const formatToCADPrice = (number) =>
    Number(number).toLocaleString("en-CA", {
      style: "currency",
      currency: "CAD",
    });

  const isFormFilled = () =>
    Object.values(formData).every((value) => value.trim() !== "");

  useEffect(() => {
    setSubtotal(
      cartItems.reduce(
        (acc, item) =>
          acc + item.selectedTurnaroundTime.price * item.required_quantity,
        0
      )
    );
  }, [cartItems]);

  useEffect(() => {
    setGst(subtotal * 0.05);
  }, [subtotal]);

  useEffect(() => {
    setTotalAmount(subtotal + gst);
  }, [subtotal, gst]);

  useEffect(() => {
    setLoading(true);

    const storedCartItems =
      JSON.parse(sessionStorage.getItem("cartItems")) || [];
    if (storedCartItems.length > 0) {
      setCartItems(storedCartItems);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    setIsAuthenticated(
      sessionStorage.getItem("accountType") === "true" &&
      sessionStorage.getItem("accessToken") !== null
    );
  }, [
    typeof sessionStorage !== "undefined"
      ? sessionStorage.getItem("accessToken")
      : null,
  ]);

  const handleIncreaseQuantity = (index) => {
    const updatedCartItems = cartItems.map((item, i) => {
      if (i === index) {
        return { ...item, required_quantity: item.required_quantity + 1 };
      }
      return item;
    });

    setCartItems(updatedCartItems);
    sessionStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
  };

  const handleDecreaseQuantity = (index) => {
    const updatedCartItems = cartItems.map((item, i) => {
      if (i === index && item.required_quantity > 1) {
        return { ...item, required_quantity: item.required_quantity - 1 };
      }
      return item;
    });

    setCartItems(updatedCartItems);
    sessionStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
  };

  const handleDeleteItem = (index) => {
    const updatedCartItems = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCartItems);
    sessionStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
  };

  const handleClearCart = () => {
    setCartItems([]);
    sessionStorage.removeItem("cartItems");
  };

  const handlePlaceOrder = () => {
    if (!validateInput() && !isAuthenticated) {
      return;
    }
    let updatedHeader = {
      ...header,
      order_date: new Date().toISOString().slice(0, 10),
      total_amount: +totalAmount.toFixed(2),
      gst: +gst.toFixed(2),
      subtotal: +subtotal.toFixed(2),
    };

    // For NPS Survey
    setPrompt(true)
    setHeader(updatedHeader);

    const ordertDetails = cartItems.map((item) => {
      const {
        analyte_name,
        general_comments,
        method_id,
        media,
        matrix,
        sample_rate,
        method_name,
        measurement,
        limit_of_quantification,
        selectedTurnaroundTime: { turn_around_id },
        selectedTurnaroundTime: { price },
        turn_around_times,
        ...rest
      } = item;
      return { ...rest, turn_around_id, price };
    });

    const orderData = {
      transaction: isAuthenticated
        ? updatedHeader
        : { ...updatedHeader, ...formData },
      order_details: ordertDetails,
    };

    submitOrder(orderData);
  };

  const handleEstimate = () => {
    if (!validateInput() && !isAuthenticated) {
      return;
    }
    let updatedEstimateHeader = {
      ...header,
      order_date: new Date().toISOString().slice(0, 10),
      total_amount: +totalAmount.toFixed(2),
      gst: +gst.toFixed(2),
      subtotal: +subtotal.toFixed(2),
    };
    setHeader(updatedEstimateHeader);

    const orderEstimateDetails = cartItems.map((item) => {
      const {
        analyte_name,
        general_comments,
        method_id,
        media,
        matrix,
        sample_rate,
        method_name,
        measurement,
        limit_of_quantification,
        selectedTurnaroundTime: { turn_around_id },
        selectedTurnaroundTime: { price },
        turn_around_times,
        ...rest
      } = item;
      return { ...rest, turn_around_id, price };
    });

    const orderEstimateData = {
      order_header: isAuthenticated
        ? updatedEstimateHeader
        : { ...updatedEstimateHeader, ...formData },
      order_details: orderEstimateDetails,
    };

    submitEstimate(orderEstimateData);
  };

  const submitEstimate = async (orderEstimateData) => {
    setLoading(true);
    try {
      const accessToken = sessionStorage.getItem("accessToken");

      if (accessToken) {
        if (isTokenExpired()) {
          window.location.href = "/customer-login";
          return;
        }
      }
      const headers = {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      };

      //const url = `http://localhost/api/send-estimate-email`;
      const url = `${baseUrl}/api/send-estimate-email`;

      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(orderEstimateData),
      });

      if (!response.ok) {
        if (response.status === 422) {
          const data = await response.json();
          setMessage(data.message);
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } else {
        setSubmitted(false);
        setEmailSentSuccess(true);
      }
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const submitOrder = async (orderData) => {
    setLoading(true);
    try {
      const accessToken = sessionStorage.getItem("accessToken");

      if (accessToken) {
        if (isTokenExpired()) {
          window.location.href = "/customer-login";
          return;
        }
      }

      const headers = accessToken
        ? {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        }
        : { "Content-Type": "application/json" };

      //const url = accessToken
        //? `http://localhost:80/api/transactions/create`
        //: `http://localhost:80/api/orders/walk-in`;

      const url = accessToken
          ? `${baseUrl}/api/transactions/create`
          : `${baseUrl}/api/orders/walk-in`;

      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        if (response.status === 422) {
          const data = await response.json();
          setMessage(data.message);
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } else {
        sessionStorage.setItem("cartItems", null);
        setSubmitted(true);
      }
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-4 my-[3rem] max-w-[70rem] mx-auto">
      {loading ? (
        <LoadingIcon />
      ) : error ? (
        <ErrorMessage error={error} />
      ) : message ? (
        <div className="flex flex-col justify-center h-[40vh] items-center gap-[1rem]">
          <GeneralMessage message={message} className="h-auto" />
          <button
            href="/view-cart"
            className="bg-enviro_blue text-white w-[6rem] p-2 font-bold text-center transition-all hover:scale-[101%] duration-300"
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
        </div>
      ) : submitted === true ? (
        <div className="h-[50vh] flex">
          <div className="max-w-[30rem] flex font-semibold text-enviro_blue drop-shadow-2xl bg-white border p-[1rem] flex-col m-auto justify-center gap-[2rem] transition-all duration-300 hover:scale-[101%]">
            <img className="h-[3rem] w-[18rem]" src="/img/eurofins-logo.png" />
            <div className="flex flex-col gap-[.5rem]">
              <p className="drop-shadow-2xl text-center">
                Order has been placed!
              </p>
              <p className="drop-shadow-2xl text-center font-light text-xs">
                A copy of your invoice has been sent to your email.
              </p>
            </div>
            {/* NPS Survey Modal */}
            <NPSSurvey open={isPrompt} />
            <Link
              className="bg-enviro_blue text-white p-2 font-bold text-center transition-all hover:scale-[101%] duration-300"
              href="/"
            >
              Return To Home Page
            </Link>
          </div>
        </div>
      ) : (
        <FadeIn>
          <div className="flex flex-col justify-center p-[1rem] gap-[2rem]">
            {cartItems.length === 0 ? (
              <p className="text-center font-bold text-gray-500 mt-[4rem] mb-[8rem]">
                No items in cart...
              </p>
            ) : (
              <div className="w-full overflow-x-auto drop-shadow-lg">
                <div className="w-full flex flex-col">
                  <table className="divide-y divide-gray-200 text-xs mx-auto w-full overflow-hidden rounded-md">
                    <thead className="bg-[#003883] text-white">
                      <tr>
                        <th className="pl-3 py-2 text-left uppercase">
                          Analyte
                        </th>
                        <th className="pl-3 py-2 text-left uppercase">
                          Method
                        </th>
                        <th className="pl-3 py-2 text-left uppercase">Pumps</th>
                        <th className="pl-3 py-2 text-left uppercase">Media</th>
                        <th className="pl-3 py-2 text-left uppercase">
                          Customer Comment
                        </th>
                        <th className="pl-3 py-2 text-left w-[8rem] uppercase">
                          Quantity
                        </th>
                        <th className="pl-3 py-2 text-left w-[8rem] uppercase">
                          Price
                        </th>
                        <th className="pr-3 py-2 text-right uppercase">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item, index) => (
                        <tr
                          key={index}
                          className="bg-white border-b border-gray-200"
                        >
                          <td className="pl-3 py-2 font-medium text-gray-900">
                            {item.analyte_name}
                          </td>
                          <td className="pl-3 py-2 text-gray-500">
                            {item.method_name}
                          </td>
                          <td className="pl-3 py-2 text-gray-500">
                            {item.required_pumps}
                          </td>
                          <td className="pl-3 py-2 text-gray-500">
                            {item.required_media}
                          </td>
                          <td className="pl-3 py-2 text-gray-500 whitespace-normal">
                            <div className="flex flex-col max-h-20 overflow-y-auto break-words w-[30ch]">
                              {item.customer_comment}
                            </div>
                          </td>
                          <td className="pl-3 py-2 text-gray-500">
                            <div className="flex items-center space-x-2">
                              <button
                                className="border border-gray-300 px-1 py-1 transition-all hover:bg-gray-200 hover:scale-[110%] duration-300 rounded-md w-[1.5rem] h-[1.5rem]"
                                onClick={() => handleDecreaseQuantity(index)}
                              >
                                -
                              </button>
                              <span>{item.required_quantity}</span>
                              <button
                                className="border border-gray-300 px-1 py-1 transition-all hover:bg-gray-200 hover:scale-[110%] duration-300 rounded-md w-[1.5rem] h-[1.5rem]"
                                onClick={() => handleIncreaseQuantity(index)}
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="pl-3 py-2 text-gray-500">
                            {formatToCADPrice(
                              item.selectedTurnaroundTime.price *
                              item.required_quantity
                            )}
                          </td>
                          <td className="pl-3 py-2 text-gray-500 flex justify-end items-center pr-3">
                            <button
                              className="text-enviro_orange border border-enviro_orange px-2 py-1 rounded-sm hover:bg-enviro_orange hover:text-white transition-all hover:scale-[110%]"
                              onClick={() => handleDeleteItem(index)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {cartItems.length > 0 && (
              <section className="drop-shadow-lg border p-[1.25rem] flex justify-between text-gray-700 font-semibold items-end bg-gray-100 rounded-xl">
                <div
                  className="text-enviro_blue cursor-pointer gap-[.5rem] drop-shadow-xl font-extrabold transition-all hover:scale-[102%] duration-300"
                  onClick={handleClearCart}
                >
                  <p className="text-xs">Clear</p>
                  <FaTrashCan size={30} />
                </div>
                <div className="min-w-[16rem] flex flex-col gap-[.5rem] drop-shadow-xl">
                  <p className="flex justify-between">
                    SubTotal
                    <span className="font-extrabold">
                      ${subtotal.toFixed(2)}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    GST{" "}
                    <span className="font-extrabold">${gst.toFixed(2)}</span>
                  </p>
                  <p className="flex justify-between">
                    Total
                    <span className="font-extrabold">
                      ${totalAmount.toFixed(2)}
                    </span>
                  </p>
                </div>
              </section>
            )}
            {!isAuthenticated && cartItems.length > 0 ? (
              <div className="mt-5 border border-gray-200 shadow-lg rounded-xl p-[2rem] flex flex-col gap-[.5rem]">
                <h4 className="text-sm font-semibold text-gray-600 text-center">
                  Please LOGIN to get customer pricing if you already have an
                  account with us!
                </h4>
                <h4 className="text-sm font-semibold text-gray-600 text-center">
                  If you intend to proceed as a one time purchaser / walk-in
                  customer please fill out this form!
                </h4>
                <h4 className="text-sm font-semibold text-gray-600 text-center">
                  To mail a estimate, you must be logged in.
                </h4>
                <form
                  className="w-full flex flex-wrap justify-between gap-y-[1rem] py-[2.5rem]"
                  action="#"
                  method="POST"
                >
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
                </form>
                <div className="text-center mt-4">
                  <div className="flex justify-center items-center w-full mx-auto gap-x-4">
                    <button onClick={handleGetEstimate} className={`py-2 px-4 drop-shadow-xl w-full md:w-1/4 rounded-md text-white bg-[#003883] ${!isFormFilled()
                      ? "opacity-50"
                      : "transition-all hover:bg-[#002f6c] hover:scale-[102%] duration-300"
                      }`}
                      disabled={!isFormFilled()}>
                      View Estimate Details
                    </button>
                    <button
                      onClick={() => {
                        router.push('/chain-of-custody');
                      }}
                      className={`py-2 px-4 drop-shadow-xl w-full md:w-1/4 rounded-md text-white bg-[#003883] hover:bg-[#002f6c] hover:scale-[102%] duration-300`}
                    >
                      Generate Chain of Custody
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      className={`py-2 px-4 drop-shadow-xl w-full md:w-1/4 rounded-md text-white bg-[#003883] ${!isFormFilled() 
                        ? "opacity-50"
                        : "transition-all hover:bg-[#002f6c] hover:scale-[102%] duration-300"
                        }`}
                      disabled={!isFormFilled()}
                    >
                      Place Order
                    </button>
                  </div>
                </div>
              </div>
            ) : cartItems.length > 0 ? (
              <div className="flex justify-center font-semibold w-full mx-auto gap-x-4">
                <button onClick={handleGetEstimate}
                  className={`py-2 px-4 drop-shadow-xl w-full md:w-1/4 rounded-md text-white bg-[#003883] hover:bg-[#002f6c] hover:scale-[102%] duration-300`}
                >
                  View Estimate Details
                </button>
                <button
                  onClick={handleEstimate}
                  className={`py-2 px-4 drop-shadow-xl w-full md:w-1/4 rounded-md text-white bg-[#003883] hover:bg-[#002f6c] hover:scale-[102%] duration-300`}
                >
                  Email Estimate
                </button>
                <button
                  onClick={() => {
                    router.push('/chain-of-custody');
                  }}
                  className={`py-2 px-4 drop-shadow-xl w-full md:w-1/4 rounded-md text-white bg-[#003883] hover:bg-[#002f6c] hover:scale-[102%] duration-300`}
                >
                  Generate Chain of Custody
                </button>
                <button
                  onClick={handlePlaceOrder}
                  className={`py-2 px-4 drop-shadow-xl w-full md:w-1/4 rounded-md text-white bg-[#003883] hover:bg-[#002f6c] hover:scale-[102%] duration-300`}
                >
                  Place Order
                </button>
              </div>
            ) : (
              <></>
            )}
          </div>
        </FadeIn>
      )}
      {emailSentSuccess && (
        <NotificationPopup
          isOpen={emailSentSuccess}
          onActivityClicked={() => setEmailSentSuccess(false)}
          title="Success"
          activityText="Continue"
        >
          <p>The estimate email was sent successfully!</p>
        </NotificationPopup>
      )}
    </div>
  );
};

export default EstimatePage;
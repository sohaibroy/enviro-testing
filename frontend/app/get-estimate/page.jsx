"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import DownloadEstimate from "../components/download-estimate/DownloadEstimate";


//TBD

const GetEstimatePage = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [gst, setGst] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const componentRef = useRef(null);

  useEffect(() => {
    const newSubtotal = cartItems.reduce(
      (acc, item) => acc + item.selectedTurnaroundTime.price * item.required_quantity,
      0
    );
    setSubtotal(newSubtotal);
  }, [cartItems]);

  useEffect(() => {
    setGst(subtotal * 0.05);
  }, [subtotal]);

  useEffect(() => {
    setTotalAmount(subtotal + gst);
  }, [subtotal, gst]);

  // Retrieve cart items from the query parameters
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const cartItemsString = queryParams.get("cartItems");

    if (cartItemsString) {
      setCartItems(JSON.parse(cartItemsString));
    }
  }, []);

  const handleGoBack = () => {
    router.push("/view-cart");
  };

  const formatToCADPrice = (number) =>
    Number(number).toLocaleString("en-CA", {
      style: "currency",
      currency: "CAD",
    });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
        <div ref={componentRef}>
          <h1 className="text-2xl font-bold text-enviro_blue mb-6 text-center">
            Estimate Details
          </h1>
          {cartItems.length > 0 ? (
            cartItems.map((item, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 mb-4"
              >
                <p className="mb-2">
                  <span className="font-semibold">Analyte: </span>
                  {item.analyte_name}
                </p>
                <p className="mb-2">
                  <span className="font-semibold">Method: </span>
                  {item.method_name}
                </p>
                <p className="mb-2">
                  <span className="font-semibold">Price: </span>
                  {formatToCADPrice(
                    item.selectedTurnaroundTime.price * item.required_quantity
                  )}
                </p>
                <p className="mb-2">
                  <span className="font-semibold">Quantity: </span>
                  {item.required_quantity}
                </p>
                <p className="mb-2">
                  <span className="font-semibold">Quantity Pumps: </span>
                  {item.required_pumps}
                </p>
                <p className="mb-2">
                  <span className="font-semibold">Quantity Media: </span>
                  {item.required_media}
                </p>
                <p className="mb-2">
                  <span className="font-semibold">Turn Around Time: </span>
                  {item.selectedTurnaroundTime.turnaround_time}
                </p>
                {item.customer_comment && (
                  <p className="mb-2">
                    <span className="font-semibold">Comments: </span>
                    {item.customer_comment}
                  </p>
                )}
                <p className="mb-2">
                  <span className="font-semibold">SubTotal: </span>
                  <span>{formatToCADPrice(subtotal)}</span>
                </p>
                <p className="mb-2">
                  <span className="font-semibold">GST: </span>
                  <span>{formatToCADPrice(gst)}</span>
                </p>
                <p className="mb-2">
                  <span className="font-semibold">Total Amount: </span>
                  <span>{formatToCADPrice(totalAmount)}</span>
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 font-bold my-8">
              No items in cart...
            </p>
          )}
        </div>

        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={handleGoBack}
            className="bg-enviro_blue text-white px-6 py-2 rounded-md hover:bg-[#002f6c] transition-all duration-300"
          >
            Go Back
          </button>
          <DownloadEstimate cartItems={cartItems} subtotal={subtotal}
            gst={gst} totalAmount={totalAmount} />
        </div>
      </div>
    </div>
  );
};

export default GetEstimatePage;
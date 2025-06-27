import React, { useState } from "react";
import BasePopup from "../basic/BasePopup";
import { RadioBoolInput } from "../basic/RadioBoolInput";
import { isTokenExpired } from "@/utils/session";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;


const OrderUpdatePopup = ({ order, isOpen, onClose, title }) => {
  if (!isOpen) return null;

  const [currentOrder, setOrder] = useState({
    is_active: order.is_active !== null ? order.is_active : 1,
  });

  const updateOrder = () => {
    if (isTokenExpired()) {
      window.location.href = "/admin-login";
      return;
    }

    //fetch(`http://localhost:80/api/order/update/${order.order_id}`, {
    fetch(`${baseUrl}/api/order/update/${order.order_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({
        is_active: currentOrder.is_active,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
        onClose();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <BasePopup
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      activityText="Update"
      onActivityClicked={updateOrder}
    >
      <form className="flex flex-wrap justify-between gap-y-4 min-w-[20rem]">
        <RadioBoolInput
          title="Status"
          value={currentOrder.is_active}
          onChange={(selectedValue) => {
            setOrder({ ...currentOrder, is_active: selectedValue });
          }}
        />
      </form>
    </BasePopup>
  );
};

export { OrderUpdatePopup };

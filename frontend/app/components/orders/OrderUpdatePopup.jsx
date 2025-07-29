import React, { useState } from "react";
import BasePopup from "../basic/BasePopup";
import { isTokenExpired } from "@/utils/session";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const OrderUpdatePopup = ({ order, isOpen, onClose, title }) => {
  if (!isOpen) return null;

  const [currentOrder, setOrder] = useState({
    status: order.status !== null ? order.status : 0,
  });

  const [loading, setLoading] = useState(false);

  const updateOrder = () => {
    if (isTokenExpired()) {
      window.location.href = "/admin-login";
      return;
    }

    setLoading(true);

    fetch(`${baseUrl}/api/order/update/${order.order_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({
        status: currentOrder.status,
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
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <BasePopup
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      activityText={loading ? "Updating..." : "Update"}
      onActivityClicked={updateOrder}
    >
      <form className="flex flex-col gap-4">
        <label className="text-lg font-semibold">Order Status</label>

        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="order_status"
            value={0}
            checked={currentOrder.status === 0}
            onChange={(e) =>
              setOrder({ ...currentOrder, status: parseInt(e.target.value) })
            }
          />
          Not Started
        </label>

        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="order_status"
            value={1}
            checked={currentOrder.status === 1}
            onChange={(e) =>
              setOrder({ ...currentOrder, status: parseInt(e.target.value) })
            }
          />
          In Process
        </label>

        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="order_status"
            value={2}
            checked={currentOrder.status === 2}
            onChange={(e) =>
              setOrder({ ...currentOrder, status: parseInt(e.target.value) })
            }
          />
          Completed
        </label>
      </form>
    </BasePopup>
  );
};

export { OrderUpdatePopup };

import React, { useState, useEffect } from "react";
import { BaseListItem } from "../basic/BaseListItem";
import Link from "next/link";
import { OrderUpdatePopup } from "./OrderUpdatePopup";

function OrdersListItem({ order, fetchOrders }) {
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);

  const handleUpdateOpen = () => setIsUpdateOpen(true);
  const handleUpdateClose = () => {
    fetchOrders();
    setIsUpdateOpen(false);
  };

  const formattedOrderDate = new Date(order.order_date).toLocaleDateString(
    "en-CA"
  );

  const formattedGST = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
}).format(order.gst ?? 0);

  const formattedSubtotal = new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(order.subtotal);

const formattedTotal = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
}).format(order.total_amount ?? 0);

  return (
    <BaseListItem>
      <div className="flex flex-wrap max-w-[58rem] mr-[.5rem]">
        <p
  className={`text-xl font-bold mb-2 w-full ${
    order.status === 2
      ? "text-green-600"
      : order.status === 1
      ? "text-yellow-500"
      : "text-red-500"
  }`}
>
  {order.status === 2
    ? "Completed"
    : order.status === 1
    ? "In Process"
    : "Not Started"}
</p>
        <p className="text-xl font-semibold mb-2 w-1/2">
          <span className="font-normal mr-[.25rem]">Order #</span>
          {order.order_id}
        </p>
        <p className="text-xl font-semibold mb-2 w-1/2 text-end">
          <span className="font-normal mr-[.25rem]">Created On:</span>
          {formattedOrderDate}
        </p>

        <div className="w-full h-[.125rem] bg-gray-200 my-[1rem]" />

        <div className="text-xl font-semibold mb-2 w-full flex justify-between">
          <div className="flex flex-col gap-2">
         <Link href={`/manage-accounts/${order.company_id}`}>
  {order.company_name || "N/A"}
</Link>
            <a
              className="font-normal hover:underline"
              href={`tel:${order.company_phone}`}
            >
              {order.company_phone}
            </a>
            <a
              className="font-normal hover:underline"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                order.address
              )}`}
              target="_blank"
            >
              {order.address}
            </a>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <p className="font-normal text-end">
  {`${order.first_name ?? "Unknown"} ${order.last_name ?? ""}`}
</p>
            <a
              className="font-normal text-end hover:underline"
              href={`tel:${order.phone_number}`}
            >
              {order.phone_number}
            </a>
            <a
              className="font-normal text-end hover:underline"
              href={`mailto:${order.email}`}
            >
              {order.email}
            </a>
          </div>
        </div>

        <div className="w-full h-[.125rem] bg-gray-200 my-[1rem]" />

        <div className="flex w-full flex-wrap mt-[2rem]">
          <p className="text-xl font-semibold mb-2 w-full md:w-1/3">
            <span className="font-normal mr-[.25rem]">GST:</span>
            {formattedGST}
          </p>

          <p className="text-xl font-semibold mb-2 w-full md:w-1/3 md:text-center">
            <span className="font-normal mr-[.25rem]">Subtotal:</span>
            {formattedSubtotal}
          </p>

          <p className="text-xl font-semibold mb-2 w-full md:w-1/3 text-start md:text-end">
            <span className="font-normal mr-[.25rem]">Total:</span>
            {formattedTotal}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-1 min-w-[8rem] justify-end text-white">
        <Link
          href={`/manage-order-details/${order.order_id}`}
          className="bg-[#003883] justify-center text-center p-2 shadow-2xl rounded-md font-bold transition-all hover:scale-[101%]"
        >
          Order Details
        </Link>
        <button
          className="bg-[#003883] justify-center text-center p-2 shadow-2xl font-bold rounded-md transition-all hover:scale-[101%]"
          onClick={handleUpdateOpen}
        >
          Edit
        </button>
      </div>
      <OrderUpdatePopup
        order={order}
        title={`Update Order #${order.order_id}`}
        isOpen={isUpdateOpen}
        onClose={handleUpdateClose}
      />
    </BaseListItem>
  );
}

export { OrdersListItem };

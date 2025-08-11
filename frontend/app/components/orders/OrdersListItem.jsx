"use client";
import React, { useState } from "react";
import Link from "next/link";
import { BaseListItem } from "../basic/BaseListItem";
import { OrderUpdatePopup } from "./OrderUpdatePopup";

/**
 * OrdersListItem (JS version)
 *
 * - Admin pages pass `fetchOrders` (so we show Order Details + Edit buttons)
 * - Customer portal does NOT pass `fetchOrders` (so we hide admin-only actions)
 */
function OrdersListItem({
  order,
  fetchOrders,
  showPayControls = false,
  onPayNow,
}) {
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const isAdmin = typeof fetchOrders === "function";

  const handleUpdateOpen = () => setIsUpdateOpen(true);
  const handleUpdateClose = () => {
    if (isAdmin) fetchOrders();
    setIsUpdateOpen(false);
  };

  // Dates & money
  const formattedOrderDate = order?.order_date
    ? new Date(order.order_date).toLocaleDateString("en-CA")
    : "—";

  const fmt = (n) =>
    new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(
      Number(n || 0)
    );

  const gst = fmt(order?.gst);
  const subtotalCalc = Number(order?.total_amount || 0) - Number(order?.gst || 0);
  const subtotal = fmt(subtotalCalc);
  const total = fmt(order?.total_amount);

  // Status labels
  const workflowLabel =
    order?.status === 2 ? "Completed" : order?.status === 1 ? "In Process" : "Not Started";
  const workflowClass =
    order?.status === 2 ? "text-green-600" : order?.status === 1 ? "text-yellow-500" : "text-red-500";

  const payStatus = (order?.payment_status || "unpaid").toString();
  const payStatusLabel = payStatus.charAt(0).toUpperCase() + payStatus.slice(1);
  const payStatusClass =
    payStatus.toLowerCase() === "paid" ? "text-green-600" : "text-orange-500";

  // PO pending detector
  const isPendingPO =
    ((order?.payment_method || "").toLowerCase().includes("po") || !!order?.po_number) &&
    (order?.payment_status || "pending").toLowerCase() !== "paid";

  return (
    <BaseListItem>
      {/* LEFT COLUMN — flexible so it won’t get squished */}
      <div className="flex-1 basis-0 min-w-0">
        <div className="flex flex-wrap mr-2">
          {/* Workflow status */}
          <p className={`text-xl font-bold mb-2 w-full ${workflowClass}`}>{workflowLabel}</p>

          {/* Payment status */}
          <p className={`text-md font-semibold mb-4 w-full ${payStatusClass}`}>
            Payment Status: {payStatusLabel}
          </p>

          {/* Header row */}
          <p className="text-xl font-semibold mb-2 w-full sm:w-1/2">
            <span className="font-normal mr-[.25rem]">Order #</span>
            {order?.order_id}
          </p>
          <p className="text-xl font-semibold mb-2 w-full sm:w-1/2 sm:text-end">
            <span className="font-normal mr-[.25rem]">Created On:</span>
            {formattedOrderDate}
          </p>

          <div className="w-full h-[.125rem] bg-gray-200 my-[1rem]" />

          {/* Company & contact */}
          <div className="text-xl font-semibold mb-2 w-full flex justify-between gap-4">
            <div className="flex flex-col gap-2 min-w-0">
              {order?.company_id ? (
                <Link className="truncate" href={`/manage-accounts/${order.company_id}`}>
                  {order?.company_name || "N/A"}
                </Link>
              ) : (
                <span className="truncate">{order?.company_name || "—"}</span>
              )}

              {order?.company_phone ? (
                <a className="font-normal hover:underline" href={`tel:${order.company_phone}`}>
                  {order.company_phone}
                </a>
              ) : null}

              {order?.po_number ? (
                <p className="text-sm text-gray-600 w-full mb-1">
                  PO: <b>{order.po_number}</b>
                </p>
              ) : null}

              {order?.address ? (
                <a
                  className="font-normal hover:underline break-words"
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    order.address
                  )}`}
                  target="_blank"
                >
                  {order.address}
                </a>
              ) : null}
            </div>

            <div className="flex flex-col gap-2 text-sm text-right">
              <p className="font-normal">
                {`${order?.first_name ?? "Unknown"} ${order?.last_name ?? ""}`}
              </p>

              {order?.phone_number ? (
                <a className="font-normal hover:underline" href={`tel:${order.phone_number}`}>
                  {order.phone_number}
                </a>
              ) : null}

              {order?.email ? (
                <a className="font-normal hover:underline break-all" href={`mailto:${order.email}`}>
                  {order.email}
                </a>
              ) : null}
            </div>
          </div>

          <div className="w-full h-[.125rem] bg-gray-200 my-[1rem]" />

          {/* Totals — tabular digits, no-wrap for tidy columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full mt-6">
            <div className="rounded-md border border-gray-200 p-3">
              <div className="text-sm text-gray-500">GST</div>
              <div className="mt-1 text-base tabular-nums whitespace-nowrap">{gst}</div>
            </div>

            <div className="rounded-md border border-gray-200 p-3">
              <div className="text-sm text-gray-500">Subtotal</div>
              <div className="mt-1 text-base tabular-nums whitespace-nowrap">{subtotal}</div>
            </div>

            <div className="rounded-md border border-gray-200 p-3">
              <div className="text-sm text-gray-500">Total</div>
              <div className="mt-1 text-base font-semibold tabular-nums whitespace-nowrap">{total}</div>
            </div>
          </div>
        </div>

        {/* Pay controls for Customer Portal (PO + pending only) */}
        {showPayControls && isPendingPO && (
          <div className="w-full mt-4 p-3 rounded-xl border border-amber-200 bg-amber-50">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="text-sm text-amber-900">
                <div className="font-semibold mb-1">Pay by Electronic Transfer</div>
                <div>
                  Send the total to <b>payments@yourcompany.com</b>
                </div>
                <div>
                  Reference: <b>Order #{order?.order_id}</b>
                </div>
                <div className="text-xs text-amber-900/80 mt-1">
                  We’ll email a receipt once payment is processed.
                </div>
              </div>

              {typeof onPayNow === "function" && (
                <button
                  className="inline-flex items-center justify-center bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg font-semibold"
                  onClick={() => onPayNow(order?.order_id)}
                >
                  Pay by Card
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN — admin-only (Order Details + Edit) */}
      {isAdmin && (
        <div className="flex flex-col gap-1 flex-none w-40 sm:w-48 md:w-56 justify-end text-white">
          <Link
            href={`/manage-order-details/${order?.order_id}`}
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
      )}

      {/* Edit modal (admin) */}
      <OrderUpdatePopup
        order={order}
        title={`Update Order #${order?.order_id}`}
        isOpen={isUpdateOpen}
        onClose={handleUpdateClose}
      />
    </BaseListItem>
  );
}

export { OrdersListItem };
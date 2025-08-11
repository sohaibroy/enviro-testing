import React, { useState } from "react";
import BasePopup from "../basic/BasePopup";
import { isTokenExpired } from "@/utils/session";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const OrderUpdatePopup = ({ order, isOpen, onClose, title }) => {
  if (!isOpen) return null;

  const [currentOrder, setOrder] = useState({
    status: order?.status ?? 0,
    po_number: order?.po_number ?? "",
    payment_status: (order?.payment_status ?? "pending").toLowerCase(), // "pending" | "paid"
    payment_method: order?.payment_method ?? "EFT", // for paid case
    payment_reference: order?.payment_reference ?? "", // optional reference/confirmation
  });

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const updateOrder = async () => {
    setErr("");

    if (isTokenExpired()) {
      window.location.href = "/admin-login";
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${baseUrl}/api/order/update/${order.order_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          status: currentOrder.status,
          po_number: currentOrder.po_number || null,
          payment_status: currentOrder.payment_status, // "pending" or "paid"
          // Include method/reference only if marking paid
          ...(currentOrder.payment_status === "paid"
            ? {
                payment_method: currentOrder.payment_method || "EFT",
                payment_reference:
                  currentOrder.payment_reference?.trim() || null,
              }
            : {}),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          data?.error ||
            (data?.errors ? JSON.stringify(data.errors) : `HTTP ${res.status}`)
        );
      }

      // success
      onClose();
    } catch (e) {
      setErr(e.message || "Update failed");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return {
    /* BasePopup expects: isOpen, onClose, title, activityText, onActivityClicked */
  } && (
    <BasePopup
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      activityText={loading ? "Updating..." : "Update"}
      onActivityClicked={updateOrder}
    >
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          updateOrder();
        }}
      >
        {/* Workflow status */}
        <div>
          <label className="text-lg font-semibold block mb-2">Order Status</label>

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
        </div>

        {/* PO number */}
        <div>
          <label className="text-lg font-semibold block mb-2">PO Number</label>
          <input
            type="text"
            value={currentOrder.po_number}
            onChange={(e) =>
              setOrder({ ...currentOrder, po_number: e.target.value })
            }
            placeholder="Enter PO number (optional at first)"
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        {/* Payment status */}
        <div>
          <label className="text-lg font-semibold block mb-2">
            Payment Status
          </label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="payment_status"
                value="pending"
                checked={currentOrder.payment_status === "pending"}
                onChange={(e) =>
                  setOrder({
                    ...currentOrder,
                    payment_status: e.target.value,
                  })
                }
              />
              Pending
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="payment_status"
                value="paid"
                checked={currentOrder.payment_status === "paid"}
                onChange={(e) =>
                  setOrder({
                    ...currentOrder,
                    payment_status: e.target.value,
                    // default to EFT when toggling to paid
                    payment_method: currentOrder.payment_method || "EFT",
                  })
                }
              />
              Paid
            </label>
          </div>
        </div>

        {/* Only show method/reference when marking as PAID */}
        {currentOrder.payment_status === "paid" && (
          <>
            <div>
              <label className="text-lg font-semibold block mb-2">
                Payment Method
              </label>
              <select
                value={currentOrder.payment_method || "EFT"}
                onChange={(e) =>
                  setOrder({ ...currentOrder, payment_method: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="EFT">EFT</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Wire">Wire</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>

            <div>
              <label className="text-lg font-semibold block mb-2">
                Payment Reference (optional)
              </label>
              <input
                type="text"
                placeholder="e.g., EFT confirmation # / ref"
                value={currentOrder.payment_reference}
                onChange={(e) =>
                  setOrder({
                    ...currentOrder,
                    payment_reference: e.target.value,
                  })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                We’ll store this on the order (helpful for audit trail).
              </p>
            </div>
          </>
        )}

        {err && <p className="text-red-600 text-sm">{err}</p>}
      </form>
    </BasePopup>
  );
};

export { OrderUpdatePopup };

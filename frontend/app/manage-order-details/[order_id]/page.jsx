"use client";

import React, { useState, useEffect } from "react";
import { CRUDHeader } from "@/app/components/navigation/CRUDHeader";
import { OrderDetailsListItem } from "@/app/components/order-details/OrderDetailsListItem";
import { LoadingIcon } from "@/app/components/loading/LoadingIcon";
import { ErrorMessage } from "@/app/components/basic/ErrorMessage";
import { GeneralMessage } from "@/app/components/basic/GeneralMessage";
import { isTokenExpired } from "@/utils/session";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

function OrderDetailsPage({ params }) {
  const [order, setOrder] = useState(null);
  const [analytes, setAnalytes] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (isTokenExpired()) {
        window.location.href = "/admin-login";
        return;
      }

      try {
        const res = await fetch(`${baseUrl}/api/orders/full/${params.order_id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`);
        }

        const data = await res.json();
        setOrder(data);
        setAnalytes(data.details || []);
        setEquipment(data.equipment_items || []);
      } catch (err) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.order_id]);

  return (
    <div>
      <CRUDHeader
        title={`View Order Details For Order #${params.order_id}`}
        href="/manage-orders/"
      />
      <section className="w-full max-w-[70rem] mx-auto">
        {loading ? (
          <LoadingIcon />
        ) : error ? (
          <ErrorMessage error={error} />
        ) : (
          <>
            {analytes.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-2">Analyte Details</h2>
                <ul>
                  {analytes.map((detail, index) => (
                    <OrderDetailsListItem
                      key={`analyte-${index}`}
                      orderDetail={detail}
                    />
                  ))}
                </ul>
              </div>
            )}

            {equipment.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-2">Equipment Rentals</h2>
                <ul>
                  {equipment.map((item, index) => (
                    <li key={`equipment-${index}`} className="p-4 border rounded-md mb-4 shadow-sm bg-white">
                      <p><strong>Equipment:</strong> {item.equipment_name}</p>
                      <p><strong>Category:</strong> {item.category}</p>
                      <p><strong>Start Date:</strong> {item.start_date}</p>
                      <p><strong>Return Date:</strong> {item.return_date}</p>
                      <p><strong>Quantity:</strong> {item.quantity}</p>
                      <p><strong>Daily Cost:</strong> ${item.daily_cost}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {analytes.length === 0 && equipment.length === 0 && (
              <GeneralMessage message="No Order Details Found" />
            )}
          </>
        )}
      </section>
    </div>
  );
}

export default OrderDetailsPage;
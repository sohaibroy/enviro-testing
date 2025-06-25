"use client";

import React, { useState, useEffect } from "react";
import { CRUDHeader } from "@/app/components/navigation/CRUDHeader";
import { OrderDetailsListItem } from "@/app/components/order-details/OrderDetailsListItem";
import { LoadingIcon } from "@/app/components/loading/LoadingIcon";
import { ErrorMessage } from "@/app/components/basic/ErrorMessage";
import { GeneralMessage } from "@/app/components/basic/GeneralMessage";
import { isTokenExpired } from "@/utils/session";

function OrderDetailsPage({ params }) {
  const [order_details, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrderDetails = async () => {
    try {
      if (isTokenExpired()) {
        window.location.href = "/admin-login";
        return;
      }

      const response = await fetch(
        `http://localhost:80/api/orderdetails/${params.order_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        }
      );
      const data = await response.json();
      setOrderDetails(data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.order_id) {
      fetchOrderDetails();
    }
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
        ) : order_details.length > 0 ? (
          <ul>
            {order_details.map((orderDetailData, index) => (
              <OrderDetailsListItem
                key={`${orderDetailData.order_id}-${index}`}
                orderDetail={orderDetailData}
              />
            ))}
          </ul>
        ) : (
          <GeneralMessage message={`No Order Details Found`} />
        )}
      </section>
    </div>
  );
}

export default OrderDetailsPage;

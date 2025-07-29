"use client";

import React, { useState, useEffect } from "react";
import { AdminSearch } from "../components/adminsearch/AdminSearch";
import { CRUDHeader } from "../components/navigation/CRUDHeader";
import { OrdersListItem } from "../components/orders/OrdersListItem";
import { LoadingIcon } from "../components/loading/LoadingIcon";
import { ErrorMessage } from "../components/basic/ErrorMessage";
import { GeneralMessage } from "../components/basic/GeneralMessage";
import { isTokenExpired } from "@/utils/session";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchOrders = async () => {
    try {
      if (isTokenExpired()) {
        window.location.href = "/admin-login";
        return;
      }

      if (searchTerm.trim() !== "") {
        await fetchSearchResults();
      } else {
        //const response = await fetch("http://localhost:80/api/orders", {
        const response = await fetch(`${baseUrl}/api/orders`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        });
        const data = await response.json();
        setOrders(data);
        setLoading(false);
      }
    } catch (error) {
      const errorMessage = error.toString();
      setError(errorMessage);
      setLoading(false);
    }
  };

  const fetchSearchResults = async () => {
    try {
      if (isTokenExpired()) {
        window.location.href = "/admin-login";
        return;
      }

      if (isTokenExpired()) {
        window.location.href = "/admin-login";
        return;
      }

      const response = await fetch(
        //`http://localhost:80/api/orders/searchtool/${encodeURIComponent(
        `${baseUrl}/api/orders/searchtool/${encodeURIComponent(
          searchTerm
        )}`
      );
      const data = await response.json();
      setOrders(Array.isArray(data.message) ? data.message : []);
      setOrders(data.message);
      setLoading(false);
    } catch (error) {
      const errorMessage = error.toString();
      setError(errorMessage);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="mb-[5rem] flex flex-col gap-4">
      <CRUDHeader title="Manage Orders" href="./admin-selection" />
      <section className="w-full max-w-[70rem] mx-auto">
        <div className="flex gap-[.25rem]">
          <AdminSearch
            onSearch={fetchOrders}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>

<div className="my-4 flex items-center gap-4">
  <label htmlFor="status-filter" className="font-semibold">
    Filter by Status:
  </label>
  <select
    id="status-filter"
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className="border border-gray-300 rounded-md px-2 py-1"
  >
    <option value="">All</option>
    <option value="0">Not Started</option>
    <option value="1">In Process</option>
    <option value="2">Completed</option>
  </select>
</div>

        <ul>
          {loading ? (
            <LoadingIcon />
          ) : error ? (
            <ErrorMessage error={error} />
          ) : Array.isArray(orders) && orders.length > 0 ? (
            <ul>
             {orders
  .filter((order) =>
    statusFilter === "" ? true : order.status === parseInt(statusFilter)
  )
  .map((orderData) => (
    <OrdersListItem
      key={orderData.order_id}
      order={orderData}
      fetchOrders={fetchOrders}
    />
))}
            </ul>
          ) : (
            <GeneralMessage message={`No Orders Found`} />
          )}
        </ul>
      </section>
    </div>
  );
}

export default ManageOrders;

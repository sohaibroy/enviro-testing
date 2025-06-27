"use client";
import React, { useState, useEffect } from "react";
import { CRUDHeader } from "../components/navigation/CRUDHeader";
import { TransactionsListItem } from "../components/transactions/TransactionsListItem";
import { LoadingIcon } from "../components/loading/LoadingIcon";
import { ErrorMessage } from "../components/basic/ErrorMessage";
import { GeneralMessage } from "../components/basic/GeneralMessage";
import { isTokenExpired } from "@/utils/session";
import { AdminSearch } from "../components/adminsearch/AdminSearch";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;


function ManageTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchTransactions = async () => {
    try {
      if (isTokenExpired()) {
        window.location.href = "/admin-login";
        return;
      }

      if (searchTerm.trim() !== "") {
        await fetchSearchResults();
      } else {
        //const response = await fetch("http://localhost:80/api/transactions", {
        const response = await fetch(`${baseUrl}/api/transactions`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        });
        const data = await response.json();
        setTransactions(data);
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

      //const response = await fetch(`http://localhost:80/api/transactions/search/${encodeURIComponent(searchTerm)}`, {
      const response = await fetch(`${baseUrl}/api/transactions/search/${encodeURIComponent(searchTerm)}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      });
      const data = await response.json();
      setTransactions(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      const errorMessage = error.toString();
      setError(errorMessage);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="mb-[5rem] flex flex-col gap-4">
      <CRUDHeader title="Manage Transactions" href="./admin-selection" />
      <section className="w-full max-w-[70rem] mx-auto">
        <div className="flex gap-[.25rem]">
          <AdminSearch
            onSearch={fetchTransactions}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>
        <ul>
          {loading ? (
            <LoadingIcon />
          ) : error ? (
            <ErrorMessage error={error} />
          ) : Array.isArray(transactions) && transactions.length > 0 ? (
            <ul>
              {transactions.map((transactionData) => (
                <TransactionsListItem
                  key={transactionData.transaction_id}
                  transaction={transactionData}
                  fetchTransactions={fetchTransactions}
                />
              ))}
            </ul>
          ) : (
            <GeneralMessage message={`No Transactions Found`} />
          )}
        </ul>
      </section>
    </div>
  );
}

export default ManageTransactions;

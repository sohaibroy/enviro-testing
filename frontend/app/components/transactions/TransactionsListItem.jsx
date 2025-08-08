import React, { useState } from "react";
import { BaseListItem } from "../basic/BaseListItem";
import Link from "next/link";
import { TransactionUpdatePopup } from "./TransactionUpdatePopup";

function TransactionsListItem({ transaction, fetchTransactions }) {
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);

  const handleUpdateOpen = () => setIsUpdateOpen(true);
  const handleUpdateClose = () => {
    fetchTransactions?.();
    setIsUpdateOpen(false);
  };

  // Auto-inactive if order is completed (status = 2)
  const isActive = transaction?.order_status === 2 ? false : !!transaction?.is_active;

  const formattedTransactionDate = transaction?.transaction_date
    ? new Date(transaction.transaction_date).toLocaleDateString("en-CA")
    : "—";

  const formatAsCurrency = new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  });
  const toMoney = (v) => formatAsCurrency.format(Number(v ?? 0));

  const formattedTransactionGST = toMoney(transaction?.gst);
  const formattedTransactionTotal = toMoney(transaction?.total_amount);
  const formattedTransactionSubtotal = toMoney(transaction?.subtotal);

  return (
    <BaseListItem>
      <div className="flex flex-wrap max-w-[58rem] mr-[.5rem]">
        <p
          className={`text-xl font-bold mb-2 w-full ${
            isActive ? "text-green-500" : "text-red-500"
          }`}
        >
          {isActive ? "Active" : "Inactive"}
        </p>

        <p className="text-xl font-semibold mb-2 w-1/2">
          <span className="font-normal mr-[.25rem]">Transaction #</span>
          {transaction?.transaction_id ?? "—"}
        </p>
        <p className="text-xl font-semibold mb-2 w-1/2 text-end">
          <span className="font-normal mr-[.25rem]">Created On:</span>
          {formattedTransactionDate}
        </p>

        <div className="w-full h-[.125rem] bg-gray-200 my-[1rem]" />

        <div className="text-xl font-semibold mb-2 w-full flex justify-between">
          <div className="flex flex-col gap-2">
            <Link
              className="hover:underline"
              href={`/manage-accounts/${transaction?.company_id ?? ""}`}
            >
              {transaction?.company_name ?? "—"}
            </Link>

            {transaction?.company_phone ? (
              <a
                className="font-normal hover:underline"
                href={`tel:${transaction.company_phone}`}
              >
                {transaction.company_phone}
              </a>
            ) : (
              <span className="font-normal text-gray-500">No phone</span>
            )}

            {transaction?.address ? (
              <a
                className="font-normal hover:underline"
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  transaction.address
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {transaction.address}
              </a>
            ) : (
              <span className="font-normal text-gray-500">No address</span>
            )}
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <p className="font-normal text-end">
              {`${transaction?.first_name ?? ""} ${
                transaction?.last_name ?? ""
              }`.trim() || "—"}
            </p>

            {transaction?.phone_number ? (
              <a
                className="font-normal text-end hover:underline"
                href={`tel:${transaction.phone_number}`}
              >
                {transaction.phone_number}
              </a>
            ) : (
              <span className="font-normal text-end text-gray-500">No phone</span>
            )}

            {transaction?.email ? (
              <a
                className="font-normal text-end hover:underline"
                href={`mailto:${transaction.email}`}
              >
                {transaction.email}
              </a>
            ) : (
              <span className="font-normal text-end text-gray-500">No email</span>
            )}
          </div>
        </div>

        <div className="w-full h-[.125rem] bg-gray-200 my-[1rem]" />

        <div className="flex w-full flex-wrap mt-[2rem]">
          <p className="text-xl font-semibold mb-2 w-full md:w-1/3">
            <span className="font-normal mr-[.25rem]">GST:</span>
            {formattedTransactionGST}
          </p>

          <p className="text-xl font-semibold mb-2 w-full md:w-1/3 md:text-center">
            <span className="font-normal mr-[.25rem]">Subtotal:</span>
            {formattedTransactionSubtotal}
          </p>

          <p className="text-xl font-semibold mb-2 w-full md:w-1/3 md:text-center">
            <span className="font-normal mr-[.25rem]">Total:</span>
            {formattedTransactionTotal}
          </p>
        </div>
      </div>

      <TransactionUpdatePopup
        transaction={transaction}
        title={`Update Transaction #${transaction?.transaction_id ?? ""}`}
        isOpen={isUpdateOpen}
        onClose={handleUpdateClose}
      />
    </BaseListItem>
  );
}

export { TransactionsListItem };

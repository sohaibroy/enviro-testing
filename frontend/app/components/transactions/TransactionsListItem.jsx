import React, { useState, useEffect } from "react";
import { BaseListItem } from "../basic/BaseListItem";
import Link from "next/link";
import { TransactionUpdatePopup } from "./TransactionUpdatePopup";

function TransactionsListItem({ transaction, fetchTransactions}) {
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);

  const handleUpdateOpen = () => setIsUpdateOpen(true);
  const handleUpdateClose = () => {
    fetchTransactions();
    setIsUpdateOpen(false);
  };

  const formattedTransactionDate = new Date(transaction.transaction_date).toLocaleDateString("en-CA");

  const formatAsCurrency = new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  });

  const formattedTransactionGST = formatAsCurrency.format(transaction.gst);
  const formattedTransactionTotal = formatAsCurrency.format(transaction.total_amount);
  const formattedTransactionSubtotal = formatAsCurrency.format(transaction.subtotal);

  return (
    <BaseListItem>
      <div className="flex flex-wrap max-w-[58rem] mr-[.5rem]">
        <p className={`text-xl font-bold mb-2 w-full ${
          transaction.is_active ? "text-green-500" : "text-red-500"
        }`}>
          {transaction.is_active ? "Active" : "Inactive"}
        </p>
        <p className="text-xl font-semibold mb-2 w-1/2">
          <span className="font-normal mr-[.25rem]">Transaction #</span>
          {transaction.transaction_id}
        </p>
        <p className="text-xl font-semibold mb-2 w-1/2 text-end">
          <span className="font-normal mr-[.25rem]">Created On:</span>
          {formattedTransactionDate}
        </p>

        <div className="w-full h-[.125rem] bg-gray-200 my-[1rem]" />

        <div className="text-xl font-semibold mb-2 w-full flex justify-between">
          <div className="flex flex-col gap-2">
            <Link className="hover:underline" href={`manage-accounts/${transaction.company_id}`}>
              {`${transaction.company_name}`}
            </Link>
            <a className="font-normal hover:underline" href={`tel:${transaction.company_phone}`}>
              {transaction.company_phone}
            </a>
            <a className="font-normal hover:underline" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(transaction.address)}`}
              target="_blank">
              {transaction.address}
            </a>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <p className="font-normal text-end">{`${transaction.first_name} ${transaction.last_name}`}</p>
            <a className="font-normal text-end hover:underline" href={`tel:${transaction.phone_number}`}>
              {transaction.phone_number}
            </a>
          <a className="font-normal text-end hover:underline" href={`mailto:${transaction.email}`}>
            {transaction.email}
          </a>
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
      <div className="flex flex-col gap-1 min-w-[8rem] justify-end text-white">
        <button className="bg-[#003883] justify-center text-center p-2 shadow=2xl font-bold rounded-md transition-all hover:scale-[101%]" onClick={handleUpdateOpen}>
          Edit
        </button>
      </div>
      <TransactionUpdatePopup
        transaction={transaction}
        title={`Update Transaction #${transaction.transaction_id}`}
        isOpen={isUpdateOpen}
        onClose={handleUpdateClose}
      />
    </BaseListItem>
  )
}

export { TransactionsListItem };

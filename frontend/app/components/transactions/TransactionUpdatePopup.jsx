import React, { useState } from "react";
import BasePopup from "../basic/BasePopup";
import { RadioBoolInput } from "../basic/RadioBoolInput";
import { isTokenExpired } from "@/utils/session";
import { SP } from "next/dist/shared/lib/utils";

const TransactionUpdatePopup = ({ transaction, isOpen, onClose, title }) => {
  if (!isOpen) return null;

  const [currentTransaction, setTransaction] = useState({
    is_active: transaction.is_active !== null ? transaction.is_active : 1,
  });

  const updateTransaction = () => {
    if (isTokenExpired()) {
      window.location.href = "/admin-login";
      return;
    }

    fetch(`http://localhost:80/api/transactions/update/${transaction.transaction_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({
        is_active: currentTransaction.is_active,
      }),
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    }).then((data) => {
      console.log("Success:", data);
      onClose();
    }).catch((error) => {
      console.error("Error:", error);
    });
  };

  return (
    <BasePopup
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      activityText="Update"
      onActivityClicked={updateTransaction}>

      <form className="flex flex-wrap justify-between gap-y-4 min-w-[20rem]">
        <RadioBoolInput
          title="Status"
          value={currentTransaction.is_active}
          onChange={(selectedValue) => {
            setTransaction({ ...currentTransaction, is_active: selectedValue });
          }}
        />
      </form>
    </BasePopup>
  );
};

export { TransactionUpdatePopup };

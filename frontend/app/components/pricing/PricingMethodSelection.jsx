import { ManagePriceOverrides } from "@/app/components/pricing/ManagePriceOverrides";
import React, { useState } from "react";

function PricingMethodSelection({ company, method }) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleCreateOpen = () => setIsCreateOpen(true);
  const handleCreateClose = () => setIsCreateOpen(false);

  return (
    <div>
      <button
        className="flex justify-between bg-gray-50 w-full border-b-2 p-[.75rem] transition-all duration-300 hover:bg-gray-100 hover:py-[1rem] drop-shadow-xl"
        onClick={handleCreateOpen}
      >
        <p className="text-start">{method.method_name}</p>
        <p className="text-end">({method.media})</p>
      </button>
      <ManagePriceOverrides
        title={`Manage Price Overrides for ${method.method_name}`}
        isOpen={isCreateOpen}
        onClose={handleCreateClose}
        method={method}
        company={company}
      />
    </div>
  );
}

export { PricingMethodSelection };

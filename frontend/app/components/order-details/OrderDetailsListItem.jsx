import React from "react";
import { BaseListItem } from "../basic/BaseListItem";

function OrderDetailsListItem({ orderDetail }) {
  const formattedPrice = new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(orderDetail.price);

  return (
    <BaseListItem>
      <div className="flex flex-wrap justify-between w-full">
        <section className="flex flex-col w-full md:w-1/2 lg:w-1/3 mb-4">
          <p className="text-lg font-semibold mb-2">
            <span className="text-gray-600 mr-2">Analyte:</span>
            {orderDetail.analyte_name}
          </p>
          <p className="text-lg font-semibold mb-2">
            <span className="text-gray-600 mr-2">Method:</span>
            {orderDetail.method_name}
          </p>
        </section>
        <section className="flex flex-col w-full md:w-1/2 lg:w-1/3 mb-4">
          <p className="text-lg font-semibold mb-2">
            <span className="text-gray-600 mr-2">Quantity:</span>
            {orderDetail.required_quantity}
          </p>
          <p className="text-lg font-semibold mb-2">
            <span className="text-gray-600 mr-2">Pump Quantity:</span>
            {orderDetail.required_pumps ?? 0}
          </p>
          <p className="text-lg font-semibold">
            <span className="text-gray-600 mr-2">Media Quantity:</span>
            {orderDetail.required_media ?? 'N/A'}
          </p>
        </section>
        <section className="flex flex-col w-full md:w-1/2 lg:w-1/3 mb-4">
          <p className="text-lg font-semibold mb-2">
            <span className="text-gray-600 mr-2">Price:</span>
            {formattedPrice}
          </p>
          <p className="text-lg font-semibold mb-2">
            <span className="text-gray-600 mr-2">Turn Around Time:</span>
            {orderDetail.turnaround_time}
          </p>
          <p className="text-lg font-semibold">
            <span className="text-gray-600 mr-2">Comments:</span>
            {orderDetail.customer_comment ?? '—'}
          </p>
        </section>
      </div>
    </BaseListItem>
  );
}

export { OrderDetailsListItem };


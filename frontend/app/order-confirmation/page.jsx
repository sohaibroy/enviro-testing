export const dynamic = "force-dynamic";
import { Suspense } from 'react';
import OrderConfirmationClient from './OrderConfirmationClient';

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>
      <OrderConfirmationClient />
    </Suspense>
  );
}
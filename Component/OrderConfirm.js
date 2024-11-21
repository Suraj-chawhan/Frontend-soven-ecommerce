"use client";

import { useRouter } from "next/navigation";

export default function OrderConfirmationPopup({ showPopup }) {
  const router = useRouter();

  return showPopup ? (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 text-center relative">
        <h2 className="text-2xl font-semibold mb-4 text-green-600">
          Order Confirmed!
        </h2>
        <p className="text-gray-600 mb-6">
          Your order has been placed successfully.
        </p>
        <button
          onClick={() => router.push("/my-orders")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          View My Orders
        </button>
      </div>
    </div>
  ) : null;
}

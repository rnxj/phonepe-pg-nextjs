'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PaymentResult() {
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      const orderId = searchParams.get('orderId') || searchParams.get('id');

      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/phonepe/status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId: orderId,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setOrderDetails(data);
        } else {
          console.error('Error fetching order details:', data.error);
        }
      } catch (error) {
        console.error('Network error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkPaymentStatus();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying payment status...</p>
        </div>
      </div>
    );
  }

  const orderId = searchParams.get('orderId') || searchParams.get('id');
  const isSuccess = orderDetails && orderDetails.state === 'COMPLETED';
  const isFailed =
    orderDetails && (orderDetails.state === 'FAILED' || orderDetails.errorCode);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="text-center">
          {isSuccess ? (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Payment Successful!
              </h1>
              <p className="text-gray-600 mb-6">
                Your payment has been processed successfully.
              </p>
            </>
          ) : isFailed ? (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Payment Failed
              </h1>
              <p className="text-gray-600 mb-6">
                There was an issue processing your payment.
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Payment Status Unknown
              </h1>
              <p className="text-gray-600 mb-6">
                Unable to verify payment status at this time.
              </p>
            </>
          )}

          {orderDetails && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-left">Order Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-left">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-medium">{orderDetails.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Merchant Order ID:</span>
                    <span className="font-medium">
                      {orderDetails.merchantOrderId || orderId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">
                      ₹{(orderDetails.amount / 100).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span
                      className={`font-medium ${
                        orderDetails.state === 'COMPLETED'
                          ? 'text-green-600'
                          : orderDetails.state === 'FAILED'
                            ? 'text-red-600'
                            : 'text-yellow-600'
                      }`}
                    >
                      {orderDetails.state}
                    </span>
                  </div>
                  {orderDetails.errorCode && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Error Code:</span>
                      <span className="font-medium text-red-600">
                        {orderDetails.errorCode}
                      </span>
                    </div>
                  )}
                  {orderDetails.detailedErrorCode && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Detailed Error:</span>
                      <span className="font-medium text-red-600">
                        {orderDetails.detailedErrorCode}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {orderId && !orderDetails && (
            <Card className="mb-6">
              <CardContent className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-yellow-800 text-sm">Order ID: {orderId}</p>
                <p className="text-yellow-600 text-sm mt-1">
                  Unable to fetch order details at this time.
                </p>
              </CardContent>
            </Card>
          )}

          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/">Back to Home</Link>
            </Button>

            {isFailed && (
              <Button
                onClick={() => window.location.reload()}
                variant="secondary"
                className="w-full"
              >
                Check Status Again
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

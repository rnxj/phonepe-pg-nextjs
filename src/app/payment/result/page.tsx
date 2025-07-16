'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

interface PaymentOrderDetails {
  orderId: string;
  merchantOrderId?: string;
  amount: number;
  state: 'COMPLETED' | 'FAILED' | 'PENDING';
  errorCode?: string;
  detailedErrorCode?: string;
}

function PaymentResultContent() {
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<PaymentOrderDetails | null>(
    null
  );
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
      <div className="min-h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">
            Verifying payment status...
          </p>
        </div>
      </div>
    );
  }

  const orderId = searchParams.get('orderId') || searchParams.get('id');
  const isSuccess = orderDetails && orderDetails.state === 'COMPLETED';
  const isFailed =
    orderDetails && (orderDetails.state === 'FAILED' || orderDetails.errorCode);

  return (
    <div className="min-h-full flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="text-center">
          {isSuccess ? (
            <>
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Payment Successful!
              </h1>
              <p className="text-muted-foreground mb-6">
                Your payment has been processed successfully.
              </p>
            </>
          ) : isFailed ? (
            <>
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-destructive" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Payment Failed
              </h1>
              <p className="text-muted-foreground mb-6">
                There was an issue processing your payment.
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Payment Status Unknown
              </h1>
              <p className="text-muted-foreground mb-6">
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
                    <span className="text-muted-foreground">Order ID:</span>
                    <span className="font-medium">{orderDetails.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Merchant Order ID:
                    </span>
                    <span className="font-medium">
                      {orderDetails.merchantOrderId || orderId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-medium">
                      ₹{(orderDetails.amount / 100).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span
                      className={`font-medium ${
                        orderDetails.state === 'COMPLETED'
                          ? 'text-green-600 dark:text-green-400'
                          : orderDetails.state === 'FAILED'
                            ? 'text-destructive'
                            : 'text-yellow-600 dark:text-yellow-400'
                      }`}
                    >
                      {orderDetails.state}
                    </span>
                  </div>
                  {orderDetails.errorCode && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Error Code:</span>
                      <span className="font-medium text-destructive">
                        {orderDetails.errorCode}
                      </span>
                    </div>
                  )}
                  {orderDetails.detailedErrorCode && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Detailed Error:
                      </span>
                      <span className="font-medium text-destructive">
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
              <CardContent className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/20">
                <p className="text-yellow-600 dark:text-yellow-400 text-sm">
                  Order ID: {orderId}
                </p>
                <p className="text-yellow-600 dark:text-yellow-400 text-sm mt-1">
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

export default function PaymentResult() {
  return (
    <Suspense
      fallback={
        <div className="min-h-full flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </div>
      }
    >
      <PaymentResultContent />
    </Suspense>
  );
}

'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';

export default function Home() {
  const [amount, setAmount] = useState('');
  const [merchantOrderId, setMerchantOrderId] = useState('');
  const [statusOrderId, setStatusOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Generate unique order ID if not provided
      const orderId = merchantOrderId || `ORDER_${Date.now()}`;

      const response = await fetch('/api/phonepe/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          merchantOrderId: orderId,
          message: `Payment for order ${orderId}`,
          redirectUrl: `${window.location.origin}/payment/result`,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Payment initiated successfully! Redirecting...');
        // Redirect to PhonePe payment page
        window.location.href = data.redirectUrl;
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage('Network error occurred');
      console.error('Payment initiation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = async () => {
    if (!statusOrderId) {
      setMessage('Please enter a merchant order ID to check status');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/phonepe/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: statusOrderId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Payment Status: ${data.state}`);
        console.log('Payment status:', data);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage('Network error occurred');
      console.error('Status check error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            PhonePe Payment Gateway
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePayment} className="space-y-4">
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Amount (₹)
              </label>
              <Input
                type="number"
                id="amount"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="Enter amount"
                required
                min="1"
                step="0.01"
              />
            </div>

            <div>
              <label
                htmlFor="merchantOrderId"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Order ID (Optional)
              </label>
              <Input
                type="text"
                id="merchantOrderId"
                value={merchantOrderId}
                onChange={e => setMerchantOrderId(e.target.value)}
                placeholder="Leave empty for auto-generated ID"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Processing...' : 'Pay with PhonePe'}
            </Button>
          </form>

          <div className="my-6">
            <Separator />
          </div>

          <form
            onSubmit={e => {
              e.preventDefault();
              checkPaymentStatus();
            }}
            className="mt-4"
          >
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="statusOrderId"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Order ID
                </label>
                <Input
                  type="text"
                  id="statusOrderId"
                  value={statusOrderId}
                  onChange={e => setStatusOrderId(e.target.value)}
                  placeholder="Enter order ID to check"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                variant="secondary"
                className="w-full"
              >
                {loading ? 'Checking...' : 'Check Payment Status'}
              </Button>
            </div>
          </form>

          {message && (
            <div
              className={`mt-4 p-3 rounded-md ${
                message.includes('Error') || message.includes('error')
                  ? 'bg-destructive/10 text-destructive border border-destructive/20'
                  : 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20'
              }`}
            >
              {message}
            </div>
          )}

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-sm">
                Required Environment Variables:
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• PHONEPE_CLIENT_ID</li>
                <li>• PHONEPE_CLIENT_SECRET</li>
                <li>• PHONEPE_ENVIRONMENT (SANDBOX/PRODUCTION)</li>
                <li>• PHONEPE_REDIRECT_URL</li>
              </ul>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}

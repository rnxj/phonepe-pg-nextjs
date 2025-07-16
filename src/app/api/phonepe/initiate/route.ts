import { NextRequest, NextResponse } from 'next/server';
import {
  Env,
  PgCheckoutPaymentFlow,
  StandardCheckoutClient,
  StandardCheckoutPayRequest,
} from 'pg-sdk-node';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, merchantOrderId, redirectUrl, message } = body;

    // Validate required fields
    if (!amount || !merchantOrderId) {
      return NextResponse.json(
        {
          error: 'Missing required fields: amount, merchantOrderId',
        },
        { status: 400 }
      );
    }

    // Initialize PhonePe Standard Checkout Client
    const client = StandardCheckoutClient.getInstance(
      process.env.PHONEPE_CLIENT_ID!,
      process.env.PHONEPE_CLIENT_SECRET!,
      2, // Client version
      process.env.PHONEPE_ENVIRONMENT === 'PRODUCTION'
        ? Env.PRODUCTION
        : Env.SANDBOX,
      true // Should publish events
    );

    // Create redirect URL with order ID parameter
    const baseRedirectUrl = redirectUrl || process.env.PHONEPE_REDIRECT_URL!;
    const redirectUrlWithOrderId = `${baseRedirectUrl}?orderId=${merchantOrderId}`;

    // Create payment flow with redirect URL
    const paymentFlow = PgCheckoutPaymentFlow.builder()
      .message(message || 'Payment for order')
      .redirectUrl(redirectUrlWithOrderId)
      .build();

    // Create payment request using builder and set payment flow
    const paymentRequest = StandardCheckoutPayRequest.builder()
      .merchantOrderId(merchantOrderId)
      .amount(amount * 100) // Convert to paisa
      .message(message || 'Payment for order')
      .redirectUrl(redirectUrlWithOrderId)
      .build();

    // Set the payment flow manually (since builder doesn't have paymentFlow method)
    paymentRequest.paymentFlow = paymentFlow;

    // Initiate payment
    const response = await client.pay(paymentRequest);

    return NextResponse.json({
      success: true,
      orderId: response.orderId,
      state: response.state,
      expireAt: response.expireAt,
      redirectUrl: response.redirectUrl,
    });
  } catch (error) {
    console.error('Payment initiation error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

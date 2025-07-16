import { NextRequest, NextResponse } from 'next/server';
import { Env, StandardCheckoutClient } from 'pg-sdk-node';

export async function POST(request: NextRequest) {
  try {
    // Get authorization header and request body
    const authorization = request.headers.get('authorization');
    const responseBody = await request.text();

    // For PhonePe webhook, you might receive username/password via headers or config
    // This is typically configured in your PhonePe dashboard
    const username = process.env.PHONEPE_CALLBACK_USERNAME || 'default';
    const password = process.env.PHONEPE_CALLBACK_PASSWORD || 'default';

    // Validate required fields
    if (!authorization || !responseBody) {
      return NextResponse.json(
        { error: 'Missing authorization header or response body' },
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

    // Validate callback response
    const callbackResponse = client.validateCallback(
      username,
      password,
      authorization,
      responseBody
    );

    // Check callback type and handle accordingly
    const { type, payload } = callbackResponse;

    if (type === 6 || type === 0) {
      // CHECKOUT_ORDER_COMPLETED or PG_ORDER_COMPLETED
      // Payment successful - you can update your database here
      console.log('Payment successful:', payload);

      return NextResponse.json({
        success: true,
        orderId: payload.orderId,
        merchantOrderId: payload.merchantOrderId,
        amount: payload.amount,
        state: payload.state,
      });
    } else {
      // Payment failed or other status
      console.log('Payment failed or other status:', payload);

      return NextResponse.json({
        success: false,
        orderId: payload.orderId,
        merchantOrderId: payload.merchantOrderId,
        state: payload.state,
        errorCode: payload.errorCode,
        detailedErrorCode: payload.detailedErrorCode,
      });
    }
  } catch (error) {
    console.error('Callback processing error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

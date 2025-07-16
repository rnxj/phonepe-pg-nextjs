import { NextRequest, NextResponse } from 'next/server';
import { Env, StandardCheckoutClient } from 'pg-sdk-node';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId } = body;

    // Validate required fields
    if (!orderId) {
      return NextResponse.json(
        { error: 'Missing required field: orderId' },
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

    // Check order status
    const statusResponse = await client.getOrderStatus(orderId);

    return NextResponse.json({
      success: true,
      orderId: statusResponse.orderId,
      state: statusResponse.state,
      amount: statusResponse.amount,
      payableAmount: statusResponse.payableAmount,
      feeAmount: statusResponse.feeAmount,
      merchantOrderId: statusResponse.merchantOrderId,
      merchantId: statusResponse.merchantId,
      expireAt: statusResponse.expireAt,
      errorCode: statusResponse.errorCode,
      detailedErrorCode: statusResponse.detailedErrorCode,
      paymentDetails: statusResponse.paymentDetails,
    });
  } catch (error) {
    console.error('Order status check error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

# PhonePe Payment Gateway Integration - Next.js

This is a complete PhonePe payment gateway integration with Next.js 15 using the official PhonePe Node.js SDK.

## Features

- ✅ Payment initiation using PhonePe Standard Checkout
- ✅ Payment status checking
- ✅ Webhook callback handling
- ✅ Modern React UI with Tailwind CSS
- ✅ TypeScript support
- ✅ Error handling and validation
- ✅ Responsive design

## Setup Instructions

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Environment Variables

Copy the `.env.example` file to `.env.local` and fill in your PhonePe credentials:

```bash
cp .env.example .env.local
```

Required environment variables:

```env
# PhonePe Payment Gateway Configuration
PHONEPE_CLIENT_ID=your_client_id
PHONEPE_CLIENT_SECRET=your_client_secret
PHONEPE_ENVIRONMENT=SANDBOX
PHONEPE_CALLBACK_URL=http://localhost:3000/api/phonepe/callback
PHONEPE_REDIRECT_URL=http://localhost:3000/payment/result
PHONEPE_REDIRECT_MODE=REDIRECT

# Next.js App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Callback Configuration (Optional - for webhook validation)
PHONEPE_CALLBACK_USERNAME=your_callback_username
PHONEPE_CALLBACK_PASSWORD=your_callback_password
```

### 3. Get PhonePe Credentials & Configure Webhooks

1. Visit [PhonePe Developer Dashboard](https://developer.phonepe.com/)
2. Create a merchant account
3. Get your Client ID and Client Secret
4. **IMPORTANT**: Configure callback URL in PhonePe Dashboard:
   - Go to **Developer Settings** → **Webhook**
   - Set **Callback URL**: `http://localhost:3000/api/phonepe/callback` (for development)
   - Set **Redirect URL**: `http://localhost:3000/payment/result` (for development)
   - For production, use your actual domain URLs
   - Enable webhook events for payment status updates

### 4. Run the Application

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## API Endpoints

### 1. Initiate Payment

**POST** `/api/phonepe/initiate`

```json
{
  "amount": 100.0,
  "merchantOrderId": "ORDER_123456",
  "message": "Payment for order",
  "redirectUrl": "http://localhost:3000/payment/success"
}
```

Response:

```json
{
  "success": true,
  "orderId": "phonepe_order_id",
  "state": "PENDING",
  "expireAt": 1640995200000,
  "redirectUrl": "https://mercury.phonepe.com/transact/..."
}
```

### 2. Check Payment Status

**POST** `/api/phonepe/status`

```json
{
  "orderId": "phonepe_order_id"
}
```

Response:

```json
{
  "success": true,
  "orderId": "phonepe_order_id",
  "state": "COMPLETED",
  "amount": 10000,
  "merchantOrderId": "ORDER_123456",
  "merchantId": "your_merchant_id",
  "paymentDetails": [...]
}
```

### 3. Webhook Callback

**POST** `/api/phonepe/callback`

This endpoint handles PhonePe webhook callbacks for payment status updates.

## File Structure

```
src/
├── app/
│   ├── api/
│   │   └── phonepe/
│   │       ├── initiate/
│   │       │   └── route.ts          # Payment initiation
│   │       ├── callback/
│   │       │   └── route.ts          # Webhook callback handler
│   │       └── status/
│   │           └── route.ts          # Payment status check
│   ├── payment/
│   │   └── result/
│   │       └── page.tsx              # Payment result page (success/failure)
│   ├── page.tsx                      # Main payment form
│   └── layout.tsx                    # Root layout
├── .env.example                      # Environment variables template
└── README.md                         # This file
```

## Payment Flow

1. **User initiates payment** → Fills form on homepage
2. **API call to `/api/phonepe/initiate`** → Creates payment order
3. **Redirect to PhonePe** → User completes payment
4. **PhonePe redirects back** → To `/payment/result` page with order ID
5. **Status verification** → Checks payment status via API
6. **Webhook callback** → PhonePe sends status updates to `/api/phonepe/callback`

## Environment-Specific Configuration

### Development (SANDBOX)

```env
PHONEPE_ENVIRONMENT=SANDBOX
PHONEPE_CALLBACK_URL=http://localhost:3000/api/phonepe/callback
PHONEPE_REDIRECT_URL=http://localhost:3000/payment/success
```

### Production

```env
PHONEPE_ENVIRONMENT=PRODUCTION
PHONEPE_CALLBACK_URL=https://yourdomain.com/api/phonepe/callback
PHONEPE_REDIRECT_URL=https://yourdomain.com/payment/result
```

## Security Considerations

1. **Environment Variables**: Never commit `.env.local` to version control
2. **API Keys**: Keep your PhonePe client secret secure
3. **Webhook Validation**: The callback endpoint validates incoming webhooks
4. **Amount Handling**: Amounts are handled in paisa (multiply by 100)
5. **Error Handling**: All API endpoints include proper error handling

## Testing

### Test Payment Flow

1. Start the development server: `pnpm dev`
2. Navigate to `http://localhost:3000`
3. Enter a test amount (e.g., 10.00)
4. Click "Pay with PhonePe"
5. Complete the payment in PhonePe's sandbox
6. Verify the redirect to result page with order ID parameter
7. Check that the page shows correct success/failure status

### Test Webhook

Use tools like ngrok to expose your local server for webhook testing:

```bash
ngrok http 3000
```

Update your PhonePe dashboard webhook URL to the ngrok URL.

## Troubleshooting

### Common Issues

1. **Stuck on Payment Screen**:
   - Configure callback URL in PhonePe Business Dashboard under **Developer Settings** → **Webhook**
   - Ensure redirect URL is properly set and accessible
   - Check that your domain is whitelisted with PhonePe

2. **SDK Import Error**: Make sure you're importing from `pg-sdk-node`
3. **Environment Variables**: Check that all required variables are set
4. **Amount Format**: Ensure amounts are in the correct format (paisa)
5. **Webhook Validation**: Verify callback username/password configuration

### Payment Screen Issues

If you're stuck on the payment screen:

1. **Check PhonePe Dashboard**: Ensure webhook URLs are configured
2. **Verify Redirect URL**: Must be accessible and properly formatted
3. **Check Environment**: Ensure you're using correct SANDBOX/PRODUCTION settings
4. **Domain Whitelisting**: Your domain must be registered with PhonePe

### Debug Mode

Add console logs to API routes for debugging:

```typescript
console.log('Payment request:', paymentRequest);
console.log('PhonePe response:', response);
```

## Production Deployment

1. Set environment variables in your hosting platform
2. Update callback and redirect URLs to production domains
3. Test the complete payment flow in production
4. Monitor webhook deliveries in PhonePe dashboard

## Documentation Links

- [PhonePe Developer Documentation](https://developer.phonepe.com/)
- [PhonePe Node.js SDK](https://developer.phonepe.com/v1/reference/nodejs-sdk-introduction-standard-checkout/)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

## Support

For issues with PhonePe integration, refer to their official documentation or contact PhonePe support.

## License

This project is licensed under the MIT License.

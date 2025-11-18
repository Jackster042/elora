# Demo Payment Mode Setup

## Overview
This document explains how to configure the Elora e-commerce application to run in demo payment mode for portfolio purposes.

## Environment Configuration

### Setting Up Demo Mode

1. **Create your `.env` file** (if not already created):
   ```bash
   cd server
   cp .env.example .env
   ```

2. **Set the PAYMENT_MODE variable** in your `.env` file:
   ```env
   PAYMENT_MODE=demo
   ```

### Available Payment Modes

The `PAYMENT_MODE` environment variable supports three values:

| Mode | Description | PayPal Required? | Use Case |
|------|-------------|------------------|----------|
| `demo` | Mock payments without real PayPal API | ❌ No | Portfolio/Demo purposes |
| `sandbox` | PayPal Sandbox environment | ✅ Yes | Testing with PayPal sandbox |
| `live` | Real PayPal production payments | ✅ Yes | Production with real payments |

### Demo Mode Configuration

When using demo mode, you **do NOT need** PayPal credentials. Simply set:

```env
# Payment Mode - Use "demo" for portfolio demonstration
PAYMENT_MODE=demo

# PayPal credentials NOT required in demo mode
# PAY_PAL_MODE=sandbox
# PAY_PAL_CLIENT_ID=
# PAY_PAL_CLIENT_SECRET=
```

### Sandbox/Live Mode Configuration

When using PayPal (sandbox or live), you **must provide** valid PayPal credentials:

```env
# Payment Mode - Use "sandbox" for testing or "live" for production
PAYMENT_MODE=sandbox

# PayPal Configuration (REQUIRED for sandbox/live modes)
PAY_PAL_MODE=sandbox
PAY_PAL_CLIENT_ID=your_paypal_client_id_here
PAY_PAL_CLIENT_SECRET=your_paypal_client_secret_here
```

## Demo Mode Features

### What Works in Demo Mode

1. **Simulated Payment Flow**
   - Order creation with mock PayPal responses
   - Realistic payment delays (500-800ms)
   - No external API calls to PayPal

2. **Demo Order Tracking**
   - Orders marked with `isDemoOrder: true` flag
   - Demo order IDs: `DEMO-{timestamp}-{random}`
   - Visual badges in order history

3. **Testing Scenarios**
   - Success payments (default)
   - Optional failure scenarios for testing error handling

4. **Portfolio-Ready**
   - Site-wide banner indicating demo mode
   - Clear visual indicators for potential employers
   - Full e-commerce experience without payment processing

### What Doesn't Work in Demo Mode

- Real money transactions
- Actual PayPal account integration
- Real payment verification
- PayPal's buyer/seller protection

## Switching Between Modes

To switch payment modes:

1. **Demo → Sandbox/Live**:
   - Change `PAYMENT_MODE` in `.env`
   - Add PayPal credentials
   - Restart server

2. **Sandbox/Live → Demo**:
   - Change `PAYMENT_MODE=demo` in `.env`
   - Restart server
   - PayPal credentials will be ignored

## Verification

To verify your payment mode is configured correctly:

1. Check server logs on startup:
   ```
   Payment service initialized in DEMO mode
   ```

2. During checkout:
   - **Demo mode**: Modal payment interface appears
   - **Sandbox/Live**: Redirects to PayPal

3. In order details:
   - **Demo orders**: Display "DEMO ORDER" badge
   - **Real orders**: Standard order display

## Best Practices

### For Portfolio/Demo
- Keep `PAYMENT_MODE=demo` 
- Add demo banner to homepage
- Document that it's a demonstration
- Show both success and error flows

### For Development
- Use `PAYMENT_MODE=sandbox`
- Test with PayPal sandbox accounts
- Verify webhooks and callbacks work

### For Production
- Use `PAYMENT_MODE=live`
- Ensure valid PayPal credentials
- Test thoroughly in sandbox first
- Monitor payment processing

## Troubleshooting

### Issue: Orders not being created
**Check**: Is `PAYMENT_MODE` set in `.env`?
**Solution**: Add `PAYMENT_MODE=demo` to `.env` file

### Issue: PayPal credentials error in demo mode
**Check**: Is `PAYMENT_MODE` correctly set to `demo`?
**Solution**: Verify `.env` has `PAYMENT_MODE=demo` (no typos)

### Issue: Real payments processing in demo mode
**Check**: Server might be caching old environment variables
**Solution**: Restart the server completely

## Related Documentation

- [PayPal Production Strategy](./PAYPAL_PRODUCTION_STRATEGY.md) - Full analysis of payment options
- [Security Measures](./SECURITY_MEASURES.md) - Security considerations
- `.env.example` - Environment variable template

## Support

If you encounter issues with demo mode configuration:
1. Verify `.env` file exists in `/server` directory
2. Check server logs for payment mode initialization
3. Ensure server was restarted after `.env` changes
4. Review `server/services/paymentService.js` for mode detection logic

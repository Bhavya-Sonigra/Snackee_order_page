export const paymentConfig = {
  upi: {
    merchantId: process.env.REACT_APP_UPI_MERCHANT_ID || 'your-merchant-upi@bank',
    merchantName: process.env.REACT_APP_MERCHANT_NAME || 'Snackee',
    // Add a unique prefix to identify your transactions
    transactionPrefix: 'SNK',
    // Supported payment apps
    supportedApps: ['gpay', 'phonepe', 'paytm', 'bhim'],
    // Payment verification endpoint
    verificationEndpoint: process.env.REACT_APP_PAYMENT_VERIFICATION_URL || 'http://localhost:5000/api/payments/verify',
  }
}; 
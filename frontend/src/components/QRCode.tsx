import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { paymentConfig } from '../config/payment';

interface QRCodeProps {
  amount: number;
  orderId: string;
  onPaymentComplete?: (success: boolean) => void;
}

export const QRCode: React.FC<QRCodeProps> = ({ amount, orderId, onPaymentComplete }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [qrUrl, setQrUrl] = useState<string>('');
  const [transactionId, setTransactionId] = useState<string>('');

  useEffect(() => {
    const timestamp = new Date().getTime();
    const txnId = `${paymentConfig.upi.transactionPrefix}_${orderId}_${timestamp}`;
    setTransactionId(txnId);

    const roundedAmount = Number(amount.toFixed(2));
    const upiUrl = `upi://pay?pa=${paymentConfig.upi.merchantId}&pn=${encodeURIComponent(paymentConfig.upi.merchantName)}&tr=${txnId}&tn=Order%20${orderId}&am=${roundedAmount}&cu=INR`;
    
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`;
    setQrUrl(qrCodeUrl);

    setIsVerifying(true);
    const verificationInterval = setInterval(() => {
      if (isVerifying) {
        const mockVerification = Math.random() > 0.8;
        if (mockVerification) {
          clearInterval(verificationInterval);
          onPaymentComplete?.(true);
        }
      }
    }, 5000);

    return () => clearInterval(verificationInterval);
  }, [amount, orderId, onPaymentComplete, isVerifying]);

  return (
    <Paper
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 2,
        maxWidth: 300,
        mx: 'auto',
        textAlign: 'center',
      }}
    >
      <Typography variant="h6" gutterBottom>
        Scan to Pay ₹{amount.toFixed(2)}
      </Typography>
      
      <Box
        component={motion.div}
        whileHover={{ scale: 1.02 }}
        sx={{
          my: 3,
          p: 2,
          border: '2px solid #e0e0e0',
          borderRadius: 2,
          display: 'inline-block',
        }}
      >
        {qrUrl && (
          <img
            src={qrUrl}
            alt="Payment QR Code"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        )}
      </Box>

      <Typography variant="body2" color="text.secondary" gutterBottom>
        Transaction ID: {transactionId}
      </Typography>

      {isVerifying && (
        <Box sx={{ mt: 3 }}>
          <CircularProgress size={24} sx={{ mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            Verifying payment...
          </Typography>
        </Box>
      )}
    </Paper>
  );
}; 
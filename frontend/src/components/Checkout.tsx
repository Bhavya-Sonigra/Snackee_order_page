import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Radio, 
  RadioGroup, 
  FormControlLabel, 
  FormControl, 
  Box,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Grid,
  Divider,
  CardMedia,
  List,
  ListItem,
  ListItemText,
  Alert,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { OrderFormData } from '../types';
import { useCart } from '../context/CartContext';
import { QRCode } from './QRCode';

const steps = ['Shipping Information', 'Payment Method', 'Order Review'];

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, totalAmount, clearCart } = useCart();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [formData, setFormData] = useState<OrderFormData>({
    customer_name: '',
    email: '',
    address: '',
    payment_method: 'cod',
    items: cartItems,
    total_amount: totalAmount
  });
  const [qrPaymentStatus, setQrPaymentStatus] = useState<'pending' | 'completed' | 'failed'>('pending');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axios.post('http://localhost:5000/api/orders', formData);
      setOrderSuccess(true);
      clearCart();
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      console.error('Error submitting order:', error);
    } finally {
      setLoading(false);
    }
  };

  const verifyQrPayment = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 5000));
      setQrPaymentStatus('completed');
      handleNext();
    } catch (error) {
      setQrPaymentStatus('failed');
      console.error('Payment verification failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = () => {
    if (activeStep === 0) {
      return formData.customer_name && formData.email && formData.address;
    }
    if (activeStep === 1) {
      return formData.payment_method;
    }
    return true;
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box component="form" onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
            <Typography variant="h6" gutterBottom>
              Shipping Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Full Name"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Address"
                  name="address"
                  multiline
                  rows={3}
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Payment Method
            </Typography>
            <FormControl component="fieldset" sx={{ width: '100%' }}>
              <RadioGroup
                name="payment_method"
                value={formData.payment_method}
                onChange={handleInputChange}
              >
                <Paper sx={{ p: 2, mb: 2 }}>
                  <FormControlLabel value="cod" control={<Radio />} label="Cash on Delivery" />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                    Pay with cash upon delivery
                  </Typography>
                </Paper>
                <Paper sx={{ p: 2, mb: 2 }}>
                  <FormControlLabel value="card" control={<Radio />} label="Credit Card" />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                    Pay with your credit card
                  </Typography>
                </Paper>
                <Paper sx={{ p: 2 }}>
                  <FormControlLabel value="qr" control={<Radio />} label="QR Code" />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                    Scan QR code to pay instantly
                  </Typography>
                  {formData.payment_method === 'qr' && (
                    <Box sx={{ mt: 2, ml: 4 }}>
                      <QRCode 
                        amount={Number((totalAmount * 1.1).toFixed(2))} 
                        orderId={`ORD_${Date.now()}`}
                        onPaymentComplete={verifyQrPayment}
                      />
                      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={verifyQrPayment}
                          disabled={loading}
                          sx={{ minWidth: 200 }}
                        >
                          {loading ? (
                            <CircularProgress size={24} color="inherit" />
                          ) : (
                            'I have completed the payment'
                          )}
                        </Button>
                      </Box>
                      {qrPaymentStatus === 'failed' && (
                        <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
                          Payment verification failed. Please try again.
                        </Typography>
                      )}
                    </Box>
                  )}
                </Paper>
              </RadioGroup>
            </FormControl>
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Order Review
            </Typography>
            <Paper sx={{ p: 2, mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Shipping Information
              </Typography>
              <Typography variant="body1">{formData.customer_name}</Typography>
              <Typography variant="body1">{formData.email}</Typography>
              <Typography variant="body1">{formData.address}</Typography>
            </Paper>
            
            <Paper sx={{ p: 2, mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Payment Method
              </Typography>
              <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                {formData.payment_method.replace('_', ' ')}
              </Typography>
            </Paper>
            
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Order Items
              </Typography>
              <List>
                {cartItems.map((item) => (
                  <ListItem key={item.product.id}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={2}>
                        <CardMedia
                          component="img"
                          height="60"
                          image={item.product.image_url}
                          alt={item.product.name}
                          sx={{ borderRadius: 1 }}
                        />
                      </Grid>
                      <Grid item xs={7}>
                        <ListItemText 
                          primary={item.product.name} 
                          secondary={`Quantity: ${item.quantity}`} 
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant="body1" align="right">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                ))}
              </List>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal</Typography>
                <Typography>${Number(totalAmount).toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Shipping</Typography>
                <Typography>Free</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Tax</Typography>
                <Typography>${Number(totalAmount * 0.1).toFixed(2)}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6" color="primary">
                  ${Number(totalAmount * 1.1).toFixed(2)}
                </Typography>
              </Box>
            </Paper>
          </Box>
        );
      default:
        return null;
    }
  };

  if (orderSuccess) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <Alert severity="success" sx={{ mb: 4 }}>
          Your order has been placed successfully!
        </Alert>
        <Typography variant="h6" gutterBottom>
          Thank you for your purchase!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          You will receive an email confirmation shortly.
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => navigate('/')}
        >
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>
      
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      <Paper sx={{ p: 4 }}>
        {renderStepContent(activeStep)}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
            disabled={!isStepValid() || loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : activeStep === steps.length - 1 ? (
              'Place Order'
            ) : (
              'Next'
            )}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Checkout; 
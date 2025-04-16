import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  Grid,
  CardMedia,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Cart: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, totalAmount } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Your Cart is Empty
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/products')}
            sx={{ mt: 2 }}
          >
            Continue Shopping
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
          Shopping Cart
        </Typography>

        <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
          <List>
            {cartItems.map((item) => (
              <motion.div
                key={item.product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <ListItem
                  sx={{
                    py: 2,
                    borderRadius: 1,
                    mb: 2,
                  }}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={3} sm={2}>
                      <CardMedia
                        component="img"
                        image={item.product.image_url}
                        alt={item.product.name}
                        sx={{
                          width: '100%',
                          height: 'auto',
                          borderRadius: 1,
                          aspectRatio: '1',
                          objectFit: 'cover',
                        }}
                      />
                    </Grid>
                    <Grid item xs={5} sm={6}>
                      <ListItemText
                        primary={
                          <Typography variant="h6" sx={{ fontSize: '1.1rem' }}>
                            {item.product.name}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2" color="text.secondary">
                            ${item.product.price.toFixed(2)}
                          </Typography>
                        }
                      />
                    </Grid>
                    <Grid item xs={4} sm={4}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          gap: 1,
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <RemoveIcon />
                        </IconButton>
                        <Typography sx={{ mx: 1, minWidth: '20px', textAlign: 'center' }}>
                          {item.quantity}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        >
                          <AddIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => removeFromCart(item.product.id)}
                          sx={{ ml: 1 }}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{
                          mt: 1,
                          textAlign: 'right',
                          fontWeight: 600,
                        }}
                      >
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <Divider sx={{ my: 2 }} />
              </motion.div>
            ))}
          </List>

          <Box sx={{ mt: 4 }}>
            <Grid container spacing={2} justifyContent="flex-end">
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    Order Summary
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 1,
                    }}
                  >
                    <Typography>Subtotal</Typography>
                    <Typography>${totalAmount.toFixed(2)}</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 1,
                    }}
                  >
                    <Typography>Shipping</Typography>
                    <Typography>Free</Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6">Total</Typography>
                    <Typography variant="h6" color="primary">
                      ${totalAmount.toFixed(2)}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    onClick={() => navigate('/checkout')}
                  >
                    Proceed to Checkout
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Cart; 
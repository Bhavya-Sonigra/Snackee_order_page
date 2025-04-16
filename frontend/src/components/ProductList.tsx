import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  CircularProgress,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { Product } from '../types';
import { useTheme } from '@mui/material/styles';

const MotionCard = motion(Card);
const MotionContainer = motion(Container);

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useCart();
  const theme = useTheme();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError('Failed to load products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CircularProgress size={60} />
        </motion.div>
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography color="error" align="center" sx={{ my: 4 }}>
            {error}
          </Typography>
        </motion.div>
      </Container>
    );
  }

  return (
    <MotionContainer
      maxWidth="lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ py: 6 }}>
        <AnimatePresence>
          <Grid container spacing={4}>
            {products.map((product, index) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <MotionCard 
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                  whileHover={{ 
                    y: -8,
                    transition: { duration: 0.2 }
                  }}
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'visible'
                  }}
                >
                  {product.discount && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 16,
                          right: 16,
                          backgroundColor: theme.palette.error.main,
                          color: 'white',
                          borderRadius: '20px',
                          padding: '4px 12px',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          zIndex: 1,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                        }}
                      >
                        {product.discount}% OFF
                      </Box>
                    </motion.div>
                  )}
                  <CardMedia
                    component="img"
                    height="240"
                    image={product.image_url}
                    alt={product.name}
                    sx={{ 
                      objectFit: 'cover',
                      borderRadius: '12px 12px 0 0'
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography 
                      gutterBottom 
                      variant="h6" 
                      component="h2"
                      sx={{ 
                        fontWeight: 600,
                        mb: 1,
                        color: theme.palette.text.primary
                      }}
                    >
                      {product.name}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mb: 2,
                        color: theme.palette.text.secondary,
                        lineHeight: 1.6
                      }}
                    >
                      {product.description}
                    </Typography>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      mt: 'auto',
                      pt: 2,
                      borderTop: `1px solid ${theme.palette.divider}`
                    }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          color: theme.palette.primary.main,
                          fontWeight: 700
                        }}
                      >
                        ${Number(product.price).toFixed(2)}
                      </Typography>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="contained"
                          onClick={() => handleAddToCart(product)}
                          size="medium"
                          sx={{
                            px: 3,
                            py: 1,
                            fontWeight: 600
                          }}
                        >
                          Add to Cart
                        </Button>
                      </motion.div>
                    </Box>
                  </CardContent>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </AnimatePresence>
      </Box>
    </MotionContainer>
  );
};

export default ProductList; 
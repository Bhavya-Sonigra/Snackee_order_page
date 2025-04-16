import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Badge,
  Box,
  Menu,
  MenuItem,
  useTheme,
} from '@mui/material';
import { 
  ShoppingCart, 
  Person as PersonIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

const MotionIconButton = motion(IconButton);
const MotionBadge = motion(Badge);

const Navbar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { cartItems } = useCart();
  const { logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: '70px', maxHeight: '70px' }}>
        {/* Left section - empty for spacing */}
        <Box sx={{ width: '100px' }} />

        {/* Center section - Logo */}
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/products')}
          whileHover={{ scale: 1.02 }}
        >
          <Box
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: 1,
            }}
          >
            <motion.div
              whileHover={{ rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Box
                component="img"
                src={logo}
                alt="Snackee Logo"
                sx={{
                  width: 105,
                  height: 105,
                  objectFit: 'contain',
                  mr: 0,
                  transform: 'scale(1.5)',
                  position: 'relative',
                  top: '2px'
                }}
              />
            </motion.div>
            <Typography 
              variant="h4" 
              component="div" 
              sx={{ 
                fontWeight: 600,
                fontSize: '1.5rem',
                letterSpacing: '0.5px',
                position: 'relative',
                left: '-25px',
                display: 'flex',
                alignItems: 'center',
                '& span:first-of-type': {
                  color: '#2A9D8F',
                  fontWeight: 700
                },
                '& span:last-child': {
                  color: '#E76F51',
                  fontWeight: 700
                }
              }}
            >
              <span>Snack</span>
              <span>ee</span>
            </Typography>
          </Box>
        </motion.div>

        {/* Right section - Cart & Profile */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5,
            width: '100px',
            justifyContent: 'flex-end'
          }}
        >
          <MotionIconButton 
            color="primary"
            onClick={() => navigate('/cart')}
            whileHover={{ 
              scale: 1.1,
              backgroundColor: `${theme.palette.primary.light}20`
            }}
            whileTap={{ scale: 0.95 }}
          >
            <MotionBadge 
              badgeContent={totalItems} 
              color="secondary"
              sx={{
                '& .MuiBadge-badge': {
                  backgroundColor: theme.palette.secondary.main,
                  color: 'white',
                }
              }}
            >
              <ShoppingCart />
            </MotionBadge>
          </MotionIconButton>
          
          <MotionIconButton
            color="primary"
            onClick={handleMenu}
            whileHover={{ 
              scale: 1.1,
              backgroundColor: `${theme.palette.primary.light}20`
            }}
            whileTap={{ scale: 0.95 }}
          >
            <PersonIcon />
          </MotionIconButton>
        </Box>

        <AnimatePresence>
          {Boolean(anchorEl) && (
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  borderRadius: 2,
                  minWidth: 200,
                  boxShadow: theme.shadows[3]
                },
                component: motion.div,
                initial: { opacity: 0, y: -20 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: -20 },
                transition: { duration: 0.2 }
              }}
            >
              <MenuItem onClick={() => { handleClose(); navigate('/profile'); }}>
                <PersonIcon sx={{ mr: 1.5, fontSize: 20 }} />
                Profile
              </MenuItem>
              <MenuItem onClick={() => { handleClose(); navigate('/orders'); }}>
                <ShoppingCart sx={{ mr: 1.5, fontSize: 20 }} />
                My Orders
              </MenuItem>
              <MenuItem 
                onClick={handleLogout}
                sx={{ color: theme.palette.error.main }}
              >
                <LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} />
                Logout
              </MenuItem>
            </Menu>
          )}
        </AnimatePresence>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 
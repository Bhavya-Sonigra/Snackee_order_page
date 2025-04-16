import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2A9D8F',
      light: '#4DB6AC',
      dark: '#1B7B71',
    },
    secondary: {
      main: '#E76F51',
      light: '#F4A261',
      dark: '#C54E38',
    },
    background: {
      default: '#F8F9FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2D3436',
      secondary: '#636E72',
    },
    error: {
      main: '#E63946',
      light: '#FF6B6B',
      dark: '#C92A2A',
    },
    warning: {
      main: '#F4A261',
      light: '#FFB37C',
      dark: '#E67E22',
    },
    success: {
      main: '#2A9D8F',
      light: '#4DB6AC',
      dark: '#1B7B71',
    },
    grey: {
      50: '#F8F9FA',
      100: '#F1F3F5',
      200: '#E9ECEF',
      300: '#DEE2E6',
      400: '#CED4DA',
      500: '#ADB5BD',
      600: '#868E96',
      700: '#495057',
      800: '#343A40',
      900: '#212529',
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: '3.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.75rem',
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 700,
      fontSize: '2.25rem',
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.3,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.57,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.57,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(45, 52, 54, 0.05)',
    '0px 4px 8px rgba(45, 52, 54, 0.08)',
    '0px 8px 16px rgba(45, 52, 54, 0.1)',
    '0px 12px 24px rgba(45, 52, 54, 0.12)',
    '0px 16px 32px rgba(45, 52, 54, 0.14)',
    '0px 20px 40px rgba(45, 52, 54, 0.16)',
    '0px 24px 48px rgba(45, 52, 54, 0.18)',
    '0px 28px 56px rgba(45, 52, 54, 0.20)',
    '0px 32px 64px rgba(45, 52, 54, 0.22)',
    '0px 36px 72px rgba(45, 52, 54, 0.24)',
    '0px 40px 80px rgba(45, 52, 54, 0.26)',
    '0px 44px 88px rgba(45, 52, 54, 0.28)',
    '0px 48px 96px rgba(45, 52, 54, 0.30)',
    '0px 52px 104px rgba(45, 52, 54, 0.32)',
    '0px 56px 112px rgba(45, 52, 54, 0.34)',
    '0px 60px 120px rgba(45, 52, 54, 0.36)',
    '0px 64px 128px rgba(45, 52, 54, 0.38)',
    '0px 68px 136px rgba(45, 52, 54, 0.40)',
    '0px 72px 144px rgba(45, 52, 54, 0.42)',
    '0px 76px 152px rgba(45, 52, 54, 0.44)',
    '0px 80px 160px rgba(45, 52, 54, 0.46)',
    '0px 84px 168px rgba(45, 52, 54, 0.48)',
    '0px 88px 176px rgba(45, 52, 54, 0.50)',
    '0px 92px 184px rgba(45, 52, 54, 0.52)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          fontSize: '0.9375rem',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 8px 16px rgba(45, 52, 54, 0.1)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0px 12px 24px rgba(45, 52, 54, 0.12)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 4px 8px rgba(45, 52, 54, 0.08)',
          '&:hover': {
            boxShadow: '0px 12px 24px rgba(45, 52, 54, 0.12)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: '#FFFFFF',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: '#F8F9FA',
            },
            '&.Mui-focused': {
              backgroundColor: '#FFFFFF',
              boxShadow: '0px 4px 8px rgba(45, 52, 54, 0.08)',
            },
          },
        },
      },
    },
  },
}); 
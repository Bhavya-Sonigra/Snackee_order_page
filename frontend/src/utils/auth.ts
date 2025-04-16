interface DecodedToken {
  exp: number;
  user: {
    id: string;
    username: string;
    email: string;
    full_name: string;
  };
}

const parseJwt = (token: string): DecodedToken | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

export const checkAuth = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (!token || !user) {
    return false;
  }

  try {
    // Decode and check token expiration
    const decodedToken = parseJwt(token);
    if (!decodedToken) {
      throw new Error('Invalid token');
    }

    // Check if token is expired
    const currentTime = Date.now() / 1000;
    if (decodedToken.exp < currentTime) {
      throw new Error('Token expired');
    }

    // Verify user data matches
    const parsedUser = JSON.parse(user);
    if (!parsedUser || !parsedUser.id || parsedUser.id !== decodedToken.user.id) {
      throw new Error('Invalid user data');
    }

    return true;
  } catch (error) {
    console.error('Auth check failed:', error);
    clearAuth();
    return false;
  }
};

export const setAuth = (token: string, user: any) => {
  try {
    // Verify token is valid before setting
    const decodedToken = parseJwt(token);
    if (!decodedToken) {
      throw new Error('Invalid token format');
    }

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    // Set cookie for additional security
    document.cookie = `auth_token=${token}; path=/; secure; samesite=strict`;
  } catch (error) {
    console.error('Error setting auth:', error);
    clearAuth();
    throw error;
  }
};

export const clearAuth = () => {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Clear auth cookie
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  } catch (error) {
    console.error('Error clearing auth:', error);
  }
}; 
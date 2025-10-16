
import api from '../apiClient';
import { toast } from "@/components/ui/sonner";

interface LoginResponse {
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
    department: string;
    token: string;
  };
  refreshToken?: string;
}

interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
}

// Enhanced login with better error handling and specific error messages
export const loginWithRefreshToken = async (email: string, password: string): Promise<LoginResponse> => {
  console.log('Attempting backend login with:', { email, password: '***' });
  
  try {
    // Try login with refresh token endpoint first
    const response = await api.post('/auth/login', { email, password });
    
    console.log('Backend login successful:', response.data);
    
    // Store real tokens
    localStorage.setItem('token', response.data.user.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    if (response.data.refreshToken) {
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }
    
    toast.success("Connexion réussie", {
      description: `Bienvenue, ${response.data.user.name}!`
    });
    
    return response.data;
  } catch (error: any) {
    console.error('Backend login failed:', error);
    
    // Check for specific error messages from backend
    const errorMessage = error.response?.data?.message || '';
    const statusCode = error.response?.status;
    
    // Handle specific error cases
    if (statusCode === 401) {
      if (errorMessage.toLowerCase().includes('email')) {
        toast.error("Email incorrect", {
          description: "L'adresse email que vous avez saisie n'existe pas dans notre système."
        });
        throw new Error('Email incorrect');
      } else if (errorMessage.toLowerCase().includes('password')) {
        toast.error("Mot de passe incorrect", {
          description: "Le mot de passe que vous avez saisi est incorrect."
        });
        throw new Error('Mot de passe incorrect');
      } else {
        toast.error("Identifiants incorrects", {
          description: "L'email ou le mot de passe que vous avez saisi est incorrect."
        });
        throw new Error('Identifiants incorrects');
      }
    }
    
    // Try fallback to regular login endpoint
    try {
      const fallbackResponse = await api.post('/users/login', { email, password });
      
      console.log('Fallback login successful:', fallbackResponse.data);
      
      // Store tokens from fallback response
      localStorage.setItem('token', fallbackResponse.data.user.token);
      localStorage.setItem('user', JSON.stringify(fallbackResponse.data.user));
      
      toast.success("Connexion réussie", {
        description: `Bienvenue, ${fallbackResponse.data.user.name}!`
      });
      
      return fallbackResponse.data;
    } catch (fallbackError: any) {
      console.error('All login attempts failed:', fallbackError);
      
      // Check fallback error for specific messages
      const fallbackErrorMessage = fallbackError.response?.data?.message || '';
      const fallbackStatusCode = fallbackError.response?.status;
      
      if (fallbackStatusCode === 401) {
        if (fallbackErrorMessage.toLowerCase().includes('email')) {
          toast.error("Email incorrect", {
            description: "L'adresse email que vous avez saisie n'existe pas."
          });
        } else if (fallbackErrorMessage.toLowerCase().includes('password')) {
          toast.error("Mot de passe incorrect", {
            description: "Le mot de passe que vous avez saisi est incorrect."
          });
        } else {
          toast.error("Identifiants incorrects", {
            description: "L'email ou le mot de passe est incorrect. Veuillez vérifier vos informations."
          });
        }
      } else {
        toast.error("Erreur de connexion", {
          description: "Impossible de se connecter au serveur. Veuillez vérifier que le backend est démarré."
        });
      }
      
      throw new Error('Échec de la connexion');
    }
  }
};

// Enhanced token refresh with better error handling
export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      console.log('No refresh token available');
      return null;
    }
    
    // Call backend refresh endpoint
    const response = await api.post('/auth/refresh', { refreshToken });
    const { token, refreshToken: newRefreshToken }: RefreshTokenResponse = response.data;
    
    localStorage.setItem('token', token);
    if (newRefreshToken) {
      localStorage.setItem('refreshToken', newRefreshToken);
    }
    
    console.log('Token refreshed successfully');
    return token;
  } catch (error) {
    console.error('Token refresh failed:', error);
    
    // Clear invalid tokens
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    return null;
  }
};

// Enhanced JWT token expiration check
export const isTokenExpired = (token: string): boolean => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.log('Invalid token format, treating as expired');
      return true;
    }
    
    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Date.now() / 1000;
    const isExpired = payload.exp < currentTime;
    
    console.log('Token expiration check:', { exp: payload.exp, current: currentTime, isExpired });
    return isExpired;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true; // Treat invalid tokens as expired
  }
};

// Enhanced logout with better cleanup
export const enhancedLogout = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (refreshToken) {
      // Call backend logout endpoint
      await api.post('/auth/logout', { refreshToken });
    }
  } catch (error) {
    console.error('Error during logout:', error);
  } finally {
    // Always clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    toast.info("Logged out successfully");
  }
};

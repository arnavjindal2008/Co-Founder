import {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');

    if (savedToken) {
      setToken(savedToken);
      fetchCurrentUser(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = async (savedToken) => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${savedToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        logout();
        return;
      }

      setUser(data.user);
      setToken(savedToken);
      localStorage.setItem('user', JSON.stringify(data.user));
    } catch (error) {
      console.error('Authentication error:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = (userData, jwtToken) => {
    localStorage.setItem('token', jwtToken);
    localStorage.setItem('user', JSON.stringify(userData));

    setUser(userData);
    setToken(jwtToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setUser(null);
    setToken(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
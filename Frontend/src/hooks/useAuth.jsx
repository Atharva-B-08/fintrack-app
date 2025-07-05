import React, { useState, useEffect, useContext } from 'react';
import { redirect, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { toast } from 'react-toastify';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is authenticated
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/users/me", {
          method: "GET",
          credentials: "include", // VERY IMPORTANT to send cookie
        });

        if (res.ok) {
          const userData = await res.json();
          console.log(userData);  
          setUser(userData);
          redirect('/dashboard'); // store user info
        }else if(res.status === 401 || res.status === 403){
          setUser(null); // not authenticated
        }else{
          setUser(null); // not authenticated
        }        
      } catch (err) {
        console.error("Auth check failed", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Login method
  const login = async (credentials) => {
    try {
      setLoading(true);

      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Include cookie in request
        body: JSON.stringify(credentials),
      });

      if (!response.ok) throw new Error('Login failed');
      toast.success('Login successful', {
        className: 'bg-blue-600 text-white',
      });
      // Fetch user after login
      const me = await fetch('http://localhost:8080/api/users/me', {
        credentials: 'include',
      });

      if (me.ok) {
        const userData = await me.json();
        setUser(userData);
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.message, {
        className: 'bg-red-600 text-white',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await fetch("http://localhost:8080/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    console.log("User logged out");

    setUser(null);
    toast.info("You have been logged out");
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const useProtectedRoute = () => {
  const { user, loading } = useAuth();
  return { user, loading };
};

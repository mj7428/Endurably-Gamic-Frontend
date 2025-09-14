import React, { createContext, useState, useContext, useEffect } from 'react';
import martService from '../mart/services/martService';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [cart, setCart] = useState(null); 

    const fetchCart = async () => {
        if (!authService.getCurrentUserToken()) return;
        try {
            const response = await martService.getCart();
            setCart(response.data);
        } catch (error) {
            console.error("Failed to fetch cart", error);
            setCart({ items: [], totalPrice: 0 });
        }
    };

    useEffect(() => {
        const token = authService.getCurrentUserToken();
        if (token) {
            try {
                const decoded = JSON.parse(atob(token.split('.')[1]));
                if (decoded.exp * 1000 > Date.now()) {
                    setUser({ email: decoded.sub, roles: decoded.authorities || [] });
                    fetchCart(); 
                } else {
                    authService.logout();
                }
            } catch (error) {
                authService.logout();
            }
        }
    }, []);

    const login = async (userData) => {
        localStorage.setItem('userToken', userData.token);
        const decoded = JSON.parse(atob(userData.token.split('.')[1]));
        setUser({ email: decoded.sub, roles: decoded.authorities || [] });
        await fetchCart();
    };

    // This function is now async to prevent race conditions
    const loginWithToken = async (token) => {
        localStorage.setItem('userToken', token);
        const decoded = JSON.parse(atob(token.split('.')[1]));
        const newUser = { email: decoded.sub, roles: decoded.authorities || [] };
        setUser(newUser);
        await fetchCart();
        return Promise.resolve(newUser); 
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setCart(null);
    };

    const value = { user, cart,  login, logout, loginWithToken, fetchCart, setCart};

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


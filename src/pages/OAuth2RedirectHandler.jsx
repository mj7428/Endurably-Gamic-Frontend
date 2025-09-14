import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OAuth2RedirectHandler = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { loginWithToken } = useAuth();

    useEffect(() => {
        const handleLoginRedirect = async () => {
            const token = searchParams.get('token');
            if (token) {
                await loginWithToken(token); // Wait for the login state to be set
                navigate('/');               // Then navigate to the homepage
            } else {
                navigate('/login', { state: { error: 'Google login failed. Please try again.' } });
            }
        };

        handleLoginRedirect();
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <p className="text-white text-xl">Logging you in...</p>
        </div>
    );
};

export default OAuth2RedirectHandler;


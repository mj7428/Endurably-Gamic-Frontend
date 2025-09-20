import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import { useAuth } from '../context/AuthContext';
import loginImage from '../assets/loginfinal.png';
import { API_BASE_URL } from '../config';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const userData = await authService.login(email, password);
            login(userData);
            navigate('/');
        } catch (err) {
            setError('Failed to log in. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const API_BASE_URL_BACKEND = "https://np8fl1g1xc.execute-api.ap-south-1.amazonaws.com/prod"
    const googleLoginUrl = `${API_BASE_URL_BACKEND}/oauth2/authorization/google`;

    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
            <div className="max-w-4xl w-full grid md:grid-cols-2 bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                <div className="hidden md:block">
                    <img src={loginImage} alt="Fantasy Castle" className="w-full h-full object-cover" />
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold text-white mb-2">Welcome Back!</h2>
                    <p className="text-gray-400 mb-8">Sign in to continue</p>
                    
                    <a href={googleLoginUrl} className="w-full py-3 px-4 flex justify-center items-center gap-2 font-semibold text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300">
                        <svg className="w-5 h-5" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path><path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20z"></path><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.022 44 30.021 44 24c0-1.341-.138-2.65-.389-3.917z"></path></svg>
                        Sign in with Google
                    </a>

                    <div className="my-6 flex items-center">
                        <div className="flex-grow border-t border-gray-600"></div>
                        <span className="flex-shrink mx-4 text-gray-400">OR</span>
                        <div className="flex-grow border-t border-gray-600"></div>
                    </div>
                    
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition" placeholder="you@example.com" />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition" placeholder="••••••••" />
                        </div>
                        {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                        <button type="submit" disabled={loading} className="w-full py-3 px-4 font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-gray-500 transition-all duration-300 transform hover:scale-105">
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                        <div className="text-center text-sm text-gray-400">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-medium text-red-400 hover:underline">Sign Up</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;


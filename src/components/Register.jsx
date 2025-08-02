import React,
{
    useState
}
from 'react';
import authService from '../services/authService';
import registerImage from '../assets/registerfor.png';

const Register = ({
    onNavigate
}) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            await authService.register(name, email, password, "User");
            setSuccess('Registration successful! Please log in.');
            setTimeout(() => {
                onNavigate('login');
            }, 2000);
        } catch (err) {
            setError('Registration failed. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
            <div className="max-w-6xl w-full grid md:grid-cols-2 bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                
                <div className="p-8 md:p-12 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold text-white mb-2">Create an Account</h2>
                    <p className="text-gray-400 mb-8">Join the community and share your base layouts!</p>
                    
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                                Name
                            </label>
                            <input
                                id="name" type="text" value={name}
                                onChange={(e) => setName(e.target.value)} required
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                placeholder="Your Name"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                                Email
                            </label>
                            <input
                                id="email" type="email" value={email}
                                onChange={(e) => setEmail(e.target.value)} required
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                placeholder="you@example.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                                Password
                            </label>
                            <input
                                id="password" type="password" value={password}
                                onChange={(e) => setPassword(e.target.value)} required
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                placeholder="••••••••"
                            />
                        </div>
                        
                        {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                        {success && <p className="text-sm text-green-400 text-center">{success}</p>}

                        <button
                            type="submit" disabled={loading}
                            className="w-full py-3 px-4 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-500 transition-all duration-300 transform hover:scale-105"
                        >
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </button>

                        <div className="text-center text-sm text-gray-400">
                            Already have an account?{' '}
                            <button 
                                type="button" 
                                onClick={() => onNavigate('login')} 
                                className="font-medium text-blue-400 hover:underline"
                            >
                                Log In
                            </button>
                        </div>
                    </form>
                </div>

                <div className="hidden md:block">
                    <img
                        src={registerImage}
                        alt="Gaming Setup"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </div>
    );
};

export default Register;

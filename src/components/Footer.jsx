import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Footer = () => {
  const { user } = useAuth();
  const currentYear = new Date().getFullYear();

  const SocialIcon = ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-400 transition-colors duration-300">
      {children}
    </a>
  );

  return (
    <footer className="bg-gray-800 border-t border-gray-700 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          
          {/* Left Side: Branding and Navigation */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-white font-display tracking-wider">
              ENDURABLY GAMIC
            </h3>
            <p className="mt-2 text-sm text-gray-400">Your #1 source for competitive base layouts.</p>
            <div className="mt-4 flex justify-center md:justify-start space-x-6">
              <Link to="/" className="text-gray-300 hover:text-red-400 text-sm transition-colors">Home</Link>
              <Link to="/tournaments" className="text-gray-300 hover:text-red-400 text-sm transition-colors">Tournaments</Link>
              {user && (
                <Link to="/submit" className="text-gray-300 hover:text-red-400 text-sm transition-colors">Submit Base</Link>
              )}
            </div>
          </div>

          {/* Center Side: Gamic Mart */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-white font-display tracking-wider">
              GAMIC MART
            </h3>
            <p className="mt-2 text-sm text-gray-400">Your one-stop shop for premium in-game items and assets.</p>
            <div className="mt-4 flex justify-center md:justify-start space-x-6">
              <Link to="/mart" className="text-gray-300 hover:text-red-400 text-sm transition-colors">Mart Home</Link>
              {user && (
                <>
                  <Link to="/mart/cart" className="text-gray-300 hover:text-red-400 text-sm transition-colors">Cart</Link>
                  <Link to="/mart/my-orders" className="text-gray-300 hover:text-red-400 text-sm transition-colors">My Orders</Link>
                </>
              )}
            </div>
          </div>

          {/* Right Side: Social Links */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-white font-display tracking-wider">
              JOIN US
            </h3>
            <p className="mt-2 text-sm text-gray-400">Follow us on our social channels for the latest updates.</p>

            <div className="flex space-x-6 mt-4">
              <SocialIcon href="https://youtube.com/@endurablygamic1742?si=qka4xvzJcgcY_icB">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M21.522 6.494a2.75 2.75 0 00-1.943-1.943C17.94 4 12 4 12 4s-5.94 0-7.579.551a2.75 2.75 0 00-1.943 1.943C2 8.133 2 12 2 12s0 3.867.478 5.506a2.75 2.75 0 001.943 1.943C6.06 20 12 20 12 20s5.94 0 7.579-.551a2.75 2.75 0 001.943-1.943C22 15.867 22 12 22 12s0-3.867-.478-5.506zM9.75 15.5V8.5l6.5 3.5-6.5 3.5z" clipRule="evenodd" /></svg>
              </SocialIcon>
              <SocialIcon href="https://discord.gg/CbYradtUeM">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M19.54 6.04a13.31 13.31 0 00-1.9-2.35A13.88 13.88 0 0012 2C6.48 2 2 6.48 2 12s4.48 10 10 10c2.17 0 4.2-.63 5.92-1.74a13.31 13.31 0 001.9-2.35c.78-1.3 1.18-2.77 1.18-4.32s-.4-3.02-1.18-4.32zm-5.12 8.35c-.28.2-.59.34-.92.43-.33.09-.67.14-1.02.14-.8 0-1.54-.18-2.2-.53-.66-.35-1.18-.84-1.54-1.44s-.54-1.3-.54-2.08.18-1.48.54-2.08.88-.99 1.54-1.44c.66-.35 1.4-.53 2.2-.53.35 0 .69.05 1.02.14.33.09.64.23.92.43l-.72 1.23c-.15-.09-.3-.16-.47-.22-.17-.06-.34-.09-.53-.09-.34 0-.66.08-.94.24-.28.16-.52.39-.69.69s-.26.65-.26 1.04.09.74.26 1.04.39.53.69.69c.28.16.6.24.94.24.19 0 .36-.03.53-.09.17-.06.32-.13.47-.22l.72 1.23zm3.42-1.02c-.28.6-.68 1.08-1.16 1.44s-1.03.53-1.6.53c-.35 0-.69-.05-1.02-.14-.33-.09-.64-.23-.92-.43l.72-1.23c.15.09.3.16.47.22.17.06.34.09.53.09.34 0 .66-.08.94-.24.28-.16-.52.39.69-.69s-.26-.65-.26-1.04.09-.74.26-1.04.39-.53.69-.69c.28.16.6.24.94.24.19 0 .36-.03.53-.09.17-.06.32-.13.47-.22l.72 1.23c-.28.2-.59.34-.92.43-.33.09-.67.14-1.02.14-.57 0-1.11-.18-1.6-.53s-.88-.84-1.16-1.44H18v-1.3h-3.36c.03-.28.04-.56.04-.84s-.01-.56-.04-.84H18V8.8h-3.36c.28-.6.68-1.08 1.16-1.44s1.03-.53 1.6-.53c.35 0 .69.05 1.02.14.33.09.64.23.92.43l-.72 1.23c-.15-.09-.3-.16-.47-.22-.17-.06-.34-.09-.53-.09-.34 0-.66.08-.94-.24-.28-.16-.52.39-.69-.69s.26-.65.26-1.04-.09-.74-.26-1.04-.39-.53-.69-.69c-.28-.16-.6-.24-.94-.24-.19 0-.36-.03.53-.09-.17-.06-.32-.13-.47-.22l-.72-1.23c.28-.2.59-.34.92-.43.33-.09.67-.14 1.02-.14.57 0 1.11-.18 1.6.53s.88.84 1.16 1.44H14v1.3h3.36c-.03.28-.04-.56-.04-.84s.01.56.04.84H14V14h3.36z"/></svg>
              </SocialIcon>
              <SocialIcon href="https://instagram.com/endurablygamic?igsh=M3UyanQ0azlwYmNl">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2c-2.71 0-3.06.01-4.12.06a6.88 6.88 0 00-4.88 2.02A6.88 6.88 0 002.06 8.88C2.01 9.94 2 10.29 2 12s.01 2.06.06 3.12a6.88 6.88 0 002.02 4.88 6.88 6.88 0 004.88 2.02c1.06.05 1.41.06 4.12.06s3.06-.01 4.12-.06a6.88 6.88 0 004.88-2.02 6.88 6.88 0 002.02-4.88c.05-1.06.06-1.41.06-4.12s-.01-3.06-.06-4.12a6.88 6.88 0 00-2.02-4.88A6.88 6.88 0 0016.12 2.06C15.06 2.01 14.71 2 12 2zm0 1.8c2.65 0 2.96.01 4 .06a5.08 5.08 0 013.54 1.42 5.08 5.08 0 011.42 3.54c.05 1.04.06 1.35.06 4s-.01 2.96-.06 4a5.08 5.08 0 01-1.42 3.54 5.08 5.08 0 01-3.54 1.42c-1.04.05-1.35.06-4 .06s-2.96-.01-4-.06a5.08 5.08 0 01-3.54-1.42 5.08 5.08 0 01-1.42 3.54c-.05-1.04-.06-1.35-.06-4s.01-2.96.06-4a5.08 5.08 0 011.42-3.54A5.08 5.08 0 018 3.86c1.04-.05 1.35-.06 4-.06zM12 7.2a4.8 4.8 0 100 9.6 4.8 4.8 0 000-9.6zm0 7.8a3 3 0 110-6 3 3 0 010 6zm6.3-7.4a1.2 1.2 0 100-2.4 1.2 1.2 0 000 2.4z" clipRule="evenodd"/></svg>
              </SocialIcon>
              <SocialIcon href="https://twitch.tv/endurablygamic?sr=a">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M11.571 4.714h1.714v5.143H11.57zm4.571 0H17.86v5.143h-1.714zM6 2L2 6v14h4v4h2.571L12 20.571h3.429l4.571-4.571V2H6zm13.714 13.143l-2.571 2.571H14l-2.857 2.857V17.714h-4V4h12.571v11.143z"/></svg>
              </SocialIcon>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-700 text-center text-sm text-gray-500">
          <p>&copy; {currentYear} Endurably Gamic. All Rights Reserved.</p>
          <p className="mt-1">
            <Link to="/terms" className="hover:text-red-400 underline">
              Terms of Service
            </Link>
            <span className="mx-2">|</span>
            <Link to="/privacy" className="hover:text-red-400 underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


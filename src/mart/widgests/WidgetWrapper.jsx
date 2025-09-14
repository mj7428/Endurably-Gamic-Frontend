// src/widgests/WidgetWrapper.jsx

import React, { useState, useEffect, useRef } from 'react';

const WidgetWrapper = ({ title, children, onRemove, onResize }) => {
    const [isMenuOpen, setMenuOpen] = useState(false);
    
    // Create refs to track the menu and button elements
    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    // This effect handles the "click outside" functionality
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Close menu if the click is not on the menu itself or the button that opens it
            if (
                isMenuOpen &&
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setMenuOpen(false);
            }
        };

        // Add event listener when the component mounts
        document.addEventListener('mousedown', handleClickOutside);
        
        // Cleanup the event listener when the component unmounts
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]); // This effect depends on the menu's open state

    const handleResize = (dimension, size) => {
        onResize(dimension, size);
        setMenuOpen(false);
    };

    const handleRemove = () => {
        onRemove();
        setMenuOpen(false);
    };

    // A common style for the resize buttons to keep the code DRY
    const buttonClass = "w-full text-left block px-3 py-1.5 text-sm text-gray-200 hover:bg-gray-600 rounded-md transition-colors";

    return (
        <div className="bg-gray-800 rounded-lg h-full flex flex-col shadow-lg">
            <div className="p-2 border-b border-gray-700 flex justify-between items-center">
                <h2 className="text-md font-bold text-white">{title}</h2>
                <div className="relative">
                    {/* Attach the ref to the button */}
                    <button ref={buttonRef} onClick={() => setMenuOpen(!isMenuOpen)} className="text-gray-400 hover:text-white focus:outline-none">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
                    </button>
                    
                    {/* Redesigned Menu */}
                    {isMenuOpen && (
                        // Attach the ref to the menu's container
                        <div ref={menuRef} className="absolute right-0 mt-2 w-64 bg-gray-700 rounded-md shadow-lg z-20 overflow-hidden">
                            <div className="flex justify-between p-2">
                                {/* Left Column: Width */}
                                <div className="flex-1 pr-1">
                                    <p className="px-3 pb-2 text-xs font-semibold text-gray-400 uppercase">Width</p>
                                    <button onClick={() => handleResize('width', 'small')} className={buttonClass}>Small</button>
                                    <button onClick={() => handleResize('width', 'medium')} className={buttonClass}>Medium</button>
                                    <button onClick={() => handleResize('width', 'large')} className={buttonClass}>Large</button>
                                </div>

                                {/* Separator */}
                                <div className="border-l border-gray-600"></div>

                                {/* Right Column: Height */}
                                <div className="flex-1 pl-1">
                                    <p className="px-3 pb-2 text-xs font-semibold text-gray-400 uppercase">Height</p>
                                    <button onClick={() => handleResize('height', 'small')} className={buttonClass}>Small</button>
                                    <button onClick={() => handleResize('height', 'medium')} className={buttonClass}>Medium</button>
                                    <button onClick={() => handleResize('height', 'large')} className={buttonClass}>Large</button>
                                </div>
                            </div>
                            
                            {/* Bottom Section: Remove */}
                            <div className="border-t border-gray-600 ">
                                <button 
                                    onClick={handleRemove} 
                                    className="block w-full text-center px-4 py-2 text-sm text-red-400 hover:bg-red-600 hover:text-white transition-colors"
                                >
                                    Remove Widget
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="p-4 flex-grow overflow-auto">
                {children}
            </div>
        </div>
    );
};

export default WidgetWrapper;
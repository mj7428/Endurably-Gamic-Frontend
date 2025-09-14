import React, { useEffect, useState } from 'react';
import PendingBasesWidget from '../widgests/PendingBasesWidget';
import TournamentAdminWidget from '../widgests/TournamentAdminWidget';
import StatsWidget from '../widgests/StatsWidget';
import AddWidgetModal from '../components/AddWidgetModal';
import WidgetWrapper from '../widgests/WidgetWrapper';
import RecentOrdersWidget from '../widgests/RecentOrderWidget';

const ALL_WIDGETS = {
    stats: { name: 'Statistics', component: StatsWidget, defaultWidth: 'large', defaultHeight: 'small' },
    pendingBases: { name: 'Pending Bases', component: PendingBasesWidget, defaultWidth: 'medium', defaultHeight: 'medium' },
    tournaments: { name: 'Tournament Management', component: TournamentAdminWidget, defaultWidth: 'small', defaultHeight: 'small' },
    recentOrders: { name: 'Recent Orders', component: RecentOrdersWidget, defaultWidth: 'medium', defaultHeight: 'medium'},
};

// Maps for converting width/height strings to Tailwind CSS classes
const widthToClassMap = {
    small: 'md:col-span-1',
    medium: 'md:col-span-2',
    large: 'md:col-span-3',
};

const heightToClassMap = {
    small: 'md:row-span-1',
    medium: 'md:row-span-2',
    large: 'md:row-span-3',
};

const AdminDashboardPage = () => {
    // State now tracks width and height for each widget
    const [activeWidgets, setActiveWidgets] = useState([
        { key: 'stats', width: 'medium', height: 'small' },
        { key: 'tournaments', width: 'small', height: 'small' },
        { key: 'pendingBases', width: 'medium', height: 'small' },
        { key: 'recentOrders', width: 'small', height: 'medium' },
    ]);
    const [isModalOpen, setModalOpen] = useState(false);

    // Load and save the layout from localStorage (no changes needed here)
    useEffect(() => {
        const savedLayout = localStorage.getItem('adminDashboardLayout');
        if (savedLayout) {
            setActiveWidgets(JSON.parse(savedLayout));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('adminDashboardLayout', JSON.stringify(activeWidgets));
    }, [activeWidgets]);

    const addWidget = (widgetKey) => {
        if (!activeWidgets.find(w => w.key === widgetKey)) {
            const widget = ALL_WIDGETS[widgetKey];
            // Add widget with its default width and height
            setActiveWidgets([...activeWidgets, { 
                key: widgetKey, 
                width: widget.defaultWidth, 
                height: widget.defaultHeight 
            }]);
        }
    };

    const removeWidget = (widgetKeyToRemove) => {
        setActiveWidgets(activeWidgets.filter(w => w.key !== widgetKeyToRemove));
    };

    // Updated function to handle resizing either dimension
    const updateWidgetDimensions = (widgetKey, dimension, newSize) => {
        setActiveWidgets(activeWidgets.map(w =>
            w.key === widgetKey ? { ...w, [dimension]: newSize } : w
        ));
    };

    // Placeholder data
    const statsData = {
        pendingBases: 5,
        totalUsers: 128,
        activeTournaments: 2
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <AddWidgetModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onAddWidget={addWidget}
                allWidgets={ALL_WIDGETS}
                activeWidgets={activeWidgets.map(w => w.key)}
            />

            <div className="flex justify-between items-center mb-8">
                <h1 className="text-lg font-bold text-white">Admin Dashboard</h1>
                <button
                    onClick={() => setModalOpen(true)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center space-x-1"
                >
                    <svg className="w-4 h-5 " fill="currentColor" viewBox="0 0 20 20"><path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" /></svg>
                    <span className="text-sm">Add Widget</span>
                </button>
            </div>

            {/* Key CSS Change: Added `grid-auto-rows` to define the height of a single row.
              This ensures that `row-span-2` is twice as tall as `row-span-1`.
            */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 grid-auto-rows-[200px]">
                {activeWidgets.map(({ key, width, height }) => {
                    const Widget = ALL_WIDGETS[key].component;
                    const props = key === 'stats' ? { stats: statsData } : {};
                    
                    // Combine width and height classes
                    const widgetClasses = `${widthToClassMap[width] || ''} ${heightToClassMap[height] || ''}`;

                    return (
                        <div key={key} className={widgetClasses}>
                             <WidgetWrapper
                                title={ALL_WIDGETS[key].name}
                                onRemove={() => removeWidget(key)}
                                // Pass the new handler to the wrapper
                                onResize={(dimension, newSize) => updateWidgetDimensions(key, dimension, newSize)}
                            >
                                <Widget {...props} />
                            </WidgetWrapper>
                        </div>
                    )
                })}
            </div>
             {activeWidgets.length === 0 && (
                <div className="text-center bg-gray-800 p-12 rounded-lg mt-8">
                    <p className="text-gray-400">Your dashboard is empty. Click "Add Widget" to get started.</p>
                </div>
            )}
        </div>
    );
};

export default AdminDashboardPage;
import React from 'react';

const AddWidgetModal = ({ isOpen, onClose, onAddWidget, allWidgets, activeWidgets }) => {
    if (!isOpen) return null;

    const availableWidgets = Object.keys(allWidgets).filter(key => !activeWidgets.includes(key));

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 p-8 rounded-lg max-w-sm w-full">
                <h2 className="text-xl font-bold text-white mb-4">Add a Widget</h2>
                
                {availableWidgets.length > 0 ? (
                    <div className="space-y-3">
                        {availableWidgets.map(widgetKey => (
                            <button
                                key={widgetKey}
                                onClick={() => {
                                    onAddWidget(widgetKey);
                                    onClose();
                                }}
                                className="w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
                            >
                                {allWidgets[widgetKey].name}
                            </button>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400">All available widgets are already on your dashboard.</p>
                )}

                <div className="flex justify-end mt-6">
                    <button onClick={onClose} className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddWidgetModal;

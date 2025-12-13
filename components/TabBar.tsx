
import React, { useState, useEffect, useRef } from 'react';
import { TabItem, HttpMethod, CollectionItem } from '../types';

interface TabBarProps {
    tabs: TabItem[];
    activeTabId: string;
    onTabClick: (id: string) => void;
    onTabClose: (id: string, e: React.MouseEvent) => void;
    collections: CollectionItem[];
    onSaveToCollection: (reqId: string, colId: string) => void;
}

export const TabBar: React.FC<TabBarProps> = ({ tabs, activeTabId, onTabClick, onTabClose, collections, onSaveToCollection }) => {
    // Dropdown state now includes coordinates and specific tabId
    const [dropdown, setDropdown] = useState<{ isOpen: boolean, x: number, y: number, tabId: string } | null>(null);

    const getMethodColor = (method?: HttpMethod) => {
        if (!method) return 'text-gray-500';
        switch(method) {
            case 'GET': return 'text-green-600';
            case 'POST': return 'text-yellow-600';
            case 'DELETE': return 'text-red-600';
            case 'PUT': return 'text-blue-600';
            default: return 'text-gray-600';
        }
    };

    const handleSaveClick = (e: React.MouseEvent, tabId: string) => {
        e.stopPropagation();
        
        // If clicking the same button, toggle off
        if (dropdown && dropdown.tabId === tabId) {
            setDropdown(null);
            return;
        }

        const rect = e.currentTarget.getBoundingClientRect();
        setDropdown({
            isOpen: true,
            x: rect.left,
            y: rect.bottom + 5,
            tabId: tabId
        });
    };

    const handleCollectionSelect = (e: React.MouseEvent, colId: string) => {
        e.stopPropagation();
        if (dropdown) {
            onSaveToCollection(dropdown.tabId, colId);
        }
        setDropdown(null);
    };

    // Click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = () => {
             setDropdown(null);
        };
        // Use capture to ensure we catch it, but checking if dropdown is open
        if (dropdown) {
            document.addEventListener('click', handleClickOutside);
        }
        return () => document.removeEventListener('click', handleClickOutside);
    }, [dropdown]);

    return (
        <>
            <div className="flex bg-gray-100 border-b border-gray-200 pt-1 px-1 overflow-x-auto no-scrollbar">
                {tabs.map(tab => (
                    <div 
                        key={tab.id}
                        onClick={() => onTabClick(tab.id)}
                        className={`
                            group flex items-center min-w-[140px] max-w-[220px] h-9 px-3 mr-1 text-xs cursor-pointer select-none border-t border-l border-r rounded-t-md transition-colors relative
                            ${activeTabId === tab.id 
                                ? 'bg-white border-gray-200 border-b-white text-gray-800 font-medium relative top-[1px]' 
                                : 'bg-gray-100 border-transparent hover:bg-gray-200 text-gray-500'}
                        `}
                    >
                        {tab.type === 'request' && (
                            <span className={`mr-2 font-bold text-[10px] ${getMethodColor(tab.method)}`}>
                                {tab.method}
                            </span>
                        )}
                        {tab.type === 'welcome' && <span className="mr-2">🏠</span>}
                        
                        <span className="truncate flex-1" title={tab.title}>{tab.title}</span>
                        
                        {/* Action Buttons */}
                        <div className={`flex items-center ml-2 space-x-1 ${activeTabId === tab.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                            {/* Save Button - Only show if request is NOT part of a collection yet (draft/history) */}
                            {tab.type === 'request' && !tab.data?.collectionId && (
                                <button 
                                    onClick={(e) => handleSaveClick(e, tab.id)}
                                    className="p-0.5 rounded-full hover:bg-green-100 hover:text-green-600 text-gray-400"
                                    title="Save to Collection"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                </button>
                            )}

                            {/* Close Button */}
                            <button 
                                onClick={(e) => { e.stopPropagation(); onTabClose(tab.id, e); }}
                                className="p-0.5 rounded-full hover:bg-red-100 hover:text-red-600 text-gray-400"
                                title="Close Tab"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Fixed Position Dropdown (Portal-like behavior) */}
            {dropdown && (
                <div 
                    className="fixed bg-white rounded shadow-lg border border-gray-200 z-[9999] py-1 w-48"
                    style={{ top: dropdown.y, left: dropdown.x }}
                    onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside
                >
                    <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                        Save to Collection
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                        {collections.length === 0 && (
                            <div className="px-3 py-2 text-gray-400 italic text-xs">No collections found</div>
                        )}
                        {collections.map(col => (
                            <div 
                                key={col.id}
                                onClick={(e) => handleCollectionSelect(e, col.id)}
                                className="px-3 py-2 hover:bg-green-50 cursor-pointer flex items-center text-gray-700 text-xs"
                            >
                                <span className="mr-2">📁</span>
                                <span className="truncate">{col.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

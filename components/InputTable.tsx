
import React from 'react';
import { KeyValue } from '../types';
import { generateId } from '../utils';
import { Button } from './Button';

interface InputTableProps {
  items: KeyValue[];
  onChange: (items: KeyValue[]) => void;
  title?: string;
  hideTitle?: boolean;
}

export const InputTable: React.FC<InputTableProps> = ({ items, onChange, title, hideTitle }) => {
  
  // Ensure there is always at least one row if empty
  React.useEffect(() => {
    if (items.length === 0) {
      onChange([{ id: generateId(), key: '', value: '', enabled: true, type: 'text' }]);
    }
  }, [items.length]);

  const handleChange = (id: string, field: keyof KeyValue, val: any) => {
    const newItems = items.map(item => 
      item.id === id ? { ...item, [field]: val } : item
    );
    
    // Auto-add row if editing the last one
    const lastItem = newItems[newItems.length - 1];
    if (lastItem.id === id && (val !== '')) {
       newItems.push({ id: generateId(), key: '', value: '', enabled: true, type: 'text' });
    }
    
    onChange(newItems);
  };

  const handleRemove = (id: string) => {
    // If it's the only item, just clear it
    if (items.length <= 1) {
        onChange([{ id: generateId(), key: '', value: '', enabled: true, type: 'text' }]);
        return;
    }
    onChange(items.filter(i => i.id !== id));
  };

  const handleToggle = (id: string) => {
    onChange(items.map(i => i.id === id ? { ...i, enabled: !i.enabled } : i));
  };

  const handleManualAdd = () => {
    onChange([...items, { id: generateId(), key: '', value: '', enabled: true, type: 'text' }]);
  };

  return (
    <div className="w-full flex flex-col">
      {!hideTitle && title && <div className="text-sm font-bold text-gray-700 mb-2">{title}</div>}
      
      {/* Header */}
      <div className="flex border-b border-gray-200 pb-1 mb-1 text-xs font-semibold text-gray-500">
        <div className="w-8 text-center"></div>
        <div className="flex-1 px-1">Key</div>
        <div className="flex-1 px-1">Value</div>
        <div className="w-8"></div>
      </div>

      {/* Rows */}
      {items.map((item, index) => (
        <div key={item.id} className="flex items-start mb-1 group">
          <div className="w-8 flex justify-center pt-2">
            <input 
              type="checkbox" 
              checked={item.enabled} 
              onChange={() => handleToggle(item.id)}
              className="rounded text-green-600 focus:ring-green-500 cursor-pointer"
            />
          </div>
          <div className="flex-1 px-1 relative">
            <input 
              type="text" 
              value={item.key} 
              placeholder="Key"
              onChange={(e) => handleChange(item.id, 'key', e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:border-green-500 focus:outline-none transition-colors"
            />
          </div>
          <div className="flex-1 px-1 relative">
             <input 
              type="text" 
              value={item.value} 
              placeholder="Value"
              onChange={(e) => handleChange(item.id, 'value', e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:border-green-500 focus:outline-none transition-colors"
            />
          </div>
          <div className="w-8 flex justify-center pt-2">
            {/* Don't show delete button for the last empty row unless it has content */}
            {(index !== items.length - 1 || item.key || item.value) && (
                <button 
                onClick={() => handleRemove(item.id)} 
                className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove"
                >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            )}
          </div>
        </div>
      ))}

      <div className="mt-2 px-1">
          <button 
            onClick={handleManualAdd}
            className="text-xs font-medium text-gray-500 hover:text-green-600 flex items-center transition-colors"
          >
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Add Item
          </button>
      </div>
    </div>
  );
};

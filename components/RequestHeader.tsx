
import React from 'react';
import { HttpRequest, HttpMethod } from '../types';

interface RequestHeaderProps {
    request: HttpRequest;
    onRequestChange: (req: HttpRequest) => void;
    onSend: () => void;
    isSending: boolean;
}

export const RequestHeader: React.FC<RequestHeaderProps> = ({ request, onRequestChange, onSend, isSending }) => {
    return (
        <div className="border-b border-gray-200 bg-gray-50 p-2">
            <div className="flex space-x-0 shadow-sm rounded-md w-full">
                <select
                    value={request.method}
                    onChange={(e) => onRequestChange({ ...request, method: e.target.value as HttpMethod })}
                    className="rounded-l-md border border-r-0 border-gray-300 px-3 py-2 text-sm font-bold bg-gray-100 focus:outline-none focus:ring-0 focus:border-gray-300 w-24 text-gray-700 flex-shrink-0"
                >
                    {['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'].map(m => (
                        <option key={m} value={m}>{m}</option>
                    ))}
                </select>
                <input
                    type="text"
                    value={request.url}
                    onChange={(e) => onRequestChange({ ...request, url: e.target.value })}
                    placeholder="Enter Request URL"
                    className="flex-1 border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 z-10 font-mono text-gray-600 min-w-0"
                />
                <button 
                    onClick={onSend} 
                    disabled={isSending}
                    className={`rounded-r-md px-6 py-2 text-sm font-bold text-white transition-colors flex items-center flex-shrink-0 ${isSending ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'}`}
                >
                    {isSending ? 'Sending...' : 'SEND'}
                    {!isSending && <span className="ml-2 text-lg">›</span>}
                </button>
            </div>
        </div>
    );
};

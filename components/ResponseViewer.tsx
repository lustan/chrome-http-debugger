import React, { useState } from 'react';
import { HttpResponse } from '../types';
import { formatBytes } from '../utils';

interface ResponseViewerProps {
  response: HttpResponse | null;
  error?: string | null;
}

export const ResponseViewer: React.FC<ResponseViewerProps> = ({ response, error }) => {
  const [activeTab, setActiveTab] = useState<'body' | 'headers'>('body');

  if (error) {
    return (
      <div className="h-full flex items-center justify-center text-red-600 p-4 text-center">
        <div>
          <h3 className="font-bold text-lg mb-2">Request Failed</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        Enter a URL and click Send to get a response
      </div>
    );
  }

  // Determine status color
  const statusColor = response.status >= 200 && response.status < 300 
    ? 'text-green-600' 
    : response.status >= 400 
      ? 'text-red-600' 
      : 'text-yellow-600';

  let formattedBody = response.body;
  try {
    // Attempt pretty print
    const json = JSON.parse(response.body);
    formattedBody = JSON.stringify(json, null, 2);
  } catch (e) {
    // Not JSON, keep as is
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Status Bar */}
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <div className="flex space-x-4">
          <span className={`font-bold ${statusColor}`}>{response.status} {response.statusText}</span>
          <span className="text-gray-500 text-sm">{response.time} ms</span>
          <span className="text-gray-500 text-sm">{formatBytes(response.size)}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 px-4 mt-2">
        <button
          onClick={() => setActiveTab('body')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'body' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}
        >
          Response Body
        </button>
        <button
          onClick={() => setActiveTab('headers')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'headers' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}
        >
          Headers
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {activeTab === 'body' && (
          <pre className="text-xs font-mono text-gray-800 whitespace-pre-wrap overflow-x-auto">
            {formattedBody}
          </pre>
        )}
        {activeTab === 'headers' && (
          <div className="space-y-1">
            {Object.entries(response.headers).map(([key, val]) => (
              <div key={key} className="grid grid-cols-3 gap-2 text-sm border-b border-gray-100 py-1">
                <div className="font-semibold text-gray-700 truncate">{key}</div>
                <div className="col-span-2 text-gray-600 break-all">{val}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
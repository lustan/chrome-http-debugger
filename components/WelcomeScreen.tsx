
import React from 'react';
import { Button } from './Button';

interface WelcomeScreenProps {
  onCreateRequest: () => void;
  onCreateCollection: () => void;
  onImportCurl: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onCreateRequest, onCreateCollection, onImportCurl }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-gray-50 p-8">
      <div className="text-center max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to HTTP Debugger 🚀</h1>
        <p className="text-gray-600 mb-8">
          The powerful API testing tool for REST services. Create, test, and manage your API requests with ease.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div 
            onClick={onCreateRequest}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow hover:border-green-500 group"
          >
            <div className="text-green-600 text-2xl mb-2 group-hover:scale-110 transition-transform">⚡</div>
            <h3 className="font-bold text-gray-800">New Request</h3>
            <p className="text-sm text-gray-500 mt-1">Create your first API request</p>
          </div>

          <div 
            onClick={onCreateCollection}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow hover:border-blue-500 group"
          >
             <div className="text-blue-600 text-2xl mb-2 group-hover:scale-110 transition-transform">📁</div>
            <h3 className="font-bold text-gray-800">New Collection</h3>
            <p className="text-sm text-gray-500 mt-1">Organize your requests</p>
          </div>

          <div 
            onClick={onImportCurl}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow hover:border-purple-500 group"
          >
             <div className="text-purple-600 text-2xl mb-2 group-hover:scale-110 transition-transform">📥</div>
            <h3 className="font-bold text-gray-800">Import cURL</h3>
            <p className="text-sm text-gray-500 mt-1">Paste cURL to get started</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 opacity-60 cursor-not-allowed">
             <div className="text-orange-600 text-2xl mb-2">🏃</div>
            <h3 className="font-bold text-gray-800">Runner</h3>
            <p className="text-sm text-gray-500 mt-1">Test execution (Coming Soon)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

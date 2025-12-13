
import React, { useState, useEffect } from 'react';
import { HttpRequest, KeyValue } from '../types';
import { InputTable } from './InputTable';
import { paramsToQueryString } from '../utils';

interface RequestEditorProps {
  request: HttpRequest;
  onRequestChange: (req: HttpRequest) => void;
}

export const RequestEditor: React.FC<RequestEditorProps> = ({ request, onRequestChange }) => {
  const [activeTab, setActiveTab] = useState<'params' | 'headers' | 'body' | 'auth'>('params');
  const [bodyType, setBodyType] = useState<HttpRequest['bodyType']>(request.bodyType || 'none');

  // Sync internal bodyType state when switching requests
  useEffect(() => {
    setBodyType(request.bodyType || 'none');
  }, [request.id, request.bodyType]);

  const handleParamsChange = (newParams: KeyValue[]) => {
    const queryString = paramsToQueryString(newParams);
    const baseUrl = request.url.split('?')[0];
    const newUrl = queryString ? `${baseUrl}?${queryString}` : baseUrl;
    onRequestChange({ ...request, params: newParams, url: newUrl });
  };

  const handleBodyTypeChange = (type: HttpRequest['bodyType']) => {
      setBodyType(type);
      onRequestChange({ ...request, bodyType: type });
  };
  
  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 px-2 mt-1">
        {['params', 'headers', 'body', 'auth'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 text-xs font-bold tracking-wide uppercase border-b-2 transition-colors mb-[-1px] ${
              activeTab === tab 
                ? 'border-green-600 text-green-700' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {tab}
            {tab === 'params' && request.params.some(p=>p.enabled && p.key) && <span className="ml-1 text-green-500">•</span>}
            {tab === 'headers' && request.headers.some(h=>h.enabled && h.key) && <span className="ml-1 text-green-500">•</span>}
            {tab === 'body' && request.bodyType !== 'none' && <span className="ml-1 text-green-500">•</span>}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-white relative">
        {activeTab === 'params' && (
           <div>
               <div className="mb-2 text-xs text-gray-500">Query Parameters</div>
               <InputTable items={request.params} onChange={handleParamsChange} hideTitle />
           </div>
        )}

        {activeTab === 'headers' && (
           <div>
              <div className="mb-2 text-xs text-gray-500">Request Headers</div>
              <InputTable items={request.headers} onChange={(headers) => onRequestChange({ ...request, headers })} hideTitle />
           </div>
        )}

        {activeTab === 'auth' && (
            <div className="flex items-center justify-center h-32 text-gray-400 text-sm border border-dashed border-gray-300 rounded">
                Authorization config coming soon
            </div>
        )}

        {activeTab === 'body' && (
          <div className="h-full flex flex-col">
             {/* Body Type Selectors */}
             <div className="flex space-x-4 mb-4 text-xs font-medium text-gray-600 border-b border-gray-100 pb-2">
                {[
                    {id: 'none', label: 'none'},
                    {id: 'form-data', label: 'form-data'},
                    {id: 'x-www-form-urlencoded', label: 'x-www-form-urlencoded'},
                    {id: 'raw', label: 'raw'}
                ].map(t => (
                    <label key={t.id} className={`flex items-center cursor-pointer hover:text-gray-900 ${bodyType === t.id ? 'text-green-600 font-bold' : ''}`}>
                    <input 
                        type="radio" 
                        checked={bodyType === t.id} 
                        onChange={() => handleBodyTypeChange(t.id as any)}
                        className="mr-1.5 accent-green-600"
                    />
                    {t.label}
                    </label>
                ))}
             </div>

             {/* Body Editors */}
             <div className="flex-1 overflow-y-auto">
                 {bodyType === 'none' && (
                    <div className="flex h-full items-center justify-center text-gray-400 text-sm">
                        This request does not have a body
                    </div>
                 )}

                 {(bodyType === 'form-data' || bodyType === 'x-www-form-urlencoded') && (
                     <InputTable 
                        items={request.bodyForm} 
                        onChange={(items) => onRequestChange({...request, bodyForm: items})}
                        hideTitle
                     />
                 )}

                 {bodyType === 'raw' && (
                   <div className="h-full flex flex-col">
                       <div className="flex justify-end mb-1">
                           <select className="text-xs border border-gray-200 rounded p-1 text-gray-600 focus:outline-none">
                               <option>JSON</option>
                               <option>Text</option>
                               <option>HTML</option>
                               <option>XML</option>
                           </select>
                       </div>
                       <textarea
                         value={request.bodyRaw}
                         onChange={(e) => onRequestChange({ ...request, bodyRaw: e.target.value })}
                         className="flex-1 w-full border border-gray-200 rounded p-3 font-mono text-xs resize-none focus:outline-none focus:border-green-500 bg-gray-50"
                         placeholder='Enter request body...'
                       />
                   </div>
                 )}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

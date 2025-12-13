
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

export interface KeyValue {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
  type?: 'text' | 'file'; // For form-data
  file?: File; // Store the actual file object
}

export interface HttpRequest {
  id: string;
  collectionId?: string;
  name: string;
  url: string;
  method: HttpMethod;
  headers: KeyValue[];
  params: KeyValue[];
  // Body configuration
  bodyType: 'none' | 'raw' | 'form-data' | 'x-www-form-urlencoded';
  bodyRaw: string;
  bodyForm: KeyValue[]; // Used for both multipart and urlencoded
  bodyRawType?: 'json' | 'text' | 'html' | 'xml';
}

export interface HttpResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  time: number;
  size: number;
  isError?: boolean;
  errorMessage?: string;
}

export interface CollectionItem {
  id: string;
  name: string;
  collapsed?: boolean;
  requests: HttpRequest[];
}

export interface LoggedRequest {
  id: string;
  url: string;
  method: string;
  status: number;
  timestamp: number;
  type: string;
  requestHeaders?: Record<string, string>;
  requestBody?: string | Record<string, any>; // Parsed body or raw string
  responseHeaders?: Record<string, string>;
}

export type SidebarTab = 'collections' | 'history';

// New: Tab Interface
export interface TabItem {
    id: string; // usually requestId or 'welcome'
    type: 'request' | 'welcome';
    title: string;
    method?: HttpMethod;
    isDirty?: boolean; // Has unsaved changes (optional for future)
    data?: HttpRequest; // The actual request object if it's a request tab
}

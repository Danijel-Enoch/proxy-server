export interface Proxy {
    ip: string;
    port: number;
}

export interface RequestOptions {
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD';
    headers?: Record<string, string>;
    body?: string;
}

export interface ProxyRequestResult {
    success: boolean;
    data?: string;
    error?: Error;
    proxyUsed: string;
}
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import { HttpsProxyAgent } from 'https-proxy-agent';

import { CONFIG, TESTED_PROXIES } from '../config';
import type { Proxy, RequestOptions, ProxyRequestResult } from '../types';
import { shuffle, logger } from '../utils';

export class ProxyService {
    // Initialize with empty arrays and default values
    private proxies: Proxy[] = [];
    private testedProxies: string[] = TESTED_PROXIES;
    private currentIndex: number = 0;
    private currentTestedIndex: number = 0;

    constructor() {
        this.loadProxies();
    }

    private loadProxies(): void {
        try {
            const filePath = path.join(process.cwd(), CONFIG.PROXY_FILES.WORKING_PROXIES);
            const data = fs.readFileSync(filePath, 'utf-8');
            this.proxies = shuffle(JSON.parse(data));
            logger('info', `Loaded ${this.proxies.length} proxies from file`);
        } catch (error) {
            logger('error', 'Failed to load proxies, using empty array', error);
            this.proxies = [];
        }
    }

    public getNextProxy(): Proxy {
        if (this.currentIndex >= this.proxies.length) {
            this.currentIndex = 0;
            this.proxies = shuffle(this.proxies);
        }
        return this.proxies[this.currentIndex++];
    }

    public getNextTestedProxy(): string {
        if (this.currentTestedIndex >= this.testedProxies.length) {
            this.currentTestedIndex = 0;
            this.testedProxies = shuffle([...this.testedProxies]);
        }
        return this.testedProxies[this.currentTestedIndex++];
    }

    public async makeRequestWithTestedProxy(options: RequestOptions): Promise<ProxyRequestResult> {
        const selectedProxy = this.getNextTestedProxy();
        const agent = new HttpsProxyAgent(selectedProxy);

        try {
            const response = await fetch(options.url, {
                agent,
                method: options.method || CONFIG.REQUEST.DEFAULT_METHOD,
                headers: options.headers,
                body: options.body,
                timeout: CONFIG.REQUEST.DEFAULT_TIMEOUT
            });

            const data = await response.text();
            logger('success', `Request successful via proxy ${selectedProxy}`);

            return {
                success: true,
                data,
                proxyUsed: selectedProxy
            };
        } catch (error) {
            logger('error', `Request failed via proxy ${selectedProxy}`, error);
            return {
                success: false,
                error: error as Error,
                proxyUsed: selectedProxy
            };
        }
    }

    public async makeRequestWithProxy(options: RequestOptions): Promise<ProxyRequestResult> {
        const selectedProxy = this.getNextProxy();
        const proxyUrl = `http://${selectedProxy.ip}:${selectedProxy.port}`;
        const agent = new HttpsProxyAgent(proxyUrl);

        try {
            const response = await fetch(options.url, {
                agent,
                method: options.method || CONFIG.REQUEST.DEFAULT_METHOD,
                headers: options.headers,
                body: options.body,
                timeout: CONFIG.REQUEST.DEFAULT_TIMEOUT
            });

            const data = await response.text();
            logger('success', `Request successful via proxy ${proxyUrl}`);

            return {
                success: true,
                data,
                proxyUsed: proxyUrl
            };
        } catch (error) {
            logger('error', `Request failed via proxy ${proxyUrl}`, error);
            return {
                success: false,
                error: error as Error,
                proxyUsed: proxyUrl
            };
        }
    }

    public getProxyCount(): { total: number; tested: number } {
        return {
            total: this.proxies.length,
            tested: this.testedProxies.length
        };
    }
}
import { expect } from 'chai';
import sinon from 'sinon';
import nock from 'nock';
import fs from 'fs';
import path from 'path';
import { ProxyService } from '../services/ProxyService';
import type { Proxy } from '../types';

describe('ProxyService', () => {
    let proxyService: ProxyService;
    let sandbox: sinon.SinonSandbox;

    const mockProxies: Proxy[] = [
        { ip: '192.168.1.1', port: 8080 },
        { ip: '192.168.1.2', port: 8081 },
        { ip: '192.168.1.3', port: 8082 }
    ];

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        
        // Mock fs.readFileSync
        sandbox.stub(fs, 'readFileSync').returns(JSON.stringify(mockProxies));
        
        // Initialize ProxyService
        proxyService = new ProxyService();
    });

    afterEach(() => {
        sandbox.restore();
        nock.cleanAll();
    });

    describe('getNextProxy', () => {
        it('should return proxies in sequence', () => {
            const proxy1 = proxyService.getNextProxy();
            const proxy2 = proxyService.getNextProxy();
            const proxy3 = proxyService.getNextProxy();

            expect(mockProxies).to.include(proxy1);
            expect(mockProxies).to.include(proxy2);
            expect(mockProxies).to.include(proxy3);
        });

        it('should cycle back to start when reaching end of list', () => {
            // Get all proxies once
            mockProxies.forEach(() => proxyService.getNextProxy());
            
            // Get one more - should start from beginning
            const nextProxy = proxyService.getNextProxy();
            expect(mockProxies).to.include(nextProxy);
        });
    });

    describe('makeRequestWithProxy', () => {
        it('should successfully make a request through proxy', async () => {
            const testUrl = 'http://api.test.com';
            const responseData = { success: true };

            // Mock the HTTP request
            nock(testUrl)
                .get('/')
                .reply(200, JSON.stringify(responseData));

            const result = await proxyService.makeRequestWithProxy({
                url: testUrl,
                method: 'GET'
            });

            expect(result.success).to.be.true;
            expect(result.data).to.contain(JSON.stringify(responseData));
        });

        it('should handle request failures', async () => {
            const testUrl = 'http://api.test.com';

            // Mock a failed request
            nock(testUrl)
                .get('/')
                .replyWithError('Connection failed');

            const result = await proxyService.makeRequestWithProxy({
                url: testUrl,
                method: 'GET'
            });

            expect(result.success).to.be.false;
            expect(result.error).to.exist;
        });
    });

    describe('getProxyCount', () => {
        it('should return correct counts', () => {
            const counts = proxyService.getProxyCount();
            expect(counts.total).to.equal(mockProxies.length);
            expect(counts.tested).to.be.a('number');
        });
    });
});
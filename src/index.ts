import { ProxyService } from './services/ProxyService';
import { logger } from './utils';

async function main() {
    const proxyService = new ProxyService();
    const { total, tested } = proxyService.getProxyCount();
    
    logger('info', `Initialized proxy service with ${total} total proxies and ${tested} tested proxies`);

    // Example of making multiple requests
    const requests = Array(5).fill(null).map(async (_, index) => {
        const result = await proxyService.makeRequestWithTestedProxy({
            url: 'https://api.geckoterminal.com/api/v2/networks/eth/pools/0x60594a405d53811d3bc4766596efd80fd545a270',
            headers: { 'Content-Type': 'application/json' }
        });

        if (result.success) {
            logger('success', `Request ${index + 1} completed successfully`);
        } else {
            logger('error', `Request ${index + 1} failed`, result.error);
        }

        return result;
    });

    try {
        const results = await Promise.all(requests);
        const successCount = results.filter(r => r.success).length;
        logger('info', `Completed ${successCount} successful requests out of ${requests.length}`);
    } catch (error) {
        logger('error', 'Error processing requests', error);
    }
}

main().catch(error => logger('error', 'Application error', error));
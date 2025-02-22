import fs from 'fs';
import axios from 'axios';
import type { Proxy } from './types';

async function testProxy(proxy: Proxy): Promise<boolean> {
    const proxyUrl = `http://${proxy.ip}:${proxy.port}`;

    try {
        const response = await axios.head('http://www.google.com', {
            proxy: {
                host: proxy.ip,
                port: proxy.port,
                protocol: 'http'
            },
            timeout: 3000 // Reduced timeout to 3 seconds
        });

        return response.status === 200;
    } catch (error) {
        return false;
    }
}

async function checkProxies(): Promise<void> {
    // Read proxies from file
    const proxiesRaw = fs.readFileSync('proxies2.json', 'utf8');
    const proxies: Proxy[] = JSON.parse(proxiesRaw);

    console.log(`Testing ${proxies.length} proxies...`);

    // Test proxies concurrently in batches
    const batchSize = 50;
    const workingProxies: Proxy[] = [];

    for (let i = 0; i < proxies.length; i += batchSize) {
        const batch = proxies.slice(i, i + batchSize);
        const results = await Promise.all(
            batch.map(async (proxy, index) => {
                console.log(
                    `Testing proxy ${i + index + 1}/${proxies.length}: ${
                        proxy.ip
                    }:${proxy.port}`
                );
                const works = await testProxy(proxy);
                if (works) {
                    console.log(`✅ Proxy works: ${proxy.ip}:${proxy.port}`);
                    return proxy;
                }
                return null;
            })
        );

        workingProxies.push(
            ...results.filter((proxy): proxy is Proxy => proxy !== null)
        );
    }

    // Save working proxies to file
    fs.writeFileSync(
        'working-proxies2.json',
        JSON.stringify(workingProxies, null, 2)
    );

    console.log(`\nTesting complete!`);
    console.log(`Found ${workingProxies.length} working proxies`);
    console.log('Working proxies saved to working-proxies.json');
}

// Run the script
checkProxies().catch(console.error);
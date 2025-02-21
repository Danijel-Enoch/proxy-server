import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import { HttpsProxyAgent } from "https-proxy-agent";

type Proxy = {
	ip: string;
	port: number;
};

export class ProxySelector {
	proxies: Proxy[];

	constructor() {
		// Load proxies from JSON file
		const filePath = path.join(__dirname, "working-proxies2.json");
		const data = fs.readFileSync(filePath, "utf-8");
		this.proxies = JSON.parse(data);
	}

	getRandomProxy(): Proxy {
		const randomIndex = Math.floor(Math.random() * this.proxies.length);
		return this.proxies[randomIndex];
	}

	async makeRequestWithProxy(url: string): Promise<void> {
		const selectedProxy = this.getRandomProxy();
		const proxyUrl = `http://${selectedProxy.ip}:${selectedProxy.port}`;
		const agent = new HttpsProxyAgent(proxyUrl);

		try {
			const response = await fetch(url, { agent });
			const data = await response.text();
			console.log(`Response from ${url} via proxy ${proxyUrl}:`);
			console.log(data);
		} catch (error) {
			console.error(
				`Failed to fetch ${url} via proxy ${proxyUrl}:`,
				error
			);
		}
	}
}

// Example usage
export const proxySelector = new ProxySelector();
// proxySelector.makeRequestWithProxy("https://example.com");

import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import { HttpsProxyAgent } from "https-proxy-agent";
import { sleep } from "bun";

type Proxy = {
	ip: string;
	port: number;
};
const myTestedProxy = [
	"http://23.247.136.248:80",
	"http://8.219.97.248:80",
	"http://47.251.74.38:20",
	"http://47.89.159.212:179",
	"http://13.38.176.104:3128",
	"http://13.59.156.167:3128",
	"http://79.110.201.235:8081",
	"http://52.67.10.183:80",
	"http://8.210.17.35:3128",
	"http://8.215.12.103:2012",
	"http://8.213.215.187:3000",
	"http://185.105.102.189:80",
	"http://38.150.15.11:80",
	"http://43.200.77.128:3128",
	"http://8.221.141.88:161",
	"http://154.16.146.42:80",
	"http://185.105.102.179:80",
	"http://47.251.74.38:9080",
	"http://110.232.87.251:8080",
	"http://176.9.239.181:80",
	"http://192.73.244.36:80",
	"http://162.223.90.130:80",
	"http://80.249.112.162:80",
	"http://149.129.226.9:41",
	"http://41.173.24.38:80",
	"http://51.254.78.223:80",
	"http://103.152.112.120:80",
	"http://198.49.68.80:80"
];
export class ProxySelector {
	proxies: Proxy[];
	currentIndex: number;
	testedProxies: string[];

	constructor() {
		const filePath = path.join(__dirname, "working-proxies.json");
		const data = fs.readFileSync(filePath, "utf-8");
		this.proxies = JSON.parse(data);
		this.currentIndex = 0;
		this.shuffleProxies();
		this.testedProxies = myTestedProxy;
	}

	shuffleProxies(): void {
		for (let i = this.proxies.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[this.proxies[i], this.proxies[j]] = [
				this.proxies[j],
				this.proxies[i]
			];
		}
	}
	shuffleTestedProxies(): void {
		for (let i = this.testedProxies.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[this.testedProxies[i], this.testedProxies[j]] = [
				this.testedProxies[j],
				this.testedProxies[i]
			];
		}
	}

	getNextProxy(): Proxy {
		if (this.currentIndex >= this.proxies.length) {
			this.currentIndex = 0;
			this.shuffleProxies(); // Reshuffle to randomize the order again
		}
		return this.proxies[this.currentIndex++];
	}
	getNextTestedProxy(): string {
		if (this.currentIndex >= this.testedProxies.length) {
			this.currentIndex = 0;
			this.shuffleTestedProxies(); // Reshuffle to randomize the order again
		}
		return this.testedProxies[this.currentIndex++];
	}

	async makeRequestWithTestedProxy(
		url: string,
		method: string = "GET",
		headers: Record<string, string> = {},
		body?: string
	): Promise<string> {
		const selectedProxy = this.getNextTestedProxy();
		//console.log("selected proxy", selectedProxy);
		const proxyUrl = `${selectedProxy}`;
		const agent = new HttpsProxyAgent(proxyUrl);

		try {
			const response = await fetch(url, {
				agent,
				method,
				headers,
				body
			});
			const data = await response.text();
			console.log(`Response from ${url} via proxy ${proxyUrl}:`);
			return data;
		} catch (error) {
			console.error(
				`Failed to fetch ${url} via proxy ${proxyUrl}:`,
				error
			);
			throw error; // Re-throw error to propagate to caller
		}
	}

	async makeRequestWithProxy(
		url: string,
		method: string = "GET",
		headers: Record<string, string> = {},
		body?: string
	): Promise<string> {
		const selectedProxy = this.getNextProxy();
		const proxyUrl = `http://${selectedProxy.ip}:${selectedProxy.port}`;
		const agent = new HttpsProxyAgent(proxyUrl);

		try {
			const response = await fetch(url, {
				agent,
				method,
				headers,
				body
			});
			const data = await response.text();
			console.log(`Response from ${url} via proxy ${proxyUrl}:`);
			return data;
		} catch (error) {
			console.error(
				`Failed to fetch ${url} via proxy ${proxyUrl}:`,
				error
			);
			throw error; // Re-throw error to propagate to caller
		}
	}
}

// Example usage
const proxySelector = new ProxySelector();

const main = async () => {
	console.log("number of tested Proxies ", myTestedProxy.length);
	const x = [1, 2, 3, 4, 5, 1, 2, 3, 4, 3, 4, 3, 4, 3, 4, 3].map(
		async (item, id) => {
			console.log("id", id);
			const res = await proxySelector.makeRequestWithTestedProxy(
				"https://api.geckoterminal.com/api/v2/networks/eth/pools/0x60594a405d53811d3bc4766596efd80fd545a270",
				"GET",
				{ "Content-Type": "application/json" }
			);
			console.log({ res, id });
		}
	);
};
main();

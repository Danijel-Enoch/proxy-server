import * as fs from "fs";
import axios from "axios";

interface Proxy {
	ip: string;
	port: number;
}

async function testProxy(proxy: Proxy): Promise<boolean> {
	const proxyUrl = `http://${proxy.ip}:${proxy.port}`;

	try {
		const response = await axios.get("http://www.google.com", {
			proxy: {
				host: proxy.ip,
				port: proxy.port,
				protocol: "http"
			},
			timeout: 5000 // 5 second timeout
		});

		return response.status === 200;
	} catch (error) {
		return false;
	}
}

async function checkProxies() {
	// Read proxies from file
	const proxiesRaw = fs.readFileSync("proxies.json", "utf8");
	const proxies: Proxy[] = JSON.parse(proxiesRaw);

	const workingProxies: Proxy[] = [];

	console.log(`Testing ${proxies.length} proxies...`);

	// Test each proxy
	for (let i = 0; i < proxies.length; i++) {
		const proxy = proxies[i];
		console.log(
			`Testing proxy ${i + 1}/${proxies.length}: ${proxy.ip}:${
				proxy.port
			}`
		);

		const works = await testProxy(proxy);

		if (works) {
			console.log(`✅ Proxy works: ${proxy.ip}:${proxy.port}`);
			workingProxies.push(proxy);
		}
	}

	// Save working proxies to file
	fs.writeFileSync(
		"working-proxies.json",
		JSON.stringify(workingProxies, null, 2)
	);

	console.log(`\nTesting complete!`);
	console.log(`Found ${workingProxies.length} working proxies`);
	console.log("Working proxies saved to working-proxies.json");
}

// Run the script
checkProxies().catch(console.error);

import * as fs from "fs";

// Function to convert proxy list to JSON
function convertProxiesToJson(inputFile: string, outputFile: string) {
	try {
		// Read the file
		const data = fs.readFileSync(inputFile, "utf8");

		// Split the content by newlines and filter out empty lines
		const proxyList = data
			.split("\n")
			.map((line) => line.trim())
			.filter((line) => line.length > 0);

		// Create an array of proxy objects
		const proxyObjects = proxyList.map((proxy) => {
			const [ip, port] = proxy.split(":");
			return {
				ip,
				port: parseInt(port)
			};
		});

		// Convert to JSON string with pretty formatting
		const jsonContent = JSON.stringify(proxyObjects, null, 2);

		// Write to JSON file
		fs.writeFileSync(outputFile, jsonContent);

		console.log(
			`Successfully converted ${proxyObjects.length} proxies to JSON format`
		);
	} catch (error) {
		console.error("Error:", error);
	}
}

// Usage
convertProxiesToJson("proxies.txt", "proxies.json");

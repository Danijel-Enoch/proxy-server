# 🌐 proxy-server

Welcome to the proxy-server project! This repository helps manage and test proxies with ease. Dive in to set up and start running in no time! 🚀

## 📦 Installation

To install the necessary dependencies, run:

```sh
bun install
```

## 🏃 Running the Server

Launch the server using:

```sh
bun run index.ts
```

`index.ts` contains the main implementation of proxies.

## 🔄 Proxy Data Conversion

To convert a list of proxies from a `.txt` file to JSON:

Use `convert.ts` for the conversion process.

The resulting files, such as `proxies.json` and `proxies2.json`, will contain the converted proxy lists.

## 📡 Testing Proxies

Check if your proxies are active and responsive:

Use the `ping` script to test/ping servers.

The results will be stored in files like `working_proxies.json`, where each entry represents a successfully pinged proxy.

## About Bun

This project was created using `bun init` in Bun v1.2.2. Bun is a fast, modern JavaScript runtime designed to simplify and speed up development. 🎉

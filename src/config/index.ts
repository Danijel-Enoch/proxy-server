export const CONFIG = {
    PROXY_FILES: {
        WORKING_PROXIES: 'working-proxies.json',
        TESTED_PROXIES: 'working-proxies2.json',
    },
    REQUEST: {
        DEFAULT_TIMEOUT: 5000,
        DEFAULT_METHOD: 'GET',
        TEST_URL: 'http://www.google.com',
    },
    BATCH: {
        DEFAULT_SIZE: 50,
    }
} as const;

export const TESTED_PROXIES = [
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
] as const;
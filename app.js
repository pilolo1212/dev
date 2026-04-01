const axios = require('axios');
const os = require('os');
const checkDiskSpace = require('check-disk-space').default;

async function runSystemCheck() {
    console.log('📊 --- SYSTEM STATUS ---');

    // 1. RAM Usage
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    
    const toGB = (bytes) => (bytes / (1024 ** 3)).toFixed(2);

    console.log(`RAM: ${toGB(usedMemory)}GB / ${toGB(totalMemory)}GB used`);

    // 2. Disk Usage (Checking C: drive for Windows)
    try {
        const diskPath = os.platform() === 'win32' ? 'C:' : '/';
        const disk = await checkDiskSpace(diskPath);
        
        console.log(`Disk: ${toGB(disk.size - disk.free)}GB / ${toGB(disk.size)}GB used`);
    } catch (err) {
        console.log('Disk Check Error:', err.message);
    }

    console.log('\n🚀 Starting Speed Test...');
    
    // 3. Speed Test Logic
    const url = 'https://speed.cloudflare.com/__down?bytes=10485760'; 
    const startTime = Date.now();

    try {
        const response = await axios({ url, method: 'GET', responseType: 'stream' });
        let receivedBytes = 0;

        response.data.on('data', (chunk) => { receivedBytes += chunk.length; });

        response.data.on('end', () => {
            const duration = (Date.now() - startTime) / 1000;
            const mbps = ((receivedBytes * 8) / (1024 * 1024) / duration).toFixed(2);
            console.log(`Internet Speed: ${mbps} Mbps`);
            console.log('-------------------------');
        });
    } catch (error) {
        console.error('Speed Test Failed:', error.message);
    }
}

runSystemCheck();
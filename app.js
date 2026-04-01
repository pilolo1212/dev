const axios = require('axios');

async function testDownloadSpeed() {
    // A 10MB test file from a reliable source (Cloudflare)
    const url = 'https://speed.cloudflare.com/__down?bytes=10485760'; 
    
    console.log('🚀 Starting Speed Test...');
    const startTime = Date.now();

    try {
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream'
        });

        let receivedBytes = 0;
        const totalBytes = parseInt(response.headers['content-length'], 10);

        response.data.on('data', (chunk) => {
            receivedBytes += chunk.length;
            // Optional: Print progress dots
            process.stdout.write("."); 
        });

        response.data.on('end', () => {
            const endTime = Date.now();
            const durationInSeconds = (endTime - startTime) / 1000;
            
            const sizeInBits = receivedBytes * 8;
            const speedBps = sizeInBits / durationInSeconds;
            const speedMbps = (speedBps / (1024 * 1024)).toFixed(2);

            console.log('\n\n✅ Done!');
            console.log(`-----------------------------`);
            console.log(`Total Downloaded: ${(receivedBytes / (1024 * 1024)).toFixed(2)} MB`);
            console.log(`Time Elapsed: ${durationInSeconds.toFixed(2)} seconds`);
            console.log(`Download Speed: ${speedMbps} Mbps`);
            console.log(`-----------------------------`);
        });

    } catch (error) {
        console.error('❌ Error during speed test:', error.message);
    }
}

testDownloadSpeed();
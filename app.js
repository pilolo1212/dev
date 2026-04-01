const express = require('express');
const app = express();
const port = 3000;

// Serve a simple HTML page with the test logic
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head><title>Node Speed Test</title></head>
        <body>
            <h1>Node.js Speed Test</h1>
            <button onclick="runTest()">Start Download Speed Test</button>
            <p id="result"></p>

            <script>
                async function runTest() {
                    const status = document.getElementById('result');
                    status.innerText = "Testing...";
                    
                    const startTime = Date.now();
                    // We fetch 5MB of dummy data from our server
                    const response = await fetch('/speed-data');
                    const blob = await response.blob();
                    const endTime = Date.now();
                    
                    const durationInSeconds = (endTime - startTime) / 1000;
                    const sizeInBits = blob.size * 8;
                    const speedBps = sizeInBits / durationInSeconds;
                    const speedMbps = (speedBps / (1024 * 1024)).toFixed(2);

                    status.innerText = "Your Speed: " + speedMbps + " Mbps";
                }
            </script>
        </body>
        </html>
    `);
});

// Route that sends 5MB of dummy data
app.get('/speed-data', (req, res) => {
    const buffer = Buffer.alloc(5 * 1024 * 1024, 'a'); // 5MB of 'a's
    res.send(buffer);
});

app.listen(port, () => {
    console.log(`Speed test app listening at http://localhost:${port}`);
});
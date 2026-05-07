const http = require('http');

const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/attendance?select=*&limit=1',
    method: 'GET',
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        try {
            const parsed = JSON.parse(data);
            if (parsed.length > 0) {
                console.log('Columns visible to API:', Object.keys(parsed[0]));
            } else {
                console.log('No data returned.');
            }
        } catch (e) {
            console.log('Error parsing:', data);
        }
    });
});

req.on('error', (e) => {
    console.error(`problem: ${e.message}`);
});

req.end();

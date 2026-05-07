const http = require('http');

const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/attendance?select=company_id&limit=1',
    method: 'GET',
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        console.log('Response:', data);
    });
});

req.on('error', (e) => {
    console.error(`problem: ${e.message}`);
});

req.end();

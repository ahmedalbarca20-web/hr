const http = require('http');

const data = JSON.stringify({
    employee_id: '00000000-0000-0000-0000-000000000001',
    company_id: '00000000-0000-0000-0000-000000000001',
    date: '2026-03-08',
    check_in: '09:00',
    status: 'present'
});

const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/attendance',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
    },
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    let responseData = '';
    res.on('data', (chunk) => {
        responseData += chunk;
    });
    res.on('end', () => {
        console.log('Response:', responseData);
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();

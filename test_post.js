const http = require('http');

const data = JSON.stringify({
    employee_id: '00000000-0000-0000-0000-000000000001', // might not exist but should test schema
    company_id: '00000000-0000-0000-0000-000000000001',
    month: '2026-03',
    base_salary: 1000,
    deductions: 0,
    overtime_amount: 0
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/payroll',
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

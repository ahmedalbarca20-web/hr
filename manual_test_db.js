const { Client } = require('pg');
require('dotenv').config();

const user = 'postgres.mfouxdfxmgeuyvxgfzef';
const password = '@AHmed11889955';
const host = 'aws-1-ap-south-1.pooler.supabase.com';
const port = 5432;
const database = 'postgres';

async function testInsert() {
    const client = new Client({ user, password, host, port, database, ssl: { rejectUnauthorized: false } });
    try {
        await client.connect();

        const payload = {
            employee_id: '00000000-0000-0000-0000-000000000001',
            company_id: '00000000-0000-0000-0000-000000000001',
            check_in: '2026-03-08T09:00:00Z',
            status: 'present',
            source: 'manual'
        };

        console.log('Testing insert via pg...');
        await client.query(`
            INSERT INTO public.attendance (employee_id, company_id, check_in, status, source)
            VALUES ($1, $2, $3, $4, $5)
        `, [payload.employee_id, payload.company_id, payload.check_in, payload.status, payload.source]);

        console.log('✅ Insert successful via pg!');

    } catch (err) {
        console.error('❌ Insert failed via pg:', err.message);
        console.error('Code:', err.code);
    } finally {
        await client.end();
    }
}

testInsert();

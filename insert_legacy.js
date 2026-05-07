const { Client } = require('pg');
require('dotenv').config();

const user = 'postgres.mfouxdfxmgeuyvxgfzef';
const password = '@AHmed11889955';
const host = 'aws-1-ap-south-1.pooler.supabase.com';
const port = 5432;
const database = 'postgres';

async function insertLegacy() {
    const client = new Client({ user, password, host, port, database, ssl: { rejectUnauthorized: false } });
    try {
        await client.connect();
        await client.query(`
            INSERT INTO public.attendance (employee_id, check_in)
            VALUES ('00000000-0000-0000-0000-000000000001', NOW())
        `);
        console.log('Legacy row inserted.');
    } catch (err) {
        console.error('Failed:', err.message);
    } finally {
        await client.end();
    }
}

insertLegacy();

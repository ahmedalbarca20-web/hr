const { Client } = require('pg');
require('dotenv').config();

const user = 'postgres.mfouxdfxmgeuyvxgfzef';
const password = '@AHmed11889955';
const host = 'aws-1-ap-south-1.pooler.supabase.com';
const port = 5432;
const database = 'postgres';

async function checkData() {
    const client = new Client({ user, password, host, port, database, ssl: { rejectUnauthorized: false } });
    try {
        await client.connect();
        const res = await client.query('SELECT id, company_id FROM public.employees LIMIT 1');
        console.log('Employee Sample:', res.rows[0]);
        const res2 = await client.query('SELECT id FROM public.companies LIMIT 1');
        console.log('Company Sample:', res2.rows[0]);
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await client.end();
    }
}

checkData();

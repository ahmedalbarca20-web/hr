const { Client } = require('pg');
require('dotenv').config();

const user = 'postgres.mfouxdfxmgeuyvxgfzef';
const password = '@AHmed11889955';
const host = 'aws-1-ap-south-1.pooler.supabase.com';
const port = 5432;
const database = 'postgres';

async function checkSystem() {
    const client = new Client({ user, password, host, port, database, ssl: { rejectUnauthorized: false } });
    try {
        await client.connect();

        console.log('--- Triggers ---');
        const triggers = await client.query("SELECT tgname FROM pg_trigger JOIN pg_class ON pg_class.oid = tgrelid WHERE relname = 'attendance' AND tgisinternal = false;");
        console.log(triggers.rows);

        console.log('--- Policies (RLS) ---');
        const policies = await client.query("SELECT * FROM pg_policies WHERE tablename = 'attendance';");
        console.log(policies.rows);

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await client.end();
    }
}

checkSystem();

const { Client } = require('pg');
require('dotenv').config();

const user = 'postgres.mfouxdfxmgeuyvxgfzef';
const password = '@AHmed11889955';
const host = 'aws-1-ap-south-1.pooler.supabase.com';
const port = 5432;
const database = 'postgres';

async function runMigration() {
    const client = new Client({ user, password, host, port, database, ssl: { rejectUnauthorized: false } });
    try {
        await client.connect();

        console.log('Force reloading schema cache...');
        // Multiple ways to force refresh
        await client.query("NOTIFY pgrst, 'reload config'");
        await client.query("NOTIFY pgrst, 'reload schema'");

        // Also try some DDL that usually triggers cache refresh
        await client.query("COMMENT ON TABLE public.attendance IS 'Updated at " + new Date().toISOString() + "'");

        console.log('Reload signals sent.');
    } catch (err) {
        console.error('Failed:', err.message);
    } finally {
        await client.end();
    }
}

runMigration();

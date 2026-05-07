const { Client } = require('pg');
require('dotenv').config();

const user = 'postgres.mfouxdfxmgeuyvxgfzef';
const password = '@AHmed11889955';
const host = 'aws-1-ap-south-1.pooler.supabase.com';
const port = 5432;
const database = 'postgres';

async function forceRefresh() {
    const client = new Client({ user, password, host, port, database, ssl: { rejectUnauthorized: false } });
    try {
        await client.connect();
        console.log('--- FORCING FULL SCHEMA REFRESH ---');

        // 1. Send all possible PostgREST reload signals
        await client.query("NOTIFY pgrst, 'reload config'");
        await client.query("NOTIFY pgrst, 'reload schema'");

        // 2. Perform some DDL that usually triggers cache invalidation in Supabase
        await client.query("DROP VIEW IF EXISTS refresh_view;");
        await client.query("CREATE VIEW refresh_view AS SELECT 1;");
        await client.query("DROP VIEW refresh_view;");

        // 3. Update comments to trigger metadata changes
        await client.query("COMMENT ON TABLE public.attendance_records IS 'Schema refreshed " + new Date().toISOString() + "';");
        await client.query("COMMENT ON TABLE public.attendance IS 'Schema refreshed " + new Date().toISOString() + "';");
        await client.query("COMMENT ON TABLE public.payroll IS 'Schema refreshed " + new Date().toISOString() + "';");

        console.log('✅ Signals sent. Supabase should reload metadata now.');
    } catch (err) {
        console.error('Failed:', err.message);
    } finally {
        await client.end();
    }
}

forceRefresh();

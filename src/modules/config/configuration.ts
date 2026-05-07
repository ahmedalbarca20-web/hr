export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  supabase: {
    url: process.env.SUPABASE_URL ?? '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
    jwtSecret: process.env.SUPABASE_JWT_SECRET ?? '',
  },
  biometric: {
    deviceSyncCron: process.env.DEVICE_SYNC_CRON ?? '*/5 * * * *',
    zktecoDefaultPort: parseInt(process.env.ZKTECO_DEFAULT_PORT ?? '4370', 10),
  },
});

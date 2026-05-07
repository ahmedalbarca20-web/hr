"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    port: parseInt(process.env.PORT ?? '3000', 10),
    auth: {
        devBypass: process.env.AUTH_DEV_BYPASS === 'true',
        devEmail: process.env.AUTH_DEV_EMAIL ?? 'superadmin@hr-demo.local',
        devPassword: process.env.AUTH_DEV_PASSWORD ?? 'LocalHr#2026!Alpha',
        devJwtSecret: process.env.AUTH_DEV_JWT_SECRET ?? 'local-dev-insecure-secret',
    },
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
//# sourceMappingURL=configuration.js.map
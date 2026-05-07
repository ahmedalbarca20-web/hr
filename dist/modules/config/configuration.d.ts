declare const _default: () => {
    port: number;
    auth: {
        devBypass: boolean;
        devEmail: string;
        devPassword: string;
        devJwtSecret: string;
    };
    supabase: {
        url: string;
        serviceRoleKey: string;
        jwtSecret: string;
    };
    biometric: {
        deviceSyncCron: string;
        zktecoDefaultPort: number;
    };
};
export default _default;

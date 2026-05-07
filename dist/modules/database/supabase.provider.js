"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabaseProvider = exports.SUPABASE_CLIENT = void 0;
const config_1 = require("@nestjs/config");
const supabase_js_1 = require("@supabase/supabase-js");
exports.SUPABASE_CLIENT = 'SUPABASE_CLIENT';
exports.supabaseProvider = {
    provide: exports.SUPABASE_CLIENT,
    inject: [config_1.ConfigService],
    useFactory: (configService) => {
        const url = configService.get('supabase.url') ?? '';
        const serviceRoleKey = configService.get('supabase.serviceRoleKey') ?? '';
        return (0, supabase_js_1.createClient)(url, serviceRoleKey, {
            auth: { persistSession: false },
        });
    },
};
//# sourceMappingURL=supabase.provider.js.map
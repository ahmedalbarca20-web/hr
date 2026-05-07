"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseJwtGuard = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jsonwebtoken_1 = require("jsonwebtoken");
let SupabaseJwtGuard = class SupabaseJwtGuard {
    configService;
    constructor(configService) {
        this.configService = configService;
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization'];
        const token = authHeader?.startsWith('Bearer ')
            ? authHeader.slice(7)
            : undefined;
        const isProd = process.env.NODE_ENV === 'production';
        if (!token) {
            if (!isProd && request.method === 'GET') {
                const path = request.path || request.url || '';
                if (path.startsWith('/api/companies') || path.startsWith('/api/reports')) {
                    request.user = {
                        role: 'super_admin',
                        email: 'superadmin@hr-demo.local',
                        user_metadata: {
                            role: 'super_admin',
                            email: 'superadmin@hr-demo.local',
                        },
                    };
                    return true;
                }
            }
            throw new common_1.UnauthorizedException('Missing Authorization token');
        }
        const secret = this.configService.get('supabase.jwtSecret') ?? '';
        if (!secret && !isProd) {
            const decoded = (0, jsonwebtoken_1.decode)(token);
            if (decoded && typeof decoded === 'object') {
                request.user = decoded;
                return true;
            }
        }
        try {
            const payload = (0, jsonwebtoken_1.verify)(token, secret);
            request.user = payload;
            return true;
        }
        catch (error) {
            if (!isProd) {
                const decoded = (0, jsonwebtoken_1.decode)(token);
                if (decoded && typeof decoded === 'object') {
                    request.user = decoded;
                    return true;
                }
            }
            throw new common_1.UnauthorizedException('Invalid token');
        }
    }
};
exports.SupabaseJwtGuard = SupabaseJwtGuard;
exports.SupabaseJwtGuard = SupabaseJwtGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SupabaseJwtGuard);
//# sourceMappingURL=supabase-jwt.guard.js.map
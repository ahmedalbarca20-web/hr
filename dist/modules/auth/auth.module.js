"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const supabase_jwt_guard_1 = require("../guards/supabase-jwt.guard");
const roles_guard_1 = require("../guards/roles.guard");
const tenant_guard_1 = require("../guards/tenant.guard");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, supabase_jwt_guard_1.SupabaseJwtGuard, roles_guard_1.RolesGuard, tenant_guard_1.TenantGuard],
        exports: [auth_service_1.AuthService, supabase_jwt_guard_1.SupabaseJwtGuard, roles_guard_1.RolesGuard, tenant_guard_1.TenantGuard],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map
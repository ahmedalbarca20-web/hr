"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FingerticWebhook = void 0;
const common_1 = require("@nestjs/common");
let FingerticWebhook = class FingerticWebhook {
    parseAttendanceEvents(payload) {
        if (!payload || typeof payload !== 'object') {
            return [];
        }
        const data = payload;
        if (!Array.isArray(data.events)) {
            return [];
        }
        return data.events
            .map((event) => {
            const biometricUserId = String(event['user_id'] ?? '');
            const timestamp = String(event['timestamp'] ?? '');
            const logType = String(event['log_type'] ?? 'check_in');
            if (!biometricUserId || !timestamp) {
                return null;
            }
            return {
                biometricUserId,
                timestamp,
                logType: logType === 'check_out' ? 'check_out' : 'check_in',
            };
        })
            .filter((entry) => entry !== null);
    }
};
exports.FingerticWebhook = FingerticWebhook;
exports.FingerticWebhook = FingerticWebhook = __decorate([
    (0, common_1.Injectable)()
], FingerticWebhook);
//# sourceMappingURL=fingertic.webhook.js.map
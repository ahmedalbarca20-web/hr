"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./modules/filters/http-exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    app.enableCors();
    app.useGlobalFilters(new http_exception_filter_1.AllExceptionsFilter());
    if (process.env.NODE_ENV !== 'production') {
        const port = process.env.PORT ?? 3114;
        await app.listen(port, '0.0.0.0');
        console.log(`🚀 Server running locally on http://localhost:${port}`);
    }
    await app.init();
    return app.getHttpAdapter().getInstance();
}
const handler = async (req, res) => {
    const instance = await bootstrap();
    instance(req, res);
};
exports.handler = handler;
if (process.env.NODE_ENV !== 'production') {
    bootstrap();
}
//# sourceMappingURL=main.js.map
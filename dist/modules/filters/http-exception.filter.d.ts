import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
export declare class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger;
    private isSupabaseTransportFailure;
    catch(exception: unknown, host: ArgumentsHost): void;
}

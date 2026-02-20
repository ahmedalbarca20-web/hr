import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { supabaseProvider } from './supabase.provider';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [supabaseProvider],
  exports: [supabaseProvider],
})
export class DatabaseModule {}

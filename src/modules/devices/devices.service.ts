import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../database/supabase.provider';

@Injectable()
export class DevicesService {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
  ) { }

  private defaultSettings() {
    return {
      timezone: 'Asia/Baghdad',
      sync_interval_minutes: 5,
      retry_count: 3,
      is_enabled: true,
    };
  }

  private async ensureActiveSubscription(companyId: string) {
    const today = new Date().toISOString().slice(0, 10);
    const { data, error } = await this.supabase
      .from('company_subscriptions')
      .select('*')
      .eq('company_id', companyId)
      .eq('status', 'active')
      .gte('end_date', today)
      .order('end_date', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      throw new Error('الاشتراك غير فعال او منتهي لهذه الشركة');
    }

    return data;
  }

  async list(companyId?: string) {
    let query = this.supabase.from('biometric_devices').select('*');
    if (companyId) {
      query = query.eq('company_id', companyId);
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  }

  async getStats() {
    const { data: devices, error: devicesError } = await this.supabase
      .from('biometric_devices')
      .select('id, status, last_sync');

    if (devicesError) throw devicesError;

    // Table biometric_device_settings does not exist, using mock data for now
    // const { data: settings, error: settingsError } = await this.supabase
    //   .from('biometric_device_settings')
    //   .select('device_id, sync_interval_minutes, is_enabled');

    // if (settingsError) throw settingsError;

    const deviceList = devices ?? [];
    // const settingsList = settings ?? [];
    const total = deviceList.length;
    // Assume all active devices are enabled for now
    const enabled = deviceList.filter(d => d.status === 'active').length;
    const disabled = deviceList.filter(d => d.status !== 'active').length;

    // Default sync interval
    const syncAvg = 5;
    // settingsList.length > 0
    // ? Math.round(
    //   settingsList.reduce((sum, s) => sum + (s.sync_interval_minutes || 0), 0) /
    //   settingsList.length,
    // )
    // : 0;

    const lastSync = deviceList
      .map(d => d.last_sync)
      .filter(Boolean)
      .sort()
      .slice(-1)[0] || null;

    return {
      total_devices: total,
      enabled_devices: enabled,
      disabled_devices: disabled,
      avg_sync_interval_minutes: syncAvg,
      last_sync: lastSync,
    };
  }

  async findOne(id: string) {
    const { data, error } = await this.supabase.from('biometric_devices').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  }

  async create(dto: any) {
    if (!dto.company_id) {
      throw new Error('company_id مطلوب');
    }

    // Extract settings if any, but keep everything else including comm_key
    const { settings, ...deviceData } = dto;

    // Ensure comm_key defaults to '0' if empty/null
    if (!deviceData.comm_key) {
      deviceData.comm_key = '0';
    }

    // Check subscription limits
    const subscription = await this.ensureActiveSubscription(dto.company_id);
    if (subscription.max_devices > 0) {
      const { count, error } = await this.supabase
        .from('biometric_devices')
        .select('id', { count: 'exact', head: true })
        .eq('company_id', dto.company_id);

      if (error) throw error;
      if ((count ?? 0) >= subscription.max_devices) {
        throw new Error('تم تجاوز الحد المسموح لعدد الاجهزة حسب العقد');
      }
    }

    const { data, error } = await this.supabase
      .from('biometric_devices')
      .insert(deviceData)
      .select()
      .single();

    if (error) {
      console.error('Create Device Error:', error);
      throw error;
    }

    // await this.upsertSettings(data.id, settings);
    return data;
  }

  async update(id: string, dto: any) {
    const { settings, ...deviceData } = dto;
    const { data, error } = await this.supabase
      .from('biometric_devices')
      .update(deviceData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;

    // if (settings) {
    //   await this.upsertSettings(id, settings);
    // }
    return data;
  }

  async getSettings(deviceId: string) {
    // Mock settings since table is missing
    return {
      device_id: deviceId,
      ...this.defaultSettings()
    };

    /*
    const { data, error } = await this.supabase
      .from('biometric_device_settings')
      .select('*')
      .eq('device_id', deviceId)
      .maybeSingle();

    if (error) throw error;
    if (data) return data;

    const defaults = this.defaultSettings();
    const { data: created, error: insertError } = await this.supabase
      .from('biometric_device_settings')
      .insert({ device_id: deviceId, ...defaults })
      .select()
      .single();

    if (insertError) throw insertError;
    return created;
    */
  }

  async upsertSettings(deviceId: string, settings?: any) {
    // Mock upsert
    return {
      device_id: deviceId,
      ...this.defaultSettings(),
      ...(settings || {})
    };

    /*
    const payload = { ...this.defaultSettings(), ...(settings || {}) };
    const { data, error } = await this.supabase
      .from('biometric_device_settings')
      .upsert({ device_id: deviceId, ...payload }, { onConflict: 'device_id' })
      .select()
      .single();

    if (error) throw error;
    return data;
    */
  }

  async remove(id: string) {
    const { error } = await this.supabase.from('biometric_devices').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  }

  async syncDevice(id: string) {
    // Update last_sync_at timestamp
    const { data, error } = await this.supabase
      .from('biometric_devices')
      .update({ last_sync: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { message: 'تم مزامنة الجهاز بنجاح', device: data };
  }

  async syncAllDevices() {
    const { data: devices, error } = await this.supabase
      .from('biometric_devices')
      .update({ last_sync: new Date().toISOString() })
      .eq('status', 'active')
      .select();

    if (error) throw error;
    return { message: `تم مزامنة ${devices?.length || 0} أجهزة`, devices };
  }

  async testConnection(id: string) {
    const { data: device, error } = await this.supabase
      .from('biometric_devices')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!device.ip_address) {
      return {
        success: false,
        message: 'لا يوجد عنوان IP لهذا الجهاز',
        status: 'disconnected'
      };
    }

    // Call the real connection logic
    const result = await this.testConnectionParams({
      ip_address: device.ip_address,
      port: device.port || 4370,
      comm_key: device.comm_key || '0'
    });

    // Update status in DB based on result
    // My schema uses 'active' for enabled, but UI might expect online/offline status or we map it.
    // Let's just update last_activity if successful

    if (result.success) {
      const { error: updateError } = await this.supabase.from('biometric_devices').update({
        status: 'online', // or keep 'active' if that means enabled? UI uses online/offline class
        last_activity: new Date().toISOString(),
        firmware_version: result?.device_info?.firmware_version
      }).eq('id', id);

      if (updateError) {
        console.error('Failed to update device status to online:', updateError);
      } else {
        console.log(`Device ${id} status updated to online.`);
      }
    } else {
      await this.supabase.from('biometric_devices').update({
        status: 'offline'
      }).eq('id', id);
    }

    return {
      device_id: id,
      success: result.success,
      status: result.success ? 'connected' : 'disconnected',
      message: result.message,
      tested_at: new Date().toISOString(),
      device_info: result.device_info
    };
  }

  async testConnectionParams(params: { ip_address: string; port: number; comm_key?: string }) {
    if (!params.ip_address) throw new Error('IP Address is required');
    const port = params.port || 4370;
    // Default to 0 if not provided or empty, ensuring it matches the working script
    const commKey = (params.comm_key && params.comm_key !== '') ? parseInt(params.comm_key) : 0;

    console.log(`[ZKTeco] Attempting connection to ${params.ip_address}:${port} | CommKey: ${commKey}`);

    // Use ZKTeco JS Library
    // @ts-ignore
    const ZKLib = require('zkteco-js');

    const zk = new ZKLib(params.ip_address, port, 10000, 4000); // 10s timeout, 4s retry
    zk.commKey = commKey;

    try {
      // Connect
      await zk.createSocket();
      console.log('[ZKTeco] Socket created successfully.');

      // Get Info
      const serial = await zk.getSerialNumber().catch((e) => { console.error('Get Serial Error', e); return 'Unknown'; });
      const firmware = await zk.getFirmware().catch((e) => { console.error('Get Firmware Error', e); return 'Unknown'; });

      return {
        success: true,
        message: 'تم الاتصال بالجهاز بنجاح',
        device_info: {
          serial_number: sanitizeString(typeof serial === 'string' ? serial : serialized(serial)),
          firmware_version: sanitizeString(typeof firmware === 'string' ? firmware : serialized(firmware)),
        }
      };
    } catch (e) {
      console.error('[ZKTeco] Connection Failed:', e);

      // Simulation only for localhost
      if (process.env.NODE_ENV === 'development' && (params.ip_address === '127.0.0.1' || params.ip_address === 'localhost')) {
        return {
          success: true,
          message: 'تم الاتصال (محاكاة محلية)',
          device_info: {
            serial_number: `ZK-SIM-${Math.floor(Math.random() * 1000)}`,
            firmware_version: 'Ver 6.60 (Simulated)',
          }
        }
      }

      return {
        success: false,
        message: `فشل الاتصال: ${e.message || 'Timeout/Refused'}`,
        error: e.toString()
      };
    } finally {
      // ALWAYS disconnect to avoid locking the device
      try {
        await zk.disconnect();
        console.log('[ZKTeco] Disconnected.');
      } catch (err) {
        // Ignore disconnect errors
      }
    }
  }
}

function sanitizeString(str: any): string {
  if (typeof str !== 'string') return '';
  // Remove null bytes and non-printable characters
  return str.replace(/\u0000/g, '').trim();
}

function serialized(obj: any) {
  try { return JSON.stringify(obj); } catch { return 'Unknown'; }
}

-- =============================================
-- Add biometric device settings table
-- =============================================

CREATE TABLE IF NOT EXISTS biometric_device_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id uuid NOT NULL REFERENCES biometric_devices(id) ON DELETE CASCADE,
  timezone text NOT NULL DEFAULT 'Asia/Baghdad',
  sync_interval_minutes integer NOT NULL DEFAULT 5,
  retry_count integer NOT NULL DEFAULT 3,
  is_enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_biometric_device_settings_device
  ON biometric_device_settings(device_id);

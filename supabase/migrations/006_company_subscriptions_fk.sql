-- =============================================
-- Ensure FK between company_subscriptions and companies
-- =============================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'company_subscriptions_company_id_fkey'
  ) THEN
    ALTER TABLE company_subscriptions
      ADD CONSTRAINT company_subscriptions_company_id_fkey
      FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE;
  END IF;
END $$;

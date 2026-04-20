-- Run this in your Supabase SQL editor to add the new flight voucher columns

ALTER TABLE vouchers
  ADD COLUMN IF NOT EXISTS voucher_type TEXT NOT NULL DEFAULT 'hotel',
  ADD COLUMN IF NOT EXISTS flight_name TEXT,
  ADD COLUMN IF NOT EXISTS flight_schedule TEXT;

-- Create bolzano_rp_applications table
CREATE TABLE IF NOT EXISTS bolzano_rp_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Personal Information
  nome_gioco TEXT NOT NULL,
  discord_tag TEXT NOT NULL,
  nome_rp TEXT NOT NULL,
  data_nascita_rp DATE NOT NULL,
  eta INTEGER NOT NULL,
  
  -- RP Knowledge Questions
  failrp_spiegazione TEXT NOT NULL,
  rdm_spiegazione TEXT NOT NULL,
  vdm_spiegazione TEXT NOT NULL,
  metagaming_spiegazione TEXT NOT NULL,
  powergaming_spiegazione TEXT NOT NULL,
  
  -- Personal Questions
  motivo_admin TEXT NOT NULL,
  consapevolezza_responsabilita TEXT NOT NULL,
  
  -- Metadata
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  ip_address TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by TEXT,
  notes TEXT
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_bolzano_applications_status ON bolzano_rp_applications(status);
CREATE INDEX IF NOT EXISTS idx_bolzano_applications_submitted_at ON bolzano_rp_applications(submitted_at DESC);

-- Enable Row Level Security
ALTER TABLE bolzano_rp_applications ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public inserts (for form submissions)
CREATE POLICY "Allow public form submissions" ON bolzano_rp_applications
  FOR INSERT WITH CHECK (true);

-- Create policy for admin reads
CREATE POLICY "Allow admin reads" ON bolzano_rp_applications
  FOR SELECT USING (true);

-- Create policy for admin updates
CREATE POLICY "Allow admin updates" ON bolzano_rp_applications
  FOR UPDATE USING (true);

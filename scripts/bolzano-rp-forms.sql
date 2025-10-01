-- Create table for Bolzano RP admin applications
CREATE TABLE IF NOT EXISTS bolzano_rp_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- Personal Information
  nome_gioco TEXT NOT NULL,
  discord_tag TEXT NOT NULL,
  nome_rp TEXT NOT NULL,
  data_nascita_rp TEXT NOT NULL,
  eta INTEGER NOT NULL,
  
  -- RP Questions
  failrp_spiegazione TEXT NOT NULL,
  rdm_spiegazione TEXT NOT NULL,
  vdm_spiegazione TEXT NOT NULL,
  metagaming_spiegazione TEXT NOT NULL,
  powergaming_spiegazione TEXT NOT NULL,
  cop_baiting_spiegazione TEXT NOT NULL,
  cuff_rushing_spiegazione TEXT NOT NULL,
  azione_violazioni TEXT NOT NULL,
  unrealistic_police_spiegazione TEXT NOT NULL,
  
  -- Discord Questions
  gestione_ticket TEXT NOT NULL,
  procedura_segnalazione TEXT NOT NULL,
  
  -- Personal Questions
  reazione_rifiuto TEXT NOT NULL,
  reazione_accettazione TEXT NOT NULL,
  motivo_admin TEXT NOT NULL,
  consapevolezza_responsabilita TEXT NOT NULL,
  
  -- Metadata
  ip_address TEXT NOT NULL,
  user_agent TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  reviewed_by TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_bolzano_applications_ip ON bolzano_rp_applications(ip_address);
CREATE INDEX IF NOT EXISTS idx_bolzano_applications_status ON bolzano_rp_applications(status);
CREATE INDEX IF NOT EXISTS idx_bolzano_applications_date ON bolzano_rp_applications(submitted_at);

-- Create unique constraint to prevent duplicate submissions from same IP
CREATE UNIQUE INDEX IF NOT EXISTS idx_bolzano_applications_ip_unique ON bolzano_rp_applications(ip_address) WHERE status = 'pending';

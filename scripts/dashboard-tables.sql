-- Create analytics table for tracking site visits
CREATE TABLE IF NOT EXISTS site_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_path TEXT NOT NULL,
  visitor_ip TEXT,
  user_agent TEXT,
  country TEXT,
  city TEXT,
  visit_date DATE NOT NULL DEFAULT CURRENT_DATE,
  visit_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_id TEXT
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_analytics_date ON site_analytics(visit_date);
CREATE INDEX IF NOT EXISTS idx_analytics_page ON site_analytics(page_path);

-- Create discord bots table
CREATE TABLE IF NOT EXISTS discord_bots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'stopped', -- 'running', 'stopped', 'building', 'error'
  environment_vars JSONB DEFAULT '{}'::jsonb,
  main_file TEXT, -- index.js, main.py, etc.
  build_command TEXT,
  start_command TEXT,
  file_content TEXT, -- Store the bot code
  language TEXT DEFAULT 'javascript', -- 'javascript', 'python'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_started TIMESTAMP WITH TIME ZONE,
  last_stopped TIMESTAMP WITH TIME ZONE,
  logs TEXT DEFAULT '' -- Store recent logs
);

-- Create site settings table for sike-gg customization
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_name TEXT DEFAULT 'sike-gg',
  setting_key TEXT NOT NULL,
  setting_value TEXT,
  setting_type TEXT DEFAULT 'text', -- 'text', 'color', 'number', 'boolean'
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings for sike-gg
INSERT INTO site_settings (setting_key, setting_value, setting_type) VALUES
('site_title', 'sike.gg', 'text'),
('site_description', 'Discord Moderation Bot', 'text'),
('primary_color', '#8b5cf6', 'color'),
('secondary_color', '#ec4899', 'color'),
('font_size_base', '16', 'number'),
('show_terms', 'true', 'boolean'),
('discord_invite_url', 'https://discord.com/oauth2/authorize?client_id=1403453249280802911', 'text')
ON CONFLICT DO NOTHING;

-- Create trigger for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_discord_bots_updated_at
BEFORE UPDATE ON discord_bots
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON site_settings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

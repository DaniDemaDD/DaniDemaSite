-- Create maintenance settings table
CREATE TABLE IF NOT EXISTS maintenance_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  route_path TEXT UNIQUE NOT NULL,
  is_maintenance BOOLEAN DEFAULT FALSE,
  maintenance_message TEXT DEFAULT 'This page is currently under maintenance. We apologize for the inconvenience.',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by TEXT DEFAULT 'admin'
);

-- Insert default routes that can be put in maintenance
INSERT INTO maintenance_settings (route_path, is_maintenance) VALUES
('/', FALSE),
('/sike-gg', FALSE),
('/novabot', FALSE),
('/secret1', FALSE),
('/dashboard', FALSE)
ON CONFLICT (route_path) DO NOTHING;

-- Create global maintenance setting
INSERT INTO maintenance_settings (route_path, is_maintenance, maintenance_message) VALUES
('__GLOBAL__', FALSE, 'The entire site is currently under maintenance. We apologize for the inconvenience and will be back soon!')
ON CONFLICT (route_path) DO NOTHING;

-- Create trigger for updating timestamps
CREATE TRIGGER update_maintenance_settings_updated_at
BEFORE UPDATE ON maintenance_settings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

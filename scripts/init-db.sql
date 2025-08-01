-- Create the 'sites' table
CREATE TABLE IF NOT EXISTS sites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID, -- Rimosso REFERENCES users(id) ON DELETE CASCADE
  username TEXT UNIQUE NOT NULL, -- This will be the custom URL path
  profile_image_url TEXT,
  background_image_url TEXT,
  music_url TEXT,
  music_volume REAL DEFAULT 0.5,
  social_links JSONB DEFAULT '[]'::jsonb, -- Stored as JSON array of objects
  tool_links JSONB DEFAULT '[]'::jsonb,   -- Stored as JSON array of objects
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a function to update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update 'updated_at' on 'sites' table
CREATE TRIGGER update_sites_updated_at
BEFORE UPDATE ON sites
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Nota: Se avevi già la tabella 'users', dovrai eliminarla manualmente
-- DROP TABLE IF EXISTS users CASCADE;

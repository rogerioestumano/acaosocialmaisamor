-- Create tables for Mais Amor project

-- Enable RLS (Row Level Security)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Voluntarios table
CREATE TABLE IF NOT EXISTS voluntarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    telefone TEXT NOT NULL,
    idade INTEGER NOT NULL,
    endereco TEXT NOT NULL,
    area TEXT NOT NULL,
    experiencia TEXT,
    disponibilidade TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Beneficiarios table
CREATE TABLE IF NOT EXISTS beneficiarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT NOT NULL,
    email TEXT,
    telefone TEXT NOT NULL,
    idade INTEGER NOT NULL,
    endereco TEXT NOT NULL,
    necessidades TEXT[] NOT NULL DEFAULT '{}',
    observacoes TEXT,
    responsavel TEXT,
    confirmou_presenca BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE voluntarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE beneficiarios ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all for now - can be restricted later)
CREATE POLICY "Allow all operations on voluntarios" ON voluntarios FOR ALL USING (true);
CREATE POLICY "Allow all operations on beneficiarios" ON beneficiarios FOR ALL USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_voluntarios_created_at ON voluntarios(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_beneficiarios_created_at ON beneficiarios(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_voluntarios_area ON voluntarios(area);
CREATE INDEX IF NOT EXISTS idx_beneficiarios_presenca ON beneficiarios(confirmou_presenca);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_voluntarios_updated_at BEFORE UPDATE ON voluntarios 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_beneficiarios_updated_at BEFORE UPDATE ON beneficiarios 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
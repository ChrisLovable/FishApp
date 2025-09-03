-- Add missing columns to logs table
-- Run this in Supabase SQL Editor

-- Add app_version column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'logs'
        AND column_name = 'app_version'
    ) THEN
        ALTER TABLE logs ADD COLUMN app_version text;
        RAISE NOTICE 'Added app_version column to logs table';
    ELSE
        RAISE NOTICE 'app_version column already exists in logs table';
    END IF;
END $$;

-- Add component column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'logs'
        AND column_name = 'component'
    ) THEN
        ALTER TABLE logs ADD COLUMN component text;
        RAISE NOTICE 'Added component column to logs table';
    ELSE
        RAISE NOTICE 'component column already exists in logs table';
    END IF;
END $$;

-- Add severity column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'logs'
        AND column_name = 'severity'
    ) THEN
        ALTER TABLE logs ADD COLUMN severity text DEFAULT 'error';
        RAISE NOTICE 'Added severity column to logs table';
    ELSE
        RAISE NOTICE 'severity column already exists in logs table';
    END IF;
END $$;

-- Add user_email column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'logs'
        AND column_name = 'user_email'
    ) THEN
        ALTER TABLE logs ADD COLUMN user_email text;
        RAISE NOTICE 'Added user_email column to logs table';
    ELSE
        RAISE NOTICE 'user_email column already exists in logs table';
    END IF;
END $$;

-- Add error_type column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'logs'
        AND column_name = 'error_type'
    ) THEN
        ALTER TABLE logs ADD COLUMN error_type text;
        RAISE NOTICE 'Added error_type column to logs table';
    ELSE
        RAISE NOTICE 'error_type column already exists in logs table';
    END IF;
END $$;

-- Add url column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'logs'
        AND column_name = 'url'
    ) THEN
        ALTER TABLE logs ADD COLUMN url text;
        RAISE NOTICE 'Added url column to logs table';
    ELSE
        RAISE NOTICE 'url column already exists in logs table';
    END IF;
END $$;

-- Add user_agent column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'logs'
        AND column_name = 'user_agent'
    ) THEN
        ALTER TABLE logs ADD COLUMN user_agent text;
        RAISE NOTICE 'Added user_agent column to logs table';
    ELSE
        RAISE NOTICE 'user_agent column already exists in logs table';
    END IF;
END $$;

-- Create indexes for the new columns
CREATE INDEX IF NOT EXISTS idx_logs_app_version ON logs(app_version);
CREATE INDEX IF NOT EXISTS idx_logs_component ON logs(component);
CREATE INDEX IF NOT EXISTS idx_logs_severity ON logs(severity);
CREATE INDEX IF NOT EXISTS idx_logs_user_email ON logs(user_email);
CREATE INDEX IF NOT EXISTS idx_logs_error_type ON logs(error_type);

-- Add comments for the new columns
COMMENT ON COLUMN logs.app_version IS 'App version when error occurred';
COMMENT ON COLUMN logs.component IS 'React component where error occurred';
COMMENT ON COLUMN logs.severity IS 'Error severity (error, warning, info)';
COMMENT ON COLUMN logs.user_email IS 'User email if available';
COMMENT ON COLUMN logs.error_type IS 'Type of error (JavaScript, Network, etc.)';
COMMENT ON COLUMN logs.url IS 'URL where error occurred';
COMMENT ON COLUMN logs.user_agent IS 'Browser/device information';

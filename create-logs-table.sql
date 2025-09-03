-- Create logs table for error tracking
-- Run this in Supabase SQL Editor

    CREATE TABLE IF NOT EXISTS logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamp DEFAULT now(),
    user_email text,
    message text,
    stack text,
    url text,
    user_agent text,
    error_type text,
    component text,
    severity text DEFAULT 'error',
    app_version text
    );

    -- Create indexes for better performance
    CREATE INDEX IF NOT EXISTS idx_logs_created_at ON logs(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_logs_user_email ON logs(user_email);
    CREATE INDEX IF NOT EXISTS idx_logs_severity ON logs(severity);
    CREATE INDEX IF NOT EXISTS idx_logs_component ON logs(component);
    CREATE INDEX IF NOT EXISTS idx_logs_app_version ON logs(app_version);

    -- Enable Row Level Security (RLS)
    ALTER TABLE logs ENABLE ROW LEVEL SECURITY;

    -- Create policy to allow all operations (since we're using email-based auth)
    CREATE POLICY "Allow all operations on logs" ON logs
    FOR ALL USING (true);

    -- Add some helpful comments
    COMMENT ON TABLE logs IS 'Application error logs and crash reports';
    COMMENT ON COLUMN logs.user_email IS 'User email if available';
    COMMENT ON COLUMN logs.message IS 'Error message';
    COMMENT ON COLUMN logs.stack IS 'Error stack trace';
    COMMENT ON COLUMN logs.url IS 'URL where error occurred';
    COMMENT ON COLUMN logs.user_agent IS 'Browser/device information';
    COMMENT ON COLUMN logs.error_type IS 'Type of error (JavaScript, Network, etc.)';
    COMMENT ON COLUMN logs.component IS 'React component where error occurred';
    COMMENT ON COLUMN logs.severity IS 'Error severity (error, warning, info)';
    COMMENT ON COLUMN logs.app_version IS 'App version when error occurred';

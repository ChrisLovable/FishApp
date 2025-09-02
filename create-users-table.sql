-- Create users table for email verification and PWA onboarding
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  verification_code VARCHAR(6),
  verification_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  pwa_installed BOOLEAN DEFAULT FALSE,
  device_info JSONB,
  app_version VARCHAR(50) DEFAULT '1.0.0'
);

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_verification_code ON users(verification_code);

-- Create function to clean up expired verification codes
CREATE OR REPLACE FUNCTION cleanup_expired_verifications()
RETURNS void AS $$
BEGIN
  UPDATE users 
  SET verification_code = NULL, verification_expires_at = NULL
  WHERE verification_expires_at < NOW() AND email_verified = FALSE;
END;
$$ LANGUAGE plpgsql;

-- Create function to generate verification code
CREATE OR REPLACE FUNCTION generate_verification_code()
RETURNS VARCHAR(6) AS $$
BEGIN
  RETURN LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Create function to verify user email
CREATE OR REPLACE FUNCTION verify_user_email(user_email VARCHAR, code VARCHAR(6))
RETURNS JSON AS $$
DECLARE
  user_record users%ROWTYPE;
  result JSON;
BEGIN
  -- Find user with matching email and code
  SELECT * INTO user_record 
  FROM users 
  WHERE email = user_email 
    AND verification_code = code 
    AND verification_expires_at > NOW()
    AND email_verified = FALSE;
  
  IF user_record.id IS NULL THEN
    result := json_build_object(
      'success', false,
      'message', 'Invalid or expired verification code'
    );
  ELSE
    -- Update user as verified
    UPDATE users 
    SET email_verified = TRUE, 
        verification_code = NULL, 
        verification_expires_at = NULL,
        updated_at = NOW()
    WHERE id = user_record.id;
    
    result := json_build_object(
      'success', true,
      'message', 'Email verified successfully',
      'user_id', user_record.id
    );
  END IF;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create function to register new user
CREATE OR REPLACE FUNCTION register_user(user_email VARCHAR)
RETURNS JSON AS $$
DECLARE
  existing_user users%ROWTYPE;
  new_verification_code VARCHAR(6);
  result JSON;
BEGIN
  -- Check if user already exists
  SELECT * INTO existing_user FROM users WHERE email = user_email;
  
  IF existing_user.id IS NOT NULL THEN
    IF existing_user.email_verified = TRUE THEN
      result := json_build_object(
        'success', false,
        'message', 'Email already verified. You can proceed to use the app.'
      );
    ELSE
      -- Generate new verification code for existing unverified user
      new_verification_code := generate_verification_code();
      UPDATE users 
      SET verification_code = new_verification_code,
          verification_expires_at = NOW() + INTERVAL '15 minutes',
          updated_at = NOW()
      WHERE id = existing_user.id;
      
      result := json_build_object(
        'success', true,
        'message', 'New verification code sent',
        'verification_code', new_verification_code
      );
    END IF;
  ELSE
    -- Create new user
    new_verification_code := generate_verification_code();
    INSERT INTO users (email, verification_code, verification_expires_at)
    VALUES (user_email, new_verification_code, NOW() + INTERVAL '15 minutes');
    
    result := json_build_object(
      'success', true,
      'message', 'User registered successfully',
      'verification_code', new_verification_code
    );
  END IF;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create function to update PWA installation status
CREATE OR REPLACE FUNCTION update_pwa_status(user_email VARCHAR, installed BOOLEAN, device_info JSONB DEFAULT NULL)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  UPDATE users 
  SET pwa_installed = installed,
      device_info = COALESCE(device_info, users.device_info),
      updated_at = NOW()
  WHERE email = user_email AND email_verified = TRUE;
  
  IF FOUND THEN
    result := json_build_object(
      'success', true,
      'message', 'PWA status updated successfully'
    );
  ELSE
    result := json_build_object(
      'success', false,
      'message', 'User not found or not verified'
    );
  END IF;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy for users to read their own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Create policy for users to update their own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Create policy for anonymous users to insert (for registration)
CREATE POLICY "Anonymous users can register" ON users
  FOR INSERT WITH CHECK (true);

-- Add comments for documentation
COMMENT ON TABLE users IS 'User accounts with email verification for PWA onboarding';
COMMENT ON COLUMN users.verification_code IS '6-digit OTP for email verification';
COMMENT ON COLUMN users.verification_expires_at IS 'Verification code expiration time (15 minutes)';
COMMENT ON COLUMN users.pwa_installed IS 'Whether user has installed the PWA';
COMMENT ON COLUMN users.device_info IS 'JSON object containing device/browser information';

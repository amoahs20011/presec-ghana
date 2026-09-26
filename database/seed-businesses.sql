-- ===================================================================
-- PRESEC GHANA — Seed: Sample Alumni Businesses
-- ===================================================================

DO $$
DECLARE
    v_kofi_id UUID;
BEGIN
    SELECT id INTO v_kofi_id FROM users WHERE email = 'kofi@presecghana.org';

    IF v_kofi_id IS NOT NULL THEN
        INSERT INTO businesses (
            owner_id, name, description, industry, location,
            website, phone, email, is_verified, is_active
        ) VALUES
        (
            v_kofi_id,
            'Kofi Tech Solutions',
            'Software development, IT consulting, and digital transformation services for businesses in Ghana.',
            'Information Technology',
            'Accra, Ghana',
            'https://kofitech.example.com',
            '+233 24 123 4567',
            'info@kofitech.example.com',
            FALSE, TRUE
        )
        ON CONFLICT DO NOTHING;
    END IF;

    RAISE NOTICE 'Inserted sample businesses';
END $$;

-- Verify
SELECT name, industry, location FROM businesses;

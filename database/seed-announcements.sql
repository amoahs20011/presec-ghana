-- ===================================================================
-- PRESEC GHANA — Seed: Sample Announcements
-- ===================================================================

DO $$
DECLARE
    v_school_id UUID;
    v_super_admin_id UUID;
BEGIN
    SELECT id INTO v_school_id FROM schools WHERE code = 'PRESEC-TC11';
    SELECT id INTO v_super_admin_id FROM users WHERE role = 'super_admin' LIMIT 1;

    INSERT INTO announcements (
        school_id, type, title, content, is_public, is_pinned, published_by
    ) VALUES
    (
        v_school_id, 'announcement',
        'Welcome to PRESEC GHANA',
        'We are excited to launch the official digital platform for the PRESEC community. Register today to connect with fellow alumni, find opportunities, and support our school.',
        TRUE, TRUE, v_super_admin_id
    ),
    (
        v_school_id, 'event',
        '2008 Year Group Reunion — Save the Date',
        'The 2008 Year Group is planning a reunion for December 2026. More details coming soon. Contact the year group leadership for information.',
        TRUE, FALSE, v_super_admin_id
    ),
    (
        v_school_id, 'achievement',
        'PRESEC Alumni Shine in National Exams',
        'We are proud to announce that several PRESEC alumni have excelled in recent national examinations, with many gaining admission to top universities.',
        TRUE, FALSE, v_super_admin_id
    ),
    (
        v_school_id, 'news',
        'Computer Lab Renovation Nears Completion',
        'Thanks to generous alumni donations, the Computer Lab Renovation Project has reached 62% of its fundraising goal. We need your support to complete this important project.',
        TRUE, FALSE, v_super_admin_id
    )
    ON CONFLICT DO NOTHING;

    RAISE NOTICE 'Inserted sample announcements';
END $$;

-- Verify
SELECT type, title, is_pinned FROM announcements ORDER BY created_at DESC;

-- ===================================================================
-- PRESEC GHANA — Seed: Sample Development Projects
-- ===================================================================

-- Get the school ID (assumes PRESEC Tema C11 is the only school)
DO $$
DECLARE
    v_school_id UUID;
    v_super_admin_id UUID;
BEGIN
    SELECT id INTO v_school_id FROM schools WHERE code = 'PRESEC-TC11';
    SELECT id INTO v_super_admin_id FROM users WHERE role = 'super_admin' LIMIT 1;

    INSERT INTO projects (
        school_id, title, description, category,
        target_amount, raised_amount, currency,
        start_date, target_completion_date, status,
        progress_percentage, is_public, created_by
    ) VALUES
    (
        v_school_id,
        'Computer Laboratory Renovation',
        'Renovating the existing computer lab with new computers, air conditioning, and modern furniture to support ICT education for over 500 students.',
        'infrastructure',
        200000.00, 125000.00, 'GHS',
        '2026-01-15', '2026-12-31', 'active',
        62, TRUE, v_super_admin_id
    ),
    (
        v_school_id,
        'Library Expansion Project',
        'Expanding the school library with additional shelving, 2,000 new books, and a digital reading section.',
        'academic',
        150000.00, 45000.00, 'GHS',
        '2026-03-01', '2027-06-30', 'active',
        30, TRUE, v_super_admin_id
    ),
    (
        v_school_id,
        'Sports Equipment & Field Upgrade',
        'New footballs, jerseys, and renovation of the school sports field with proper drainage.',
        'sports',
        80000.00, 60000.00, 'GHS',
        '2026-02-01', '2026-10-31', 'active',
        75, TRUE, v_super_admin_id
    ),
    (
        v_school_id,
        'Clean Water Project',
        'Installation of a borehole and water storage system to provide reliable clean water for the school.',
        'infrastructure',
        120000.00, 120000.00, 'GHS',
        '2025-06-01', '2026-03-31', 'completed',
        100, TRUE, v_super_admin_id
    )
    ON CONFLICT DO NOTHING;

    RAISE NOTICE 'Inserted sample projects';
END $$;

-- Verify
SELECT title, target_amount, raised_amount, progress_percentage, status
FROM projects ORDER BY created_at DESC;

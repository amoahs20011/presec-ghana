const { Client } = require('pg');
const bcrypt = require('bcrypt');

async function seed() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'presec_admin',
    password: 'Bosomtswi@1',
    database: 'presec_ghana',
  });

  await client.connect();
  console.log('Connected to database');

  // Get the school ID
  const schoolRes = await client.query('SELECT id FROM schools LIMIT 1');
  if (schoolRes.rows.length === 0) {
    console.error('No schools found. Run seed.sql first.');
    await client.end();
    return;
  }
  const schoolId = schoolRes.rows[0].id;

  // Create sample alumni users
  const passwordHash = await bcrypt.hash('TestPass123!', 12);

  const alumniUsers = [
    {
      email: 'kwame@presecghana.org',
      firstName: 'Kwame',
      lastName: 'Mensah',
      graduationYear: 2008,
      programme: 'General Science',
      profession: 'Software Engineer',
      employer: 'TechCorp Ghana',
      industry: 'Information Technology',
      city: 'Accra',
      country: 'Ghana',
      skills: ['JavaScript', 'Node.js', 'PostgreSQL'],
      bio: 'Passionate software engineer and PRESEC alumnus.',
      mentorship: true,
    },
    {
      email: 'ama@presecghana.org',
      firstName: 'Ama',
      lastName: 'Boateng',
      graduationYear: 2015,
      programme: 'General Science',
      profession: 'Medical Doctor',
      employer: 'Korle-Bu Teaching Hospital',
      industry: 'Healthcare',
      city: 'Accra',
      country: 'Ghana',
      skills: ['Medicine', 'Surgery', 'Research'],
      bio: 'Medical doctor passionate about community health.',
      mentorship: true,
    },
    {
      email: 'kofi@presecghana.org',
      firstName: 'Kofi',
      lastName: 'Asante',
      graduationYear: 1999,
      programme: 'Business',
      profession: 'Entrepreneur',
      employer: 'Asante Enterprises',
      industry: 'Business',
      city: 'Tema',
      country: 'Ghana',
      skills: ['Business', 'Leadership', 'Finance'],
      bio: 'Serial entrepreneur and business mentor.',
      mentorship: true,
    },
    {
      email: 'akosua@presecghana.org',
      firstName: 'Akosua',
      lastName: 'Owusu',
      graduationYear: 2012,
      programme: 'General Arts',
      profession: 'Lawyer',
      employer: 'Owusu & Partners',
      industry: 'Legal',
      city: 'Kumasi',
      country: 'Ghana',
      skills: ['Law', 'Litigation', 'Corporate Law'],
      bio: 'Corporate lawyer and legal advisor.',
      mentorship: false,
    },
  ];

  for (const u of alumniUsers) {
    // Check if user exists
    const existing = await client.query(
      'SELECT id FROM users WHERE email = $1',
      [u.email],
    );
    if (existing.rows.length > 0) {
      console.log(`User ${u.email} already exists, skipping`);
      continue;
    }

    // Create user
    const userRes = await client.query(
      `INSERT INTO users 
        (email, password_hash, first_name, last_name, role, is_active, is_verified)
       VALUES ($1, $2, $3, $4, 'alumni', true, true)
       RETURNING id`,
      [u.email, passwordHash, u.firstName, u.lastName],
    );
    const userId = userRes.rows[0].id;

    // Create alumni profile
    await client.query(
      `INSERT INTO alumni_profiles 
        (user_id, school_id, graduation_year, programme, current_profession,
         current_employer, industry, location_city, location_country,
         skills, bio, is_available_for_mentorship, verification_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'verified')`,
      [
        userId,
        schoolId,
        u.graduationYear,
        u.programme,
        u.profession,
        u.employer,
        u.industry,
        u.city,
        u.country,
        u.skills,
        u.bio,
        u.mentorship,
      ],
    );

    console.log(`✓ Created: ${u.firstName} ${u.lastName} (${u.email})`);
  }

  console.log('\n✅ Seed complete!');
  console.log('Test credentials for all users:');
  console.log('Password: TestPass123!');
  console.log('Emails: kwame@presecghana.org, ama@presecghana.org, kofi@presecghana.org, akosua@presecghana.org');

  await client.end();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});

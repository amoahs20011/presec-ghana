require('dotenv').config();
const { Client } = require('pg');

async function seed() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USERNAME || 'presec_admin',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE || 'presec_ghana',
  });

  await client.connect();
  console.log('Connected to database\n');

  // Get school ID
  const schoolRes = await client.query('SELECT id FROM schools LIMIT 1');
  const schoolId = schoolRes.rows[0]?.id;
  if (!schoolId) {
    console.error('No school found');
    await client.end();
    return;
  }

  // Get a user ID for created_by
  const userRes = await client.query(
    "SELECT id FROM users WHERE email = 'kwame@presecghana.org' LIMIT 1",
  );
  const creatorId = userRes.rows[0]?.id;

  // ============ EVENTS ============
  console.log('=== Seeding Events ===');
  const events = [
    {
      title: 'PRESEC 2008 Year Group Reunion',
      description:
        'Join us for a memorable evening reconnecting with classmates from the Class of 2008. Enjoy dinner, entertainment, and relive the good old days together.',
      eventType: 'reunion',
      startDate: '2026-12-20 18:00:00',
      endDate: '2026-12-20 23:00:00',
      locationName: 'Accra International Conference Centre',
      locationAddress: 'Castle Road, Osu, Accra',
      maxAttendees: 200,
      ticketPrice: 50,
    },
    {
      title: 'PRESEC GHANA Annual Homecoming 2027',
      description:
        'All alumni across generations are invited back to campus for our annual homecoming. Meet current students, tour the campus, and celebrate our shared heritage.',
      eventType: 'homecoming',
      startDate: '2027-02-15 09:00:00',
      endDate: '2027-02-15 17:00:00',
      locationName: 'PRESEC Tema Community 11 Campus',
      locationAddress: 'Community 11, Tema, Greater Accra',
      maxAttendees: 500,
      ticketPrice: 0,
    },
    {
      title: 'Alumni Career Fair 2026',
      description:
        'Connect with alumni employers, learn about career opportunities, and network with professionals across industries.',
      eventType: 'get_together',
      startDate: '2026-11-10 10:00:00',
      endDate: '2026-11-10 16:00:00',
      locationName: 'Kempinski Hotel Gold Coast City',
      locationAddress: 'Ministries, Accra',
      maxAttendees: 300,
      ticketPrice: 25,
    },
  ];

  for (const e of events) {
    const existing = await client.query(
      'SELECT id FROM events WHERE title = $1',
      [e.title],
    );
    if (existing.rows.length > 0) {
      console.log(`  ⏭ Event exists: ${e.title}`);
      continue;
    }
    await client.query(
      `INSERT INTO events 
        (title, description, event_type, school_id, start_datetime, end_datetime,
         location_name, location_address, max_attendees, ticket_price, currency,
         is_public, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'GHS', true, $11)`,
      [
        e.title,
        e.description,
        e.eventType,
        schoolId,
        e.startDate,
        e.endDate,
        e.locationName,
        e.locationAddress,
        e.maxAttendees,
        e.ticketPrice,
        creatorId,
      ],
    );
    console.log(`  ✓ Created: ${e.title}`);
  }

  // ============ PROJECTS ============
  console.log('\n=== Seeding Projects ===');
  const projects = [
    {
      title: 'Computer Laboratory Renovation',
      description:
        'Modernize the school computer lab with 40 new workstations, high-speed internet, and updated software for students.',
      category: 'infrastructure',
      targetAmount: 200000,
      raisedAmount: 125000,
      status: 'active',
    },
    {
      title: 'Library Expansion Project',
      description:
        'Expand the school library with additional shelving, 2,000 new books, and a digital reading section.',
      category: 'academic',
      targetAmount: 150000,
      raisedAmount: 45000,
      status: 'active',
    },
    {
      title: 'Sports Equipment & Field Upgrade',
      description:
        'Upgrade sports facilities including a new football pitch, basketball court, and modern equipment for all sports teams.',
      category: 'sports',
      targetAmount: 80000,
      raisedAmount: 60000,
      status: 'active',
    },
    {
      title: 'Science Laboratory Equipment',
      description:
        'Purchase modern science equipment for Physics, Chemistry, and Biology labs to enhance practical learning.',
      category: 'academic',
      targetAmount: 120000,
      raisedAmount: 120000,
      status: 'completed',
    },
  ];

  for (const p of projects) {
    const existing = await client.query(
      'SELECT id FROM projects WHERE title = $1',
      [p.title],
    );
    if (existing.rows.length > 0) {
      console.log(`  ⏭ Project exists: ${p.title}`);
      continue;
    }
    await client.query(
      `INSERT INTO projects 
        (title, description, category, school_id, target_amount, raised_amount,
         currency, status, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, 'GHS', $7, $8)`,
      [
        p.title,
        p.description,
        p.category,
        schoolId,
        p.targetAmount,
        p.raisedAmount,
        p.status,
        creatorId,
      ],
    );
    console.log(`  ✓ Created: ${p.title}`);
  }

  // ============ ANNOUNCEMENTS / NEWS ============
  console.log('\n=== Seeding Announcements ===');
  const announcements = [
    {
      type: 'news',
      title: 'Welcome to PRESEC GHANA',
      content:
        'We are thrilled to launch the official digital platform for the PRESEC community. Register today to connect with fellow alumni, find opportunities, and support our school. Together we build a stronger, more connected PRESEC family.',
      isPinned: true,
    },
    {
      type: 'achievement',
      title: 'PRESEC Alumni Shine in National Exams',
      content:
        'We are proud to announce that several PRESEC alumni have excelled in recent national examinations, with many gaining admission to top universities in Ghana and abroad. Congratulations to all!',
      isPinned: true,
    },
    {
      type: 'news',
      title: 'Computer Lab Renovation Nears Completion',
      content:
        'Thanks to generous alumni donations, the Computer Lab Renovation Project has reached 62% of its fundraising goal. We need your support to complete this important project.',
      isPinned: false,
    },
    {
      type: 'news',
      title: 'New Mentorship Program Launched',
      content:
        'Our mentorship program is now live. Alumni can register as mentors to guide younger alumni and current students in their careers.',
      isPinned: false,
    },
    {
      type: 'achievement',
      title: 'PRESEC Wins Regional Debate Championship',
      content:
        'Our current students have won the Greater Accra Regional Debate Championship. This is a proud moment for the entire PRESEC community.',
      isPinned: false,
    },
  ];

  for (const a of announcements) {
    const existing = await client.query(
      'SELECT id FROM announcements WHERE title = $1',
      [a.title],
    );
    if (existing.rows.length > 0) {
      console.log(`  ⏭ Announcement exists: ${a.title}`);
      continue;
    }
    await client.query(
      `INSERT INTO announcements 
        (type, title, content, school_id, is_pinned, published_by)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [a.type, a.title, a.content, schoolId, a.isPinned, creatorId],
    );
    console.log(`  ✓ Created: ${a.title}`);
  }

  // ============ BUSINESSES ============
  console.log('\n=== Seeding Businesses ===');
  const businesses = [
    {
      name: 'TechCorp Ghana',
      description:
        'Full-service software development and IT consulting for businesses in West Africa.',
      industry: 'Information Technology',
      location: 'Accra, Ghana',
      website: 'https://techcorp.gh',
      ownerEmail: 'kwame@presecghana.org',
    },
    {
      name: 'Asante Enterprises',
      description:
        'Leading import/export business specializing in construction materials and equipment.',
      industry: 'Logistics',
      location: 'Tema, Ghana',
      website: 'https://asante-enterprises.gh',
      ownerEmail: 'kofi@presecghana.org',
    },
    {
      name: 'Owusu Legal Consult',
      description:
        'Corporate law firm providing legal advisory services to businesses and individuals.',
      industry: 'Legal',
      location: 'Kumasi, Ghana',
      website: null,
      ownerEmail: 'akosua@presecghana.org',
    },
  ];

  for (const b of businesses) {
    const existing = await client.query(
      'SELECT id FROM businesses WHERE name = $1',
      [b.name],
    );
    if (existing.rows.length > 0) {
      console.log(`  ⏭ Business exists: ${b.name}`);
      continue;
    }
    const ownerRes = await client.query(
      'SELECT id FROM users WHERE email = $1',
      [b.ownerEmail],
    );
    if (ownerRes.rows.length === 0) continue;

    await client.query(
      `INSERT INTO businesses 
        (name, description, industry, location, website, owner_id, is_verified, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, true, true)`,
      [b.name, b.description, b.industry, b.location, b.website, ownerRes.rows[0].id],
    );
    console.log(`  ✓ Created: ${b.name}`);
  }

  // ============ OPPORTUNITIES ============
  console.log('\n=== Seeding Opportunities ===');
  const opportunities = [
    {
      type: 'job',
      title: 'Senior Software Engineer',
      description:
        'Looking for an experienced engineer to lead backend development. Must have 5+ years with Node.js, TypeScript, and PostgreSQL.',
      companyName: 'TechCorp Ghana',
      location: 'Accra, Ghana',
      industry: 'Information Technology',
      jobType: 'full_time',
      salaryRange: 'GHS 15,000 - 25,000 monthly',
      deadline: '2026-11-30',
    },
    {
      type: 'internship',
      title: 'Software Engineering Internship',
      description:
        'Summer internship program for current university students. Work on real projects with senior engineers.',
      companyName: 'TechCorp Ghana',
      location: 'Accra, Ghana',
      industry: 'Information Technology',
      jobType: 'internship',
      salaryRange: 'GHS 2,500 monthly stipend',
      deadline: '2026-10-15',
    },
    {
      type: 'scholarship',
      title: 'PRESEC Alumni Merit Scholarship 2027',
      description:
        'Full scholarship for outstanding PRESEC graduates pursuing STEM degrees at Ghanaian universities.',
      companyName: 'PRESEC Alumni Association',
      location: 'Ghana',
      industry: 'Education',
      jobType: null,
      salaryRange: 'Full tuition + GHS 5,000/year stipend',
      deadline: '2026-12-31',
    },
    {
      type: 'training',
      title: 'Digital Marketing Bootcamp',
      description:
        'Free 8-week bootcamp for PRESEC alumni interested in digital marketing careers.',
      companyName: 'PRESEC GHANA',
      location: 'Online',
      industry: 'Marketing',
      jobType: null,
      salaryRange: null,
      deadline: '2026-11-15',
    },
  ];

  for (const o of opportunities) {
    const existing = await client.query(
      'SELECT id FROM opportunities WHERE title = $1',
      [o.title],
    );
    if (existing.rows.length > 0) {
      console.log(`  ⏭ Opportunity exists: ${o.title}`);
      continue;
    }
    await client.query(
      `INSERT INTO opportunities 
        (type, title, description, company_name, location, industry, job_type,
         salary_range, deadline, posted_by, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true)`,
      [
        o.type,
        o.title,
        o.description,
        o.companyName,
        o.location,
        o.industry,
        o.jobType,
        o.salaryRange,
        o.deadline,
        creatorId,
      ],
    );
    console.log(`  ✓ Created: ${o.title}`);
  }

  console.log('\n✅ Content seed complete!');
  await client.end();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});

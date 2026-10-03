require('dotenv').config();
const { Client } = require('pg');

async function seed() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log('Connected to Render DB\n');

  const regions = [
    { name: 'Greater Accra', code: 'GA' },
    { name: 'Ashanti', code: 'AS' },
    { name: 'Central', code: 'CE' },
    { name: 'Eastern', code: 'EA' },
    { name: 'Western', code: 'WE' },
    { name: 'Western North', code: 'WN' },
    { name: 'Volta', code: 'VO' },
    { name: 'Oti', code: 'OT' },
    { name: 'Northern', code: 'NO' },
    { name: 'Savannah', code: 'SA' },
    { name: 'North East', code: 'NE' },
    { name: 'Upper East', code: 'UE' },
    { name: 'Upper West', code: 'UW' },
    { name: 'Bono', code: 'BO' },
    { name: 'Bono East', code: 'BE' },
    { name: 'Ahafo', code: 'AH' },
  ];

  console.log('=== Seeding Regions ===');
  for (const r of regions) {
    const existing = await client.query(
      'SELECT id FROM regions WHERE code = $1',
      [r.code],
    );
    if (existing.rows.length > 0) {
      console.log(`  ⏭ Region exists: ${r.name}`);
      continue;
    }
    await client.query(
      'INSERT INTO regions (name, code) VALUES ($1, $2)',
      [r.name, r.code],
    );
    console.log(`  ✓ Created: ${r.name}`);
  }

  console.log('\n=== Seeding Districts + Schools ===');
  const sampleSchools = [
    { region: 'Greater Accra', district: 'Tema', districtCode: 'GA-TEMA', schoolName: 'PRESEC Tema Community 11', schoolCode: 'PRESEC-TC11' },
    { region: 'Ashanti', district: 'Kumasi', districtCode: 'AS-KUM', schoolName: 'PRESEC Kumasi', schoolCode: 'PRESEC-KUM' },
    { region: 'Central', district: 'Cape Coast', districtCode: 'CE-CC', schoolName: 'PRESEC Cape Coast', schoolCode: 'PRESEC-CC' },
    { region: 'Eastern', district: 'Koforidua', districtCode: 'EA-KF', schoolName: 'PRESEC Koforidua', schoolCode: 'PRESEC-KF' },
    { region: 'Western', district: 'Sekondi-Takoradi', districtCode: 'WE-ST', schoolName: 'PRESEC Sekondi', schoolCode: 'PRESEC-ST' },
    { region: 'Volta', district: 'Ho', districtCode: 'VO-HO', schoolName: 'PRESEC Ho', schoolCode: 'PRESEC-HO' },
    { region: 'Northern', district: 'Tamale', districtCode: 'NO-TAM', schoolName: 'PRESEC Tamale', schoolCode: 'PRESEC-TAM' },
    { region: 'Upper East', district: 'Bolgatanga', districtCode: 'UE-BOL', schoolName: 'PRESEC Bolgatanga', schoolCode: 'PRESEC-BOL' },
    { region: 'Upper West', district: 'Wa', districtCode: 'UW-WA', schoolName: 'PRESEC Wa', schoolCode: 'PRESEC-WA' },
    { region: 'Bono', district: 'Sunyani', districtCode: 'BO-SUN', schoolName: 'PRESEC Sunyani', schoolCode: 'PRESEC-SUN' },
  ];

  for (const s of sampleSchools) {
    // Get region
    const regionRes = await client.query(
      'SELECT id FROM regions WHERE name = $1',
      [s.region],
    );
    if (regionRes.rows.length === 0) continue;
    const regionId = regionRes.rows[0].id;

    // Get or create district
    let districtId;
    const districtRes = await client.query(
      'SELECT id FROM districts WHERE code = $1',
      [s.districtCode],
    );
    if (districtRes.rows.length > 0) {
      districtId = districtRes.rows[0].id;
    } else {
      const ins = await client.query(
        'INSERT INTO districts (region_id, name, code) VALUES ($1, $2, $3) RETURNING id',
        [regionId, s.district, s.districtCode],
      );
      districtId = ins.rows[0].id;
      console.log(`  ✓ District: ${s.district}`);
    }

    // Get or create school
    const schoolRes = await client.query(
      'SELECT id FROM schools WHERE code = $1',
      [s.schoolCode],
    );
    if (schoolRes.rows.length > 0) {
      console.log(`  ⏭ School exists: ${s.schoolName}`);
      continue;
    }
    await client.query(
      `INSERT INTO schools (district_id, name, code, type, is_active)
       VALUES ($1, $2, $3, 'mixed', true)`,
      [districtId, s.schoolName, s.schoolCode],
    );
    console.log(`  ✓ School: ${s.schoolName}`);
  }

  console.log('\n✅ Regions + districts + schools complete!');
  await client.end();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});

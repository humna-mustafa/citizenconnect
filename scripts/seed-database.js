// Seed the database with sample data
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://tstzrjdxzvepdiaxmllf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzdHpyamR4enZlcGRpYXhtbGxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2NzUxNTEsImV4cCI6MjA4MDI1MTE1MX0.3sNOf7ueidGrnM_CpYWRUllJLnOieFLx7t1JAJGrZ2o';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seedDatabase() {
  console.log('🌱 Starting database seeding...\n');

  // Check if data already exists
  const { data: existingCategories } = await supabase.from('categories').select('id').limit(1);
  if (existingCategories && existingCategories.length > 0) {
    console.log('✅ Categories already seeded (from migration)');
  }

  const { data: existingGuides } = await supabase.from('guides').select('id').limit(1);
  if (existingGuides && existingGuides.length > 0) {
    console.log('✅ Guides already exist');
  } else {
    // Get category IDs first
    const { data: categories } = await supabase.from('categories').select('id, slug');
    const catMap = {};
    categories?.forEach(c => catMap[c.slug] = c.id);

    // Insert sample guides
    const guides = [
      {
        title: 'How to Get CNIC (National ID Card)',
        slug: 'get-cnic-pakistan',
        category_id: catMap['roads-transport'],
        problem_explanation: 'Complete guide to obtaining your Computerized National Identity Card (CNIC) from NADRA.',
        steps: [
          { number: 1, title: 'Gather Required Documents', description: 'Before visiting NADRA, collect all necessary documents including B-Form, parent CNICs, and photos.' },
          { number: 2, title: 'Visit NADRA Center', description: 'Go to your nearest NADRA Registration Center during working hours.' },
          { number: 3, title: 'Fill Application Form', description: 'Complete the CNIC application form with accurate information.' },
          { number: 4, title: 'Biometric Verification', description: 'Your fingerprints and photo will be taken.' },
          { number: 5, title: 'Pay Fee and Collect Receipt', description: 'Pay the fee and keep your receipt safe for collection.' },
          { number: 6, title: 'Collect Your CNIC', description: 'Return to collect your CNIC in 15-30 working days.' }
        ],
        required_documents: ['Original B-Form', 'Parent CNIC copies', '2 passport photos', 'Utility bill for address proof'],
        contact_phones: ['111-786-100'],
        timeline_expectation: '15-30 working days',
        is_published: true,
        views_count: 245,
        upvotes_count: 42
      },
      {
        title: 'How to Apply for Pakistani Passport',
        slug: 'apply-for-passport',
        category_id: catMap['roads-transport'],
        problem_explanation: 'Step-by-step process to apply for Pakistani passport online and offline.',
        steps: [
          { number: 1, title: 'Register Online', description: 'Visit passport.gov.pk and create an account.' },
          { number: 2, title: 'Fill Online Form', description: 'Complete the passport application form online.' },
          { number: 3, title: 'Upload Documents', description: 'Scan and upload required documents.' },
          { number: 4, title: 'Book Appointment', description: 'Select date and time for biometric verification.' },
          { number: 5, title: 'Visit Passport Office', description: 'Go to passport office on scheduled date with original documents.' },
          { number: 6, title: 'Pay Fee', description: 'Pay passport fee and collect token.' },
          { number: 7, title: 'Receive Passport', description: 'Collect passport or opt for home delivery.' }
        ],
        required_documents: ['CNIC copy', 'Birth certificate', '4 passport photos', 'Fee challan'],
        contact_phones: ['051-111-243-243'],
        timeline_expectation: '15-21 working days',
        is_published: true,
        views_count: 189,
        upvotes_count: 35
      },
      {
        title: 'Electricity Bill Complaint Process',
        slug: 'electricity-complaint',
        category_id: catMap['electricity-gas'],
        problem_explanation: 'How to file a formal complaint against electricity overbilling or wrong meter reading.',
        steps: [
          { number: 1, title: 'Check Your Bill', description: 'Compare current bill with previous months and note discrepancies.' },
          { number: 2, title: 'Contact Customer Service', description: 'Call LESCO/IESCO/PESCO helpline first.' },
          { number: 3, title: 'Visit Customer Care Center', description: 'If not resolved, visit nearest customer care with bill copies.' },
          { number: 4, title: 'File Written Complaint', description: 'Submit formal written complaint with evidence.' },
          { number: 5, title: 'Get Meter Re-checked', description: 'Request meter inspection if needed.' },
          { number: 6, title: 'Escalate to NEPRA', description: 'If unresolved, file complaint with NEPRA.' }
        ],
        required_documents: ['Last 3 months bills', 'CNIC copy', 'Meter reading photos'],
        contact_phones: ['118', '051-9206600'],
        timeline_expectation: '7-14 working days',
        is_published: true,
        views_count: 156,
        upvotes_count: 28
      }
    ];

    const { error: guidesError } = await supabase.from('guides').insert(guides);
    if (guidesError) {
      console.error('❌ Error inserting guides:', guidesError.message);
    } else {
      console.log('✅ Sample guides inserted');
    }
  }

  // Seed donation cases
  const { data: existingDonations } = await supabase.from('donation_cases').select('id').limit(1);
  if (existingDonations && existingDonations.length > 0) {
    console.log('✅ Donation cases already exist');
  } else {
    const { data: donationCats } = await supabase.from('donation_categories').select('id, slug');
    const dcatMap = {};
    donationCats?.forEach(c => dcatMap[c.slug] = c.id);

    const donationCases = [
      {
        title: 'Help Ali Fight Cancer',
        slug: 'help-ali-fight-cancer',
        category_id: dcatMap['medical'],
        description: 'Help 8-year-old Ali undergo life-saving cancer treatment at Shaukat Khanum Hospital.',
        story: 'Ali is a bright 8-year-old from Lahore who loves playing cricket. Three months ago, he was diagnosed with Acute Lymphoblastic Leukemia (ALL). His family cannot afford the expensive chemotherapy treatment. Your donation can help save Ali\'s life.',
        beneficiary_name: 'Ali Hassan',
        city: 'Lahore',
        goal_amount: 500000,
        raised_amount: 125000,
        urgency: 'critical',
        jazzcash_number: '0300-1234567',
        easypaisa_number: '0321-7654321',
        is_verified: true,
        is_active: true
      },
      {
        title: 'Flood Relief Fund - Sindh',
        slug: 'flood-relief-sindh',
        category_id: dcatMap['disaster'],
        description: 'Emergency relief for flood-affected families in Sindh province.',
        story: 'Devastating floods have affected over 10,000 families in rural Sindh. They urgently need food, clean water, medicine, and temporary shelter.',
        beneficiary_name: 'Citizens of Sindh',
        city: 'Sindh',
        goal_amount: 1000000,
        raised_amount: 450000,
        urgency: 'high',
        jazzcash_number: '0300-9999888',
        easypaisa_number: '0321-8888999',
        is_verified: true,
        is_active: true
      },
      {
        title: 'Build a School in Balochistan',
        slug: 'build-school-balochistan',
        category_id: dcatMap['education'],
        description: 'Help construct a school for underprivileged children in rural Balochistan.',
        story: 'In the remote village of Panjgur, 200+ children walk 10km daily for education. We aim to build a primary school with 6 classrooms.',
        beneficiary_name: 'Panjgur Education Trust',
        city: 'Panjgur',
        goal_amount: 750000,
        raised_amount: 280000,
        urgency: 'medium',
        jazzcash_number: '0300-5556666',
        easypaisa_number: '0321-6667777',
        is_verified: true,
        is_active: true
      }
    ];

    const { error: donationError } = await supabase.from('donation_cases').insert(donationCases);
    if (donationError) {
      console.error('❌ Error inserting donation cases:', donationError.message);
    } else {
      console.log('✅ Sample donation cases inserted');
    }
  }

  // Seed blood donors (without user_id)
  const { data: existingDonors } = await supabase.from('blood_donors').select('id').limit(1);
  if (existingDonors && existingDonors.length > 0) {
    console.log('✅ Blood donors already exist');
  } else {
    const bloodDonors = [
      { blood_group: 'O+', city: 'Lahore', area: 'Gulberg', is_available: true, last_donation_date: '2024-09-15', donation_count: 5, contact_phone: '0300-1111222', notes: 'Available on weekends' },
      { blood_group: 'A+', city: 'Karachi', area: 'Clifton', is_available: true, last_donation_date: '2024-10-20', donation_count: 3, contact_phone: '0321-3334444', notes: 'Can donate anytime' },
      { blood_group: 'B+', city: 'Islamabad', area: 'F-7', is_available: true, last_donation_date: '2024-11-01', donation_count: 2, contact_phone: '0333-5556666', notes: 'Prefer evening slots' },
      { blood_group: 'AB+', city: 'Lahore', area: 'DHA', is_available: false, last_donation_date: '2024-11-25', donation_count: 1, contact_phone: '0345-7778888', notes: 'Recently donated' },
      { blood_group: 'O-', city: 'Karachi', area: 'North Nazimabad', is_available: true, last_donation_date: '2024-08-10', donation_count: 7, contact_phone: '0311-9991000', notes: 'Universal donor' }
    ];

    const { error: donorError } = await supabase.from('blood_donors').insert(bloodDonors);
    if (donorError) {
      console.error('❌ Error inserting blood donors:', donorError.message);
    } else {
      console.log('✅ Sample blood donors inserted');
    }
  }

  // Seed blood requests
  const { data: existingRequests } = await supabase.from('blood_requests').select('id').limit(1);
  if (existingRequests && existingRequests.length > 0) {
    console.log('✅ Blood requests already exist');
  } else {
    const bloodRequests = [
      { patient_name: 'Muhammad Bilal', blood_group: 'O+', units_needed: 2, hospital_name: 'Jinnah Hospital', hospital_address: 'Jinnah Hospital, Lahore', city: 'Lahore', contact_phone: '0300-2223344', urgency_level: 'urgent', status: 'open', notes: 'Surgery scheduled for tomorrow' },
      { patient_name: 'Fatima Noor', blood_group: 'A+', units_needed: 1, hospital_name: 'Aga Khan Hospital', hospital_address: 'Stadium Road, Karachi', city: 'Karachi', contact_phone: '0321-4445566', urgency_level: 'critical', status: 'open', notes: 'Emergency - please help urgently' },
      { patient_name: 'Ahmed Raza', blood_group: 'B-', units_needed: 3, hospital_name: 'PIMS Hospital', hospital_address: 'G-8, Islamabad', city: 'Islamabad', contact_phone: '0333-6667788', urgency_level: 'normal', status: 'open', notes: 'Thalassemia patient' }
    ];

    const { error: requestError } = await supabase.from('blood_requests').insert(bloodRequests);
    if (requestError) {
      console.error('❌ Error inserting blood requests:', requestError.message);
    } else {
      console.log('✅ Sample blood requests inserted');
    }
  }

  // Seed volunteers (without user_id)
  const { data: existingVolunteers } = await supabase.from('volunteers').select('id').limit(1);
  if (existingVolunteers && existingVolunteers.length > 0) {
    console.log('✅ Volunteers already exist');
  } else {
    const volunteers = [
      { skills: ['Teaching', 'Tutoring', 'Mentoring'], areas_of_interest: ['Education', 'Youth Development'], city: 'Lahore', area: 'Model Town', availability: 'weekends', hours_per_week: 8, experience: 'University lecturer with 5 years experience.', is_active: true, tasks_completed: 12 },
      { skills: ['First Aid', 'Paramedic', 'Doctor'], areas_of_interest: ['Healthcare', 'Emergency Response'], city: 'Karachi', area: 'Clifton', availability: 'both', hours_per_week: 15, experience: 'Medical professional, available for health camps.', is_active: true, tasks_completed: 8 },
      { skills: ['IT Support', 'Web Development', 'Training'], areas_of_interest: ['Technology', 'Education'], city: 'Islamabad', area: 'F-10', availability: 'flexible', hours_per_week: 10, experience: 'Software developer willing to teach coding.', is_active: true, tasks_completed: 5 }
    ];

    const { error: volunteerError } = await supabase.from('volunteers').insert(volunteers);
    if (volunteerError) {
      console.error('❌ Error inserting volunteers:', volunteerError.message);
    } else {
      console.log('✅ Sample volunteers inserted');
    }
  }

  console.log('\n✨ Database seeding complete!\n');

  // Print summary
  const { count: guidesCount } = await supabase.from('guides').select('*', { count: 'exact', head: true });
  const { count: donationsCount } = await supabase.from('donation_cases').select('*', { count: 'exact', head: true });
  const { count: donorsCount } = await supabase.from('blood_donors').select('*', { count: 'exact', head: true });
  const { count: requestsCount } = await supabase.from('blood_requests').select('*', { count: 'exact', head: true });
  const { count: volunteersCount } = await supabase.from('volunteers').select('*', { count: 'exact', head: true });
  const { count: categoriesCount } = await supabase.from('categories').select('*', { count: 'exact', head: true });
  const { count: emergencyCount } = await supabase.from('emergency_guides').select('*', { count: 'exact', head: true });

  console.log('📊 Database Summary:');
  console.log(`   Categories: ${categoriesCount || 0}`);
  console.log(`   Guides: ${guidesCount || 0}`);
  console.log(`   Donation Cases: ${donationsCount || 0}`);
  console.log(`   Blood Donors: ${donorsCount || 0}`);
  console.log(`   Blood Requests: ${requestsCount || 0}`);
  console.log(`   Volunteers: ${volunteersCount || 0}`);
  console.log(`   Emergency Guides: ${emergencyCount || 0}`);
}

seedDatabase().catch(console.error);

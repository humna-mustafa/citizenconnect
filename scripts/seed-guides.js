const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://tstzrjdxzvepdiaxmllf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzdHpyamR4enZlcGRpYXhtbGxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2NzUxNTEsImV4cCI6MjA4MDI1MTE1MX0.3sNOf7ueidGrnM_CpYWRUllJLnOieFLx7t1JAJGrZ2o';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const categories = {
  'Roads & Transport': [
    'How to Report Pothole to City Authority',
    'Traffic Challan Payment Online Punjab',
    'Traffic Challan Payment Online Sindh',
    'Driving License Application New',
    'Driving License Renewal',
    'International Driving Permit',
    'Vehicle Registration New Car',
    'Vehicle Registration Transfer',
    'Vehicle Token Tax Payment',
    'Motorway Helpline Usage',
    'Metro Bus Card Lahore',
    'Metro Bus Card Islamabad',
    'Orange Line Train Lahore',
    'Public Transport Complaint',
    'Road Damage Report',
    'Traffic Signal Fault Report',
    'Parking Challan Appeal',
    'Vehicle Fitness Certificate',
    'Route Permit Application',
    'Heavy Vehicle License',
    'PSV Badge Application',
    'Careem Uber Driver Registration',
    'E-Bike Registration',
    'Vehicle Auction Participation',
    'Hit and Run Report'
  ],
  'Sewerage & Water': [
    'WASA New Connection Lahore',
    'WASA New Connection Faisalabad',
    'WASA Complaint Registration',
    'Water Supply Disruption Report',
    'Sewerage Blockage Complaint',
    'Water Bill Payment Online',
    'Water Meter Installation',
    'Water Tanker Request',
    'Boring Tubewell Permission',
    'Water Quality Test Request',
    'PHED Complaint Punjab',
    'KWSB Complaint Karachi',
    'Illegal Water Connection Report',
    'Water Theft Report',
    'Rainwater Drainage Issue',
    'Flood Damage Report',
    'Water Conservation Tips',
    'Sewerage Line Extension Request'
  ]
};

async function seedGuides() {
  console.log('🌱 Seeding guides...');

  // Get categories first to map IDs
  const { data: dbCategories } = await supabase.from('categories').select('id, name');
  const catMap = {};
  if (dbCategories) {
    dbCategories.forEach(c => catMap[c.name] = c.id);
  }

  for (const [categoryName, titles] of Object.entries(categories)) {
    const categoryId = catMap[categoryName];
    if (!categoryId) {
      console.warn(`⚠️ Category not found: ${categoryName}`);
      continue;
    }

    for (const title of titles) {
      const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      
      // Generate generic but realistic content based on title
      const guide = {
        title: title,
        slug: slug,
        category_id: categoryId,
        problem_explanation: `Complete guide on ${title}. This guide explains the process, requirements, and steps to resolve this issue or avail this service in Pakistan.`,
        steps: [
          { number: 1, title: 'Preparation', description: 'Gather all necessary documents such as CNIC, proof of residence, and any previous records.' },
          { number: 2, title: 'Visit Office / Online Portal', description: 'Visit the relevant department office or their official website/app.' },
          { number: 3, title: 'Submit Application', description: 'Fill out the application form carefully and attach required documents.' },
          { number: 4, title: 'Pay Fees', description: 'Pay any applicable fees via bank challan or digital payment methods.' },
          { number: 5, title: 'Follow Up', description: 'Track your application status and wait for processing.' }
        ],
        required_documents: ['Original CNIC', 'Copies of CNIC', 'Passport size photos', 'Application Form'],
        timeline_expectation: '3-7 working days',
        estimated_cost: 'Varies (Check official rates)',
        pro_tips: 'Always keep photocopies of your submitted documents. Visit offices early in the morning to avoid queues.',
        is_published: true,
        views_count: Math.floor(Math.random() * 500) + 50,
        upvotes_count: Math.floor(Math.random() * 100) + 10
      };

      const { error } = await supabase.from('guides').upsert(guide, { onConflict: 'slug' });

      if (error) {
        console.error(`❌ Error inserting ${title}:`, error.message);
      } else {
        console.log(`✅ Inserted: ${title}`);
      }
    }
  }
  console.log('✨ Done seeding guides.');
}

seedGuides();

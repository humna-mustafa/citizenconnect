const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://tstzrjdxzvepdiaxmllf.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('❌ Please provide SUPABASE_SERVICE_ROLE_KEY environment variable');
  console.log('\nYou can find this in your Supabase Dashboard:');
  console.log('1. Go to https://supabase.com/dashboard');
  console.log('2. Select your project');
  console.log('3. Go to Settings > API');
  console.log('4. Copy the "service_role" key (NOT the anon key)');
  console.log('\nThen run: $env:SUPABASE_SERVICE_ROLE_KEY="your-key"; node scripts/setup-database.js');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testConnection() {
  console.log('🔗 Testing connection to Supabase...');
  
  // Try a simple query
  const { data, error } = await supabase.from('profiles').select('count').limit(1);
  
  if (error && error.code === '42P01') {
    console.log('✅ Connected! Tables do not exist yet (expected).');
    return true;
  } else if (error) {
    console.error('❌ Connection error:', error.message);
    return false;
  } else {
    console.log('✅ Connected! Tables already exist.');
    return true;
  }
}

async function main() {
  const connected = await testConnection();
  if (!connected) {
    process.exit(1);
  }
  
  console.log('\n📋 To set up your database, please run the SQL manually:');
  console.log('1. Go to https://supabase.com/dashboard/project/tstzrjdxzvepdiaxmllf/sql/new');
  console.log('2. Copy and paste the contents of: supabase/migrations/20231202000000_initial_schema.sql');
  console.log('3. Click "Run"');
  console.log('\nOr use the Supabase CLI with a service role key.');
}

main();

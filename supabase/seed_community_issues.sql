-- Community Issues Seed Data for CitizenConnect
-- 67 Community Issues for the Community Hub
-- Run this after seed_comprehensive.sql

-- =====================================================
-- COMMUNITY ISSUES (67 issues)
-- =====================================================

INSERT INTO public.community_issues (ticket_number, title, description, category_id, city, area, address, priority, status, upvotes, views_count, created_at) VALUES

-- ROADS & POTHOLES (10 issues)
('CC-20250115-0001', 'Large pothole on Main Boulevard Gulberg', 
'There is a dangerous 2-foot wide pothole near Hussain Chowk on Main Boulevard. It has caused multiple accidents and needs urgent repair. The pothole has been growing for weeks.',
(SELECT id FROM issue_categories WHERE slug = 'roads' LIMIT 1),
'Lahore', 'Gulberg III', 'Main Boulevard near Hussain Chowk, Gulberg III',
'urgent', 'open', 45, 320, '2025-01-15'::date),

('CC-20250114-0002', 'Road completely broken on Canal Road', 
'The road near UET bus stop on Canal Road has completely deteriorated. Large chunks of asphalt missing. Very dangerous for motorcycles and cars.',
(SELECT id FROM issue_categories WHERE slug = 'roads' LIMIT 1),
'Lahore', 'Canal Road', 'Canal Road near UET Bus Stop',
'high', 'assigned', 38, 280, '2025-01-14'::date),

('CC-20250113-0003', 'Multiple potholes on DHA Phase 5', 
'Phase 5 Sector C road has at least 10 potholes in a 500m stretch. The road was recently patched but repairs failed within a month.',
(SELECT id FROM issue_categories WHERE slug = 'roads' LIMIT 1),
'Lahore', 'DHA Phase 5', 'Sector C, DHA Phase 5',
'medium', 'open', 28, 190, '2025-01-13'::date),

('CC-20250112-0004', 'Clifton road caving in', 
'The road near Boat Basin is caving in from multiple points. Appears to be sewerage issue underneath. Very dangerous for traffic.',
(SELECT id FROM issue_categories WHERE slug = 'roads' LIMIT 1),
'Karachi', 'Clifton', 'Near Boat Basin, Clifton',
'urgent', 'in_progress', 52, 410, '2025-01-12'::date),

('CC-20250111-0005', 'Broken road surface Blue Area', 
'F-6/F-7 connector road has broken patches causing traffic slowdowns. Needs resurfacing urgently.',
(SELECT id FROM issue_categories WHERE slug = 'roads' LIMIT 1),
'Islamabad', 'Blue Area', 'F-6/F-7 Connector Road',
'medium', 'open', 22, 150, '2025-01-11'::date),

('CC-20250110-0006', 'Pothole caused accident on Ring Road', 
'A pothole near Thokar Niaz Baig has caused an accident. Urgent repair needed. The area is poorly lit at night.',
(SELECT id FROM issue_categories WHERE slug = 'roads' LIMIT 1),
'Lahore', 'Ring Road', 'Near Thokar Niaz Baig, Ring Road',
'urgent', 'resolved', 67, 520, '2025-01-10'::date),

('CC-20250109-0007', 'Entire road needs reconstruction Model Town', 
'Block D road has deteriorated beyond patching. Complete reconstruction needed. Residents have complained for 6 months.',
(SELECT id FROM issue_categories WHERE slug = 'roads' LIMIT 1),
'Lahore', 'Model Town', 'Block D, Model Town',
'high', 'open', 41, 310, '2025-01-09'::date),

('CC-20250108-0008', 'Road damage from construction work', 
'Heavy construction vehicles have damaged Faisal Town roads. Developer not repairing the damage.',
(SELECT id FROM issue_categories WHERE slug = 'roads' LIMIT 1),
'Lahore', 'Faisal Town', 'Block B, Faisal Town',
'medium', 'assigned', 19, 140, '2025-01-08'::date),

('CC-20250107-0009', 'Speed breaker damaged creating hazard', 
'A speed breaker on University Road has broken creating a hazard. Parts of concrete scattered on road.',
(SELECT id FROM issue_categories WHERE slug = 'roads' LIMIT 1),
'Karachi', 'University Road', 'Near NED University, University Road',
'high', 'open', 33, 230, '2025-01-07'::date),

('CC-20250106-0010', 'Unpaved road in new colony', 
'Sector G-13/4 has unpaved roads despite being occupied for 2 years. Dust issues in summer, mud in rain.',
(SELECT id FROM issue_categories WHERE slug = 'roads' LIMIT 1),
'Islamabad', 'G-13', 'Sector G-13/4',
'medium', 'open', 15, 95, '2025-01-06'::date),

-- GARBAGE & SANITATION (10 issues)
('CC-20250115-0011', 'Garbage not collected for 2 weeks', 
'LWMC has not collected garbage from our street for 2 weeks. The pile is now very large and smelling. Residents falling sick.',
(SELECT id FROM issue_categories WHERE slug = 'sanitation' LIMIT 1),
'Lahore', 'Johar Town', 'Block E, Johar Town',
'urgent', 'open', 56, 380, '2025-01-15'::date),

('CC-20250114-0012', 'Open drain creating health hazard', 
'Open drain near the school is overflowing with waste. Children have to walk through sewage to reach school.',
(SELECT id FROM issue_categories WHERE slug = 'sanitation' LIMIT 1),
'Lahore', 'Shahdara', 'Near Govt. High School, Shahdara',
'urgent', 'in_progress', 48, 340, '2025-01-14'::date),

('CC-20250113-0013', 'Garbage dump site in residential area', 
'KWMC has made an unofficial garbage dump in our residential area. Unbearable smell and mosquitoes.',
(SELECT id FROM issue_categories WHERE slug = 'sanitation' LIMIT 1),
'Karachi', 'Nazimabad', 'Block 4, Nazimabad',
'high', 'assigned', 62, 450, '2025-01-13'::date),

('CC-20250112-0014', 'Street sweeping stopped', 
'Street sweeping service stopped in our area 3 weeks ago. Streets are dirty and leaves piling up.',
(SELECT id FROM issue_categories WHERE slug = 'sanitation' LIMIT 1),
'Islamabad', 'F-10', 'Sector F-10/3',
'medium', 'open', 21, 130, '2025-01-12'::date),

('CC-20250111-0015', 'Commercial waste mixing with residential', 
'Nearby restaurants dumping waste in residential bins. Bins always overflowing.',
(SELECT id FROM issue_categories WHERE slug = 'sanitation' LIMIT 1),
'Lahore', 'Garden Town', 'Main Market, Garden Town',
'high', 'open', 34, 210, '2025-01-11'::date),

('CC-20250110-0016', 'Dead animal on street', 
'A dead dog has been lying on the street for 3 days. Authorities not responding to calls.',
(SELECT id FROM issue_categories WHERE slug = 'sanitation' LIMIT 1),
'Rawalpindi', 'Saddar', 'Bank Road, Saddar',
'urgent', 'resolved', 29, 180, '2025-01-10'::date),

('CC-20250109-0017', 'Waste bins removed not replaced', 
'Community waste bins removed 2 months ago for replacement. Never replaced. People throwing garbage on ground.',
(SELECT id FROM issue_categories WHERE slug = 'sanitation' LIMIT 1),
'Lahore', 'Wapda Town', 'Phase 1, Wapda Town',
'medium', 'open', 18, 110, '2025-01-09'::date),

('CC-20250108-0018', 'Medical waste in regular garbage', 
'Saw medical waste including syringes mixed with regular garbage near hospital. Very dangerous.',
(SELECT id FROM issue_categories WHERE slug = 'sanitation' LIMIT 1),
'Lahore', 'Township', 'Near THQ Hospital, Township',
'urgent', 'in_progress', 44, 290, '2025-01-08'::date),

('CC-20250107-0019', 'Construction debris on footpath', 
'Builder dumped construction debris on footpath. Pedestrians forced to walk on road.',
(SELECT id FROM issue_categories WHERE slug = 'sanitation' LIMIT 1),
'Karachi', 'Gulshan', 'Block 13-D, Gulshan',
'medium', 'open', 16, 85, '2025-01-07'::date),

('CC-20250106-0020', 'Burning garbage creating pollution', 
'People burning garbage in vacant plot creating smoke and air pollution. Happens daily evening.',
(SELECT id FROM issue_categories WHERE slug = 'sanitation' LIMIT 1),
'Faisalabad', 'Peoples Colony', 'Near Canal, Peoples Colony',
'high', 'open', 27, 160, '2025-01-06'::date),

-- STREET LIGHTS (8 issues)
('CC-20250115-0021', 'Entire street dark for 1 month', 
'All street lights on our street stopped working a month ago. Very unsafe at night. Robbery incidents increasing.',
(SELECT id FROM issue_categories WHERE slug = 'streetlights' LIMIT 1),
'Lahore', 'Iqbal Town', 'Block 5, Iqbal Town',
'urgent', 'assigned', 51, 370, '2025-01-15'::date),

('CC-20250113-0022', 'Street light poles fallen', 
'Two street light poles have fallen due to storm. Wires exposed creating electrocution risk.',
(SELECT id FROM issue_categories WHERE slug = 'streetlights' LIMIT 1),
'Lahore', 'Cantt', 'Near CMH, Cantt',
'urgent', 'in_progress', 39, 260, '2025-01-13'::date),

('CC-20250111-0023', 'Lights on during day, off at night', 
'Street lights turn on during daytime and switch off at night. Timer malfunction needs fixing.',
(SELECT id FROM issue_categories WHERE slug = 'streetlights' LIMIT 1),
'Islamabad', 'G-9', 'Sector G-9/1',
'medium', 'open', 24, 140, '2025-01-11'::date),

('CC-20250109-0024', 'Park lights not working', 
'All lights in Bagh-e-Jinnah are not working. Park unsafe after sunset.',
(SELECT id FROM issue_categories WHERE slug = 'streetlights' LIMIT 1),
'Lahore', 'Mall Road', 'Bagh-e-Jinnah, Mall Road',
'high', 'open', 36, 220, '2025-01-09'::date),

('CC-20250107-0025', 'New colony no street lights', 
'Newly developed area has no street lights installed despite occupation for 1 year.',
(SELECT id FROM issue_categories WHERE slug = 'streetlights' LIMIT 1),
'Lahore', 'Bahria Town', 'Sector E, Bahria Town',
'medium', 'open', 14, 80, '2025-01-07'::date),

('CC-20250105-0026', 'LED conversion incomplete', 
'LED conversion project started but abandoned mid-way. Half streets dark.',
(SELECT id FROM issue_categories WHERE slug = 'streetlights' LIMIT 1),
'Karachi', 'DHA', 'Phase 6, DHA',
'medium', 'open', 19, 105, '2025-01-05'::date),

('CC-20250103-0027', 'School route dark', 
'Street connecting to school has no working lights. Children walk in dark during winter mornings.',
(SELECT id FROM issue_categories WHERE slug = 'streetlights' LIMIT 1),
'Rawalpindi', 'Satellite Town', 'Near Govt. School, Satellite Town',
'high', 'assigned', 42, 280, '2025-01-03'::date),

('CC-20250101-0028', 'Transformer sparking', 
'Street light transformer sparking at night. Fire hazard. Authorities notified but no action.',
(SELECT id FROM issue_categories WHERE slug = 'streetlights' LIMIT 1),
'Lahore', 'Gulberg II', 'Near Liberty Market, Gulberg II',
'urgent', 'resolved', 58, 410, '2025-01-01'::date),

-- WATER SUPPLY (7 issues)
('CC-20250114-0029', 'No water supply for 5 days', 
'Area has no water supply for 5 days. WASA not responding to complaints. Residents buying tankers.',
(SELECT id FROM issue_categories WHERE slug = 'water' LIMIT 1),
'Lahore', 'Allama Iqbal Town', 'Karim Block, Allama Iqbal Town',
'urgent', 'in_progress', 73, 520, '2025-01-14'::date),

('CC-20250112-0030', 'Water pressure extremely low', 
'Water pressure so low it doesn''t reach first floor. Problem for 3 weeks. WASA says main issue.',
(SELECT id FROM issue_categories WHERE slug = 'water' LIMIT 1),
'Karachi', 'North Nazimabad', 'Block L, North Nazimabad',
'high', 'assigned', 45, 310, '2025-01-12'::date),

('CC-20250110-0031', 'Contaminated water supply', 
'Water coming from taps is yellowish and smells bad. Possibly mixed with sewerage.',
(SELECT id FROM issue_categories WHERE slug = 'water' LIMIT 1),
'Lahore', 'Data Gunj Bakhsh', 'Near Data Darbar, Old City',
'urgent', 'open', 61, 430, '2025-01-10'::date),

('CC-20250108-0032', 'Water main leak', 
'Large water main leaking for 2 weeks. Thousands of gallons wasted daily. Road also damaged.',
(SELECT id FROM issue_categories WHERE slug = 'water' LIMIT 1),
'Islamabad', 'F-8', 'Sector F-8/1',
'high', 'in_progress', 38, 250, '2025-01-08'::date),

('CC-20250106-0033', 'Water timing changed without notice', 
'WASA changed water supply timing without informing residents. Missing water supply completely.',
(SELECT id FROM issue_categories WHERE slug = 'water' LIMIT 1),
'Faisalabad', 'Madina Town', 'Block C, Madina Town',
'medium', 'open', 22, 140, '2025-01-06'::date),

('CC-20250104-0034', 'New connection pending 6 months', 
'Applied for new water connection 6 months ago. Still pending despite full payment.',
(SELECT id FROM issue_categories WHERE slug = 'water' LIMIT 1),
'Lahore', 'Valencia', 'Block A, Valencia Town',
'medium', 'assigned', 17, 95, '2025-01-04'::date),

('CC-20250102-0035', 'Fire hydrant not working', 
'Fire hydrant in our area not working. Discovered during recent fire emergency.',
(SELECT id FROM issue_categories WHERE slug = 'water' LIMIT 1),
'Lahore', 'Shadman', 'Shadman Market Area',
'high', 'open', 31, 180, '2025-01-02'::date),

-- ELECTRICITY (7 issues)
('CC-20250115-0036', 'Transformer overloaded, frequent outages', 
'Area transformer overloaded. Tripping 10+ times daily. LESCO refuses to upgrade.',
(SELECT id FROM issue_categories WHERE slug = 'electricity' LIMIT 1),
'Lahore', 'Model Town', 'Block J, Model Town',
'urgent', 'open', 64, 460, '2025-01-15'::date),

('CC-20250113-0037', 'Low voltage damaging appliances', 
'Voltage drops to 160V during evening. Multiple appliances damaged. No compensation from LESCO.',
(SELECT id FROM issue_categories WHERE slug = 'electricity' LIMIT 1),
'Lahore', 'Johar Town', 'Block R, Johar Town',
'high', 'assigned', 49, 340, '2025-01-13'::date),

('CC-20250111-0038', 'Electric pole tilting dangerously', 
'Electricity pole tilting 45 degrees after rain. Could fall anytime. Wires over children playground.',
(SELECT id FROM issue_categories WHERE slug = 'electricity' LIMIT 1),
'Karachi', 'Liaquatabad', 'Block 10, Liaquatabad',
'urgent', 'in_progress', 55, 390, '2025-01-11'::date),

('CC-20250109-0039', 'Hanging wires on street', 
'Low hanging electric wires on main street. Truck touched wires last week causing fire.',
(SELECT id FROM issue_categories WHERE slug = 'electricity' LIMIT 1),
'Rawalpindi', 'Committee Chowk', 'Near Committee Chowk',
'urgent', 'open', 43, 280, '2025-01-09'::date),

('CC-20250107-0040', 'Meter reader not visiting', 
'Meter reader hasn''t visited in 3 months. Receiving estimated bills much higher than usage.',
(SELECT id FROM issue_categories WHERE slug = 'electricity' LIMIT 1),
'Lahore', 'Wapda Town', 'Phase 2, Wapda Town',
'medium', 'open', 28, 160, '2025-01-07'::date),

('CC-20250105-0041', 'Kunda (illegal connection) in area', 
'Multiple houses using kunda connections. Load on our transformer increased causing problems.',
(SELECT id FROM issue_categories WHERE slug = 'electricity' LIMIT 1),
'Lahore', 'Baghbanpura', 'Baghbanpura Area',
'high', 'assigned', 36, 210, '2025-01-05'::date),

('CC-20250103-0042', 'Faulty meter giving wrong reading', 
'Meter running fast even when all appliances off. Bill jumped from 5000 to 25000.',
(SELECT id FROM issue_categories WHERE slug = 'electricity' LIMIT 1),
'Islamabad', 'G-11', 'Sector G-11/2',
'high', 'open', 41, 270, '2025-01-03'::date),

-- PUBLIC SAFETY (6 issues)
('CC-20250114-0043', 'Stray dogs pack terrorizing residents', 
'Pack of 15+ stray dogs in area. Have bitten 3 people this month. Authorities not responding.',
(SELECT id FROM issue_categories WHERE slug = 'safety' LIMIT 1),
'Lahore', 'DHA Phase 4', 'Block EE, DHA Phase 4',
'urgent', 'open', 67, 480, '2025-01-14'::date),

('CC-20250112-0044', 'No police patrol in area', 
'Police patrolling stopped in our area. Street crime increasing. 4 mobile snatching this week.',
(SELECT id FROM issue_categories WHERE slug = 'safety' LIMIT 1),
'Karachi', 'Gulistan-e-Jauhar', 'Block 15, Gulistan-e-Jauhar',
'urgent', 'assigned', 58, 410, '2025-01-12'::date),

('CC-20250110-0045', 'Abandoned building used by drug addicts', 
'Abandoned building being used by drug addicts. Syringes found near school. Very concerned.',
(SELECT id FROM issue_categories WHERE slug = 'safety' LIMIT 1),
'Lahore', 'Township', 'Sector B2, Township',
'urgent', 'in_progress', 72, 540, '2025-01-10'::date),

('CC-20250108-0046', 'Illegal parking blocking ambulance route', 
'Hospital road blocked by illegal parking. Ambulances delayed. Lives at risk.',
(SELECT id FROM issue_categories WHERE slug = 'safety' LIMIT 1),
'Lahore', 'Gulberg', 'Near Doctors Hospital, Gulberg',
'high', 'open', 45, 320, '2025-01-08'::date),

('CC-20250106-0047', 'Open manhole dangerous', 
'Manhole cover missing on main road. Child fell in last week. Temporary barrier removed.',
(SELECT id FROM issue_categories WHERE slug = 'safety' LIMIT 1),
'Islamabad', 'I-8', 'Sector I-8/1',
'urgent', 'resolved', 53, 380, '2025-01-06'::date),

('CC-20250104-0048', 'Dangerous driving near school', 
'Vehicles speeding near school at pickup time. No speed breakers or police presence.',
(SELECT id FROM issue_categories WHERE slug = 'safety' LIMIT 1),
'Lahore', 'Faisal Town', 'Near LGS Faisal Town',
'high', 'assigned', 39, 260, '2025-01-04'::date),

-- PARKS & PUBLIC SPACES (5 issues)
('CC-20250113-0049', 'Park equipment broken', 
'Childrens play equipment in Jilani Park broken and dangerous. Rusty metal parts exposed.',
(SELECT id FROM issue_categories WHERE slug = 'parks' LIMIT 1),
'Lahore', 'Gulberg', 'Jilani Park, Gulberg',
'high', 'open', 44, 300, '2025-01-13'::date),

('CC-20250111-0050', 'Park turned into parking lot', 
'Local park being used as paid parking by mafia. No action from authorities.',
(SELECT id FROM issue_categories WHERE slug = 'parks' LIMIT 1),
'Karachi', 'Saddar', 'Near Empress Market, Saddar',
'medium', 'open', 31, 200, '2025-01-11'::date),

('CC-20250109-0051', 'Trees being cut illegally', 
'Contractor cutting mature trees in public park without permission. Need urgent intervention.',
(SELECT id FROM issue_categories WHERE slug = 'parks' LIMIT 1),
'Islamabad', 'F-6', 'F-6 Park, Islamabad',
'urgent', 'in_progress', 69, 490, '2025-01-09'::date),

('CC-20250107-0052', 'No washrooms in public park', 
'Large public park has no washroom facility. Unhygienic conditions around park boundary.',
(SELECT id FROM issue_categories WHERE slug = 'parks' LIMIT 1),
'Lahore', 'Lahore Cantt', 'Race Course Park',
'medium', 'open', 23, 130, '2025-01-07'::date),

('CC-20250105-0053', 'Encroachment on green belt', 
'Shops constructed on green belt illegally. Trees removed. Green space lost forever.',
(SELECT id FROM issue_categories WHERE slug = 'parks' LIMIT 1),
'Lahore', 'Garden Town', 'Near Barkat Market, Garden Town',
'high', 'assigned', 47, 330, '2025-01-05'::date),

-- TRAFFIC & SIGNALS (6 issues)
('CC-20250114-0054', 'Traffic signal timing wrong', 
'Traffic signal at Liberty Chowk has wrong timing. Green light only 10 seconds causing long queues.',
(SELECT id FROM issue_categories WHERE slug = 'traffic' LIMIT 1),
'Lahore', 'Gulberg', 'Liberty Chowk, Gulberg',
'high', 'open', 52, 370, '2025-01-14'::date),

('CC-20250112-0055', 'No signal at dangerous intersection', 
'High traffic intersection has no signal. Accidents daily. Need traffic signal urgently.',
(SELECT id FROM issue_categories WHERE slug = 'traffic' LIMIT 1),
'Karachi', 'Korangi', 'Korangi Industrial Area Intersection',
'urgent', 'assigned', 61, 440, '2025-01-12'::date),

('CC-20250110-0056', 'Road markings faded', 
'All road markings on GT Road faded. Lane discipline impossible. Causing accidents.',
(SELECT id FROM issue_categories WHERE slug = 'traffic' LIMIT 1),
'Lahore', 'GT Road', 'GT Road near Ring Road Interchange',
'medium', 'open', 27, 160, '2025-01-10'::date),

('CC-20250108-0057', 'Traffic warden taking bribes', 
'Traffic warden at Cavalry Ground taking bribes openly. Photos attached.',
(SELECT id FROM issue_categories WHERE slug = 'traffic' LIMIT 1),
'Lahore', 'Cantt', 'Cavalry Ground Chowk',
'high', 'open', 38, 250, '2025-01-08'::date),

('CC-20250106-0058', 'School zone no speed limit signs', 
'No school zone or speed limit signs near our school. Vehicles speeding dangerously.',
(SELECT id FROM issue_categories WHERE slug = 'traffic' LIMIT 1),
'Islamabad', 'G-10', 'Near Islamabad Model College, G-10',
'high', 'open', 35, 220, '2025-01-06'::date),

('CC-20250104-0059', 'U-turn dangerous', 
'U-turn created without proper road engineering. Accidents happening regularly.',
(SELECT id FROM issue_categories WHERE slug = 'traffic' LIMIT 1),
'Lahore', 'DHA', 'Near DHA Phase 6 Entrance',
'medium', 'assigned', 29, 170, '2025-01-04'::date),

-- GOVERNMENT SERVICES (5 issues)
('CC-20250113-0060', 'NADRA office terrible service', 
'NADRA office staff rude and slow. Simple CNIC renewal taking 3+ hours. Need improvement.',
(SELECT id FROM issue_categories WHERE slug = 'government' LIMIT 1),
'Lahore', 'Model Town', 'NADRA Mega Center, Model Town',
'medium', 'open', 56, 400, '2025-01-13'::date),

('CC-20250111-0061', 'Passport office appointment system failing', 
'Online appointment system for passport always shows unavailable. Black market for appointments.',
(SELECT id FROM issue_categories WHERE slug = 'government' LIMIT 1),
'Lahore', 'Allama Iqbal Town', 'Passport Office, Allama Iqbal Town',
'high', 'assigned', 68, 490, '2025-01-11'::date),

('CC-20250109-0062', 'Domicile taking 2 months', 
'Applied for domicile 2 months ago. Still "under process". Normal time should be 7 days.',
(SELECT id FROM issue_categories WHERE slug = 'government' LIMIT 1),
'Rawalpindi', 'Saddar', 'DC Office, Rawalpindi',
'medium', 'open', 33, 210, '2025-01-09'::date),

('CC-20250107-0063', 'Police verification delays visa', 
'Police verification for passport taking 45+ days. My visa appointment expired.',
(SELECT id FROM issue_categories WHERE slug = 'government' LIMIT 1),
'Karachi', 'Clifton', 'Clifton Police Station',
'high', 'in_progress', 42, 280, '2025-01-07'::date),

('CC-20250105-0064', 'Birth certificate error not fixed', 
'Union Council made error in birth certificate. Not correcting despite 5 visits.',
(SELECT id FROM issue_categories WHERE slug = 'government' LIMIT 1),
'Lahore', 'Shahdara', 'UC Shahdara',
'medium', 'open', 24, 150, '2025-01-05'::date),

-- OTHER (3 issues)
('CC-20250112-0065', 'Noise pollution from factory', 
'Factory operating in residential area. Noise 24/7. Cannot sleep. EPA not responding.',
(SELECT id FROM issue_categories WHERE slug = 'other' LIMIT 1),
'Lahore', 'Kot Lakhpat', 'Industrial Area, Kot Lakhpat',
'high', 'open', 37, 240, '2025-01-12'::date),

('CC-20250108-0066', 'Mobile tower radiation concerns', 
'Mobile tower installed on building without NOC. Residents concerned about radiation.',
(SELECT id FROM issue_categories WHERE slug = 'other' LIMIT 1),
'Islamabad', 'F-11', 'Sector F-11/1',
'medium', 'assigned', 28, 180, '2025-01-08'::date),

('CC-20250104-0067', 'Loudspeaker noise violation', 
'Religious gathering using loudspeakers beyond permitted hours and volume. Not against religion but disturbing students.',
(SELECT id FROM issue_categories WHERE slug = 'other' LIMIT 1),
'Lahore', 'Gulberg', 'Near MM Alam Road, Gulberg',
'low', 'open', 19, 120, '2025-01-04'::date)

ON CONFLICT (ticket_number) DO UPDATE SET
  upvotes = EXCLUDED.upvotes,
  views_count = EXCLUDED.views_count,
  updated_at = now();


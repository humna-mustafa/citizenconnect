-- Comprehensive Seed Data for CitizenConnect
-- Run this AFTER the initial migrations
-- This populates the database with full demo data

-- =====================================================
-- CATEGORIES (ensure they exist)
-- =====================================================
INSERT INTO public.categories (name, slug, description, icon, color) VALUES
('Roads & Transport', 'roads-transport', 'Vehicle registration, driving license, traffic issues', '🚗', '#f97316'),
('Sewerage & Water', 'sewerage-water', 'Water supply, drainage, WASA complaints', '💧', '#3b82f6'),
('Electricity & Gas', 'electricity-gas', 'WAPDA/SSGC complaints, meter issues, billing', '⚡', '#eab308'),
('Healthcare', 'healthcare', 'Hospital cards, health insurance, medical assistance', '🏥', '#10b981'),
('Education', 'education', 'School admissions, scholarships, certificates', '📚', '#8b5cf6'),
('Social Causes', 'social-causes', 'CNIC, domicile, social welfare programs', '🤝', '#ec4899'),
('Legal & Rights', 'legal-rights', 'FIR, legal aid, consumer protection', '⚖️', '#6366f1'),
('Property & Land', 'property-land', 'Land registration, property disputes, documentation', '🏠', '#14b8a6')
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- DONATION CATEGORIES (ensure they exist)
-- =====================================================
INSERT INTO public.donation_categories (name, slug, description, icon) VALUES
('Medical', 'medical', 'Medical treatment and healthcare support', '🏥'),
('Education', 'education', 'Educational support and scholarships', '📚'),
('Disaster Relief', 'disaster', 'Natural disaster and emergency relief', '🌊'),
('Food & Ration', 'food', 'Food distribution and ration support', '🍚'),
('Orphanage', 'orphanage', 'Orphan care and support', '👶'),
('Shelter', 'shelter', 'Housing and shelter support', '🏠')
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- BLOOD DONORS (10+ donors)
-- =====================================================
INSERT INTO public.blood_donors (blood_group, city, area, is_available, last_donation_date, donation_count, contact_phone, contact_whatsapp, notes) VALUES
('O+', 'Lahore', 'Gulberg III', true, '2025-01-05', 8, '0300-1234567', '0300-1234567', 'Regular donor, available 24/7 for emergencies'),
('A+', 'Lahore', 'DHA Phase 5', true, '2025-01-10', 5, '0321-2345678', '0321-2345678', 'Available weekends and evenings'),
('B+', 'Lahore', 'Model Town', true, '2024-12-28', 3, '0333-3456789', NULL, 'First-time donor, very enthusiastic'),
('AB+', 'Karachi', 'Clifton', true, '2025-01-02', 12, '0345-4567890', '0345-4567890', 'Experienced donor, owns vehicle for quick response'),
('O-', 'Karachi', 'North Nazimabad', true, '2024-12-15', 15, '0311-5678901', '0311-5678901', 'Universal donor - always ready to help'),
('A-', 'Islamabad', 'F-7 Sector', true, '2025-01-08', 6, '0312-6789012', NULL, 'Doctor by profession, understands urgency'),
('B-', 'Islamabad', 'G-10', true, '2024-11-20', 4, '0334-7890123', '0334-7890123', 'Software engineer, flexible schedule'),
('AB-', 'Rawalpindi', 'Saddar', true, '2025-01-12', 2, '0315-8901234', NULL, 'New to donation, very willing to help'),
('O+', 'Faisalabad', 'Peoples Colony', true, '2024-12-30', 9, '0316-9012345', '0316-9012345', 'Can donate platelets as well'),
('A+', 'Multan', 'Cantt Area', true, '2025-01-03', 7, '0317-0123456', '0317-0123456', 'Medical student, very knowledgeable')
ON CONFLICT DO NOTHING;

-- =====================================================
-- BLOOD REQUESTS (5+ active requests)
-- =====================================================
INSERT INTO public.blood_requests (patient_name, blood_group, units_needed, hospital_name, hospital_address, city, contact_phone, urgency_level, status, notes) VALUES
('Muhammad Hassan', 'O+', 3, 'Jinnah Hospital', 'Allama Iqbal Road, Lahore', 'Lahore', '0300-1112233', 'critical', 'open', 'Heart surgery scheduled for tomorrow morning - URGENT'),
('Fatima Bibi', 'A-', 2, 'Shaukat Khanum Hospital', 'Johar Town, Lahore', 'Lahore', '0321-2223344', 'urgent', 'open', 'Cancer patient needs transfusion for chemotherapy'),
('Ahmed Ali Khan', 'B+', 1, 'Aga Khan University Hospital', 'Stadium Road, Karachi', 'Karachi', '0333-3334455', 'normal', 'open', 'Scheduled surgery next week'),
('Ayesha Malik', 'AB+', 4, 'PIMS Hospital', 'G-8 Sector, Islamabad', 'Islamabad', '0345-4445566', 'critical', 'open', 'Accident victim in ICU - multiple units needed'),
('Bilal Hussain', 'O-', 2, 'CMH Rawalpindi', 'Rawalpindi Cantt', 'Rawalpindi', '0311-5556677', 'urgent', 'open', 'Rare blood type needed for thalassemia patient')
ON CONFLICT DO NOTHING;

-- =====================================================
-- DONATION CAMPAIGNS (6 campaigns)
-- =====================================================
INSERT INTO public.donation_cases (title, slug, category_id, description, story, beneficiary_name, city, goal_amount, raised_amount, urgency, jazzcash_number, easypaisa_number, is_verified, is_active) VALUES

('Save Baby Zainab - Heart Surgery', 'save-baby-zainab-heart-surgery',
    (SELECT id FROM donation_categories WHERE slug = 'medical' LIMIT 1),
    'Urgent heart surgery needed for 2-year-old Zainab who was born with a congenital heart defect.',
    'Little Zainab was born with a hole in her heart. Her father works as a daily wage laborer earning barely enough to feed the family. The surgery costs PKR 800,000 which is impossible for them to afford. Every donation brings Zainab closer to a normal, healthy life. The surgery is scheduled at Armed Forces Institute of Cardiology.',
    'Zainab daughter of Muhammad Ashraf',
    'Lahore',
    800000.00,
    350000.00,
    'critical',
    '0300-1234567',
    '0321-7654321',
    true,
    true
),

('Flood Relief for Sindh Villages 2025', 'flood-relief-sindh-2025',
    (SELECT id FROM donation_categories WHERE slug = 'disaster' LIMIT 1),
    'Emergency relief for flood-affected families in rural Sindh after January 2025 heavy rains.',
    'Unexpected heavy rains in January 2025 have flooded several villages in Dadu and Larkana districts. Over 5,000 families have lost their homes and belongings. We are providing food packages, clean drinking water, medical supplies, and temporary shelter materials. Your donation directly helps these families survive and rebuild.',
    'Affected Communities of Dadu & Larkana',
    'Karachi',
    2000000.00,
    890000.00,
    'critical',
    '0300-9998877',
    '0321-8887766',
    true,
    true
),

('Educate 100 Orphans - School Fees Fund', 'educate-100-orphans-2025',
    (SELECT id FROM donation_categories WHERE slug = 'education' LIMIT 1),
    'Sponsor school education for 100 orphan children for the entire year 2025.',
    'The Dar-ul-Atfal Orphanage in Peshawar houses 100 children who have lost their parents. We want to ensure every child gets quality education by covering their school fees, uniforms, books, and transportation for 2025. Education is the only path for these children to build a better future.',
    'Dar-ul-Atfal Orphanage Peshawar',
    'Peshawar',
    1500000.00,
    620000.00,
    'high',
    '0300-5554433',
    '0321-4433221',
    true,
    true
),

('Ramadan Food Drive 2025', 'ramadan-food-drive-2025',
    (SELECT id FROM donation_categories WHERE slug = 'food' LIMIT 1),
    'Distribute Ramadan ration packages to 500 deserving families across Pakistan.',
    'Ramadan 2025 is approaching and many families struggle to afford basic food items for Sehri and Iftar. Each ration package (PKR 5,000) includes rice, flour, cooking oil, dates, sugar, tea, and other essentials for a family of 5 for the entire month. Help us bring joy to deserving families this Ramadan.',
    'Deserving Families Nationwide',
    'Islamabad',
    2500000.00,
    780000.00,
    'medium',
    '0300-6665544',
    '0321-5544332',
    true,
    true
),

('Build Clean Water Well in Thar', 'clean-water-well-thar',
    (SELECT id FROM donation_categories WHERE slug = 'shelter' LIMIT 1),
    'Construct a solar-powered water well to provide clean drinking water to Thar desert village.',
    'The village of Nagarparkar in Thar has no access to clean water. Women and children walk 5km daily to fetch contaminated water from a distant pond. We plan to build a solar-powered deep water well that will serve 300+ families. Clean water will reduce waterborne diseases and give children more time for school.',
    'Nagarparkar Village Community',
    'Mithi',
    650000.00,
    420000.00,
    'high',
    '0300-7776655',
    '0321-6655443',
    true,
    true
),

('Dialysis Treatment for Muhammad Iqbal', 'dialysis-muhammad-iqbal',
    (SELECT id FROM donation_categories WHERE slug = 'medical' LIMIT 1),
    'Support ongoing dialysis treatment for a retired government employee with kidney failure.',
    'Muhammad Iqbal (58) retired as a school teacher after 30 years of service. He was diagnosed with kidney failure last year and needs dialysis twice a week. Each session costs PKR 8,000 and his pension barely covers household expenses. Your donation will help him continue life-saving treatment while waiting for a kidney transplant.',
    'Muhammad Iqbal (Retired Teacher)',
    'Multan',
    500000.00,
    185000.00,
    'urgent',
    '0300-8887766',
    '0321-7766554',
    true,
    true
)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- VOLUNTEERS (15 volunteer profiles)
-- =====================================================
INSERT INTO public.volunteers (skills, areas_of_interest, city, area, availability, hours_per_week, experience, is_active, tasks_completed) VALUES
(ARRAY['Teaching', 'Tutoring', 'Mentoring'], ARRAY['Education', 'Youth Development'], 'Lahore', 'Gulberg', 'weekends', 10, 'University professor with 8 years experience. Passionate about educating underprivileged youth.', true, 25),
(ARRAY['First Aid', 'Emergency Response', 'CPR'], ARRAY['Healthcare', 'Emergency Response'], 'Karachi', 'Clifton', 'evenings', 12, 'Certified paramedic with Red Crescent experience. Available for health camps.', true, 18),
(ARRAY['Web Development', 'IT Support', 'Digital Literacy'], ARRAY['Technology', 'Education'], 'Islamabad', 'F-10', 'flexible', 15, 'Software engineer at a tech company. Love teaching coding to kids.', true, 30),
(ARRAY['Legal Aid', 'Documentation', 'Advocacy'], ARRAY['Legal Rights', 'Women Rights'], 'Lahore', 'Model Town', 'weekdays', 8, 'Lawyer with expertise in family law. Provides free legal consultations.', true, 22),
(ARRAY['Social Work', 'Counseling', 'Community Organizing'], ARRAY['Community Development', 'Mental Health'], 'Karachi', 'Nazimabad', 'both', 20, 'Social worker with NGO experience. Focuses on women empowerment.', true, 45),
(ARRAY['Construction', 'Plumbing', 'Electrical'], ARRAY['Housing', 'Infrastructure'], 'Rawalpindi', 'Saddar', 'weekends', 6, 'Retired engineer offering technical skills for community projects.', true, 12),
(ARRAY['Healthcare', 'Nursing', 'Patient Care'], ARRAY['Healthcare', 'Elderly Care'], 'Faisalabad', 'Peoples Colony', 'evenings', 10, 'Registered nurse volunteering at old age homes on weekends.', true, 35),
(ARRAY['Photography', 'Videography', 'Content Creation'], ARRAY['Media', 'Awareness'], 'Lahore', 'DHA', 'flexible', 8, 'Professional photographer documenting volunteer activities.', true, 20),
(ARRAY['Event Management', 'Fundraising', 'Public Relations'], ARRAY['Events', 'Fundraising'], 'Islamabad', 'G-11', 'weekends', 12, 'Marketing professional organizing charity events.', true, 28),
(ARRAY['Environmental Conservation', 'Tree Plantation', 'Clean-up Drives'], ARRAY['Environment', 'Climate Action'], 'Lahore', 'Johar Town', 'both', 15, 'Environmental activist leading plantation drives.', true, 55),
(ARRAY['Teaching', 'Sign Language', 'Special Education'], ARRAY['Disability Support', 'Education'], 'Karachi', 'Gulshan', 'weekdays', 10, 'Special education teacher helping hearing-impaired children.', true, 40),
(ARRAY['Driving', 'Logistics', 'Transportation'], ARRAY['Logistics', 'Emergency Response'], 'Multan', 'Cantt', 'flexible', 20, 'Owns vehicle and helps transport medical supplies and patients.', true, 15),
(ARRAY['Cooking', 'Food Distribution', 'Event Catering'], ARRAY['Food Security', 'Community Service'], 'Peshawar', 'Hayatabad', 'weekends', 8, 'Chef organizing free meal distributions for homeless.', true, 38),
(ARRAY['Youth Mentoring', 'Sports Coaching', 'Career Counseling'], ARRAY['Youth Development', 'Sports'], 'Lahore', 'Iqbal Town', 'evenings', 10, 'Former national athlete coaching underprivileged youth.', true, 32),
(ARRAY['Mental Health', 'Counseling', 'Support Groups'], ARRAY['Mental Health', 'Community Support'], 'Islamabad', 'F-8', 'both', 12, 'Clinical psychologist offering free counseling sessions.', true, 26)
ON CONFLICT DO NOTHING;


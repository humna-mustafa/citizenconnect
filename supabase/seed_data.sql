-- Seed Data for CitizenConnect Demo
-- Run this in Supabase SQL Editor after running migrations
-- This will populate your database with sample data for demonstration

-- =====================================================
-- SAMPLE GUIDES
-- =====================================================

-- Insert sample guides (after you have a user account)
-- Replace 'YOUR_USER_ID' with an actual user ID from profiles table

INSERT INTO public.guides (title, slug, category_id, problem_explanation, steps, required_documents, contact_phones, timeline_expectation, author_id, is_published) VALUES

('How to Get CNIC (National ID Card)', 'get-cnic-pakistan', 
    (SELECT id FROM categories WHERE slug = 'roads-transport' LIMIT 1),
    'Complete guide to obtaining your Computerized National Identity Card (CNIC) from NADRA.',
    '[
        {"number": 1, "title": "Gather Required Documents", "description": "Before visiting NADRA, collect all necessary documents including B-Form, parent CNICs, and photos."},
        {"number": 2, "title": "Visit NADRA Center", "description": "Go to your nearest NADRA Registration Center during working hours."},
        {"number": 3, "title": "Fill Application Form", "description": "Complete the CNIC application form with accurate information."},
        {"number": 4, "title": "Biometric Verification", "description": "Your fingerprints and photo will be taken."},
        {"number": 5, "title": "Pay Fee and Collect Receipt", "description": "Pay the fee and keep your receipt safe for collection."},
        {"number": 6, "title": "Collect Your CNIC", "description": "Return to collect your CNIC in 15-30 working days."}
    ]'::jsonb,
    ARRAY['Original B-Form', 'Parent CNIC copies', '2 passport photos', 'Utility bill for address proof'],
    ARRAY['111-786-100'],
    '15-30 working days',
    (SELECT id FROM profiles LIMIT 1),
    true
),

('How to Apply for Passport', 'apply-for-passport', 
    (SELECT id FROM categories WHERE slug = 'roads-transport' LIMIT 1),
    'Step-by-step process to apply for Pakistani passport online and offline.',
    '[
        {"number": 1, "title": "Register Online", "description": "Visit passport.gov.pk and create an account."},
        {"number": 2, "title": "Fill Online Form", "description": "Complete the passport application form online."},
        {"number": 3, "title": "Upload Documents", "description": "Scan and upload required documents."},
        {"number": 4, "title": "Book Appointment", "description": "Select date and time for biometric verification."},
        {"number": 5, "title": "Visit Passport Office", "description": "Go to passport office on scheduled date with original documents."},
        {"number": 6, "title": "Pay Fee", "description": "Pay passport fee and collect token."},
        {"number": 7, "title": "Receive Passport", "description": "Collect passport or opt for home delivery."}
    ]'::jsonb,
    ARRAY['CNIC copy', 'Birth certificate', '4 passport photos', 'Fee challan'],
    ARRAY['051-111-243-243'],
    '15-21 working days',
    (SELECT id FROM profiles LIMIT 1),
    true
),

('Complaint Against Electricity Overbilling', 'electricity-complaint', 
    (SELECT id FROM categories WHERE slug = 'electricity-gas' LIMIT 1),
    'How to file a formal complaint against electricity overbilling or wrong meter reading.',
    '[
        {"number": 1, "title": "Check Your Bill", "description": "Compare current bill with previous months and note discrepancies."},
        {"number": 2, "title": "Contact Customer Service", "description": "Call LESCO/IESCO/PESCO helpline first."},
        {"number": 3, "title": "Visit Customer Care Center", "description": "If not resolved, visit nearest customer care with bill copies."},
        {"number": 4, "title": "File Written Complaint", "description": "Submit formal written complaint with evidence."},
        {"number": 5, "title": "Get Meter Re-checked", "description": "Request meter inspection if needed."},
        {"number": 6, "title": "Escalate to NEPRA", "description": "If unresolved, file complaint with NEPRA (National Electric Power Regulatory Authority)."}
    ]'::jsonb,
    ARRAY['Last 3 months bills', 'CNIC copy', 'Meter reading photos'],
    ARRAY['118', '051-9206600'],
    '7-14 working days',
    (SELECT id FROM profiles LIMIT 1),
    true
);

-- =====================================================
-- SAMPLE DONATION CAMPAIGNS
-- =====================================================

INSERT INTO public.donation_cases (title, slug, category_id, description, story, beneficiary_name, goal_amount, raised_amount, jazzcash_number, easypaisa_number, is_verified, is_active, author_id) VALUES

('Help Ali Fight Cancer', 'help-ali-fight-cancer',
    (SELECT id FROM donation_categories WHERE slug = 'medical' LIMIT 1),
    'Help 8-year-old Ali undergo life-saving cancer treatment at Shaukat Khanum Hospital.',
    'Ali is a bright 8-year-old from Lahore who loves playing cricket. Three months ago, he was diagnosed with Acute Lymphoblastic Leukemia (ALL). His family cannot afford the expensive chemotherapy treatment. Your donation can help save Ali''s life.',
    'Ali Hassan',
    500000.00,
    125000.00,
    '0300-1234567',
    '0321-7654321',
    true,
    true,
    (SELECT id FROM profiles LIMIT 1)
),

('Flood Relief Fund - Sindh', 'flood-relief-sindh',
    (SELECT id FROM donation_categories WHERE slug = 'disaster' LIMIT 1),
    'Emergency relief for flood-affected families in Sindh province.',
    'Devastating floods have affected over 10,000 families in rural Sindh. They urgently need food, clean water, medicine, and temporary shelter. Every donation helps rebuild lives.',
    'Citizens of Sindh',
    1000000.00,
    450000.00,
    '0300-9999888',
    '0321-8888999',
    true,
    true,
    (SELECT id FROM profiles LIMIT 1)
),

('Build a School in Balochistan', 'build-school-balochistan',
    (SELECT id FROM donation_categories WHERE slug = 'education' LIMIT 1),
    'Help construct a school for underprivileged children in rural Balochistan.',
    'In the remote village of Panjgur, 200+ children walk 10km daily for education. We aim to build a primary school with 6 classrooms, a library, and clean drinking water facilities.',
    'Panjgur Education Trust',
    750000.00,
    280000.00,
    '0300-5556666',
    '0321-6667777',
    true,
    true,
    (SELECT id FROM profiles LIMIT 1)
);

-- =====================================================
-- SAMPLE BLOOD DONORS
-- =====================================================

-- Note: These need real user IDs. Create users first, then run this.
-- Or update user_id after creating test accounts

INSERT INTO public.blood_donors (blood_group, city, area, is_available, last_donation_date, donation_count, contact_phone, notes) VALUES
('O+', 'Lahore', 'Gulberg', true, '2024-09-15', 5, '0300-1111222', 'Available on weekends'),
('A+', 'Karachi', 'Clifton', true, '2024-10-20', 3, '0321-3334444', 'Can donate anytime'),
('B+', 'Islamabad', 'F-7', true, '2024-11-01', 2, '0333-5556666', 'Prefer evening slots'),
('AB+', 'Lahore', 'DHA', false, '2024-11-25', 1, '0345-7778888', 'Recently donated, available after Jan 2025'),
('O-', 'Karachi', 'North Nazimabad', true, '2024-08-10', 7, '0311-9991000', 'Universal donor, ready to help')
ON CONFLICT (user_id) DO NOTHING;

-- =====================================================
-- SAMPLE BLOOD REQUESTS
-- =====================================================

INSERT INTO public.blood_requests (patient_name, blood_group, units_needed, hospital_name, hospital_address, city, contact_phone, urgency_level, status, notes) VALUES
('Muhammad Bilal', 'O+', 2, 'Jinnah Hospital', 'Jinnah Hospital, Lahore', 'Lahore', '0300-2223344', 'urgent', 'open', 'Surgery scheduled for tomorrow'),
('Fatima Noor', 'A+', 1, 'Aga Khan Hospital', 'Stadium Road, Karachi', 'Karachi', '0321-4445566', 'critical', 'open', 'Emergency - please help urgently'),
('Ahmed Raza', 'B-', 3, 'PIMS Hospital', 'G-8, Islamabad', 'Islamabad', '0333-6667788', 'normal', 'open', 'Thalassemia patient')
ON CONFLICT DO NOTHING;

-- =====================================================
-- SAMPLE VOLUNTEERS
-- =====================================================

INSERT INTO public.volunteers (skills, areas_of_interest, city, area, availability, hours_per_week, experience, is_active, tasks_completed) VALUES
(ARRAY['Teaching', 'Tutoring', 'Mentoring'], ARRAY['Education', 'Youth Development'], 'Lahore', 'Model Town', 'weekends', 8, 'University lecturer with 5 years experience. Love helping students.', true, 12),
(ARRAY['First Aid', 'Paramedic', 'Doctor'], ARRAY['Healthcare', 'Emergency Response'], 'Karachi', 'Clifton', 'both', 15, 'Medical professional, available for health camps and emergency situations.', true, 8),
(ARRAY['IT Support', 'Web Development', 'Training'], ARRAY['Technology', 'Education'], 'Islamabad', 'F-10', 'flexible', 10, 'Software developer willing to teach coding and computer skills.', true, 5)
ON CONFLICT (user_id) DO NOTHING;

-- =====================================================
-- SAMPLE COMMENTS
-- =====================================================

-- Add comments to guides (replace guide_id with actual IDs)
INSERT INTO public.comments (guide_id, content, is_tip) VALUES
((SELECT id FROM guides WHERE slug = 'get-cnic-pakistan' LIMIT 1), 
 'Very helpful guide! I got my CNIC in just 2 weeks by following these steps.', false),
((SELECT id FROM guides WHERE slug = 'get-cnic-pakistan' LIMIT 1), 
 'Pro tip: Visit NADRA office early morning (8-9 AM) to avoid long queues!', true),
((SELECT id FROM guides WHERE slug = 'apply-for-passport' LIMIT 1), 
 'The online booking system saved me so much time. Highly recommend!', false)
ON CONFLICT DO NOTHING;

-- =====================================================
-- UPDATE STATISTICS
-- =====================================================

-- Manually trigger stats update
SELECT update_daily_stats();

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Check what was inserted
SELECT 'Guides Created:' as info, COUNT(*) as count FROM guides WHERE is_published = true
UNION ALL
SELECT 'Donation Campaigns:', COUNT(*) FROM donation_cases WHERE is_active = true
UNION ALL
SELECT 'Blood Donors:', COUNT(*) FROM blood_donors WHERE is_available = true
UNION ALL
SELECT 'Blood Requests:', COUNT(*) FROM blood_requests WHERE status = 'open'
UNION ALL
SELECT 'Volunteers:', COUNT(*) FROM volunteers WHERE is_active = true
UNION ALL
SELECT 'Comments:', COUNT(*) FROM comments;

-- =====================================================
-- ADMIN USER SETUP (Optional)
-- =====================================================

-- After creating your first user account, update their role to admin:
-- UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';

-- =====================================================
-- NOTES
-- =====================================================

-- 1. Some tables have foreign key constraints (user_id, author_id)
--    You need to create user accounts first, then update these inserts
-- 
-- 2. For blood_donors and volunteers, you can either:
--    - Create accounts and register through the UI
--    - Or insert with user_id = (SELECT id FROM profiles WHERE email = 'test@example.com')
--
-- 3. To create sample donations:
--    INSERT INTO donations (case_id, amount, status) VALUES
--    ((SELECT id FROM donation_cases LIMIT 1), 5000, 'completed');
--
-- 4. Test real-time notifications by creating blood requests
--    matching registered donors

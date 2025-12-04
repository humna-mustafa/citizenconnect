-- Seed Guides Remaining SQL Script
-- Run this in Supabase SQL Editor AFTER running seed-guides.sql
-- This adds the remaining categories: Electricity, Health, Education, Social, Legal, Govt

DO $$
DECLARE
    electric_cat_id UUID;
    health_cat_id UUID;
    edu_cat_id UUID;
    social_cat_id UUID;
    legal_cat_id UUID;
    govt_cat_id UUID;
BEGIN
    -- Create Categories if they don't exist
    INSERT INTO categories (name, slug, description, icon) VALUES 
    ('Electricity & Gas', 'electricity-gas', 'Power connections, billing, and gas services', 'zap'),
    ('Health', 'health', 'Medical services, hospitals, and health cards', 'heart'),
    ('Education', 'education', 'Schools, scholarships, and degree attestation', 'book'),
    ('Social Causes', 'social-causes', 'Welfare, rights, and social protection', 'users'),
    ('Legal', 'legal', 'Police, courts, and legal documentation', 'scale'),
    ('Government Services', 'government-services', 'CNIC, passport, and official certificates', 'building')
    ON CONFLICT (slug) DO NOTHING;

    -- Get Category IDs
    SELECT id INTO electric_cat_id FROM categories WHERE slug = 'electricity-gas';
    SELECT id INTO health_cat_id FROM categories WHERE slug = 'health';
    SELECT id INTO edu_cat_id FROM categories WHERE slug = 'education';
    SELECT id INTO social_cat_id FROM categories WHERE slug = 'social-causes';
    SELECT id INTO legal_cat_id FROM categories WHERE slug = 'legal';
    SELECT id INTO govt_cat_id FROM categories WHERE slug = 'government-services';

    -- ELECTRICITY & GAS GUIDES
    INSERT INTO guides (title, slug, category_id, problem_explanation, steps, required_documents, timeline_expectation, estimated_cost, pro_tips, is_published, views_count, upvotes_count) VALUES
    ('LESCO New Connection', 'lesco-new-connection', electric_cat_id, 'Apply for a new electricity connection with LESCO.', '[{"number": 1, "title": "Apply Online", "description": "Visit ENC.com.pk website."}]', '["CNIC", "Property Documents"]', '30 days', 'Varies by load', 'Apply for 3-phase if load > 5kW', true, 120, 15),
    ('Gas Connection SNGPL', 'gas-connection-sngpl', electric_cat_id, 'New gas connection application process.', '[{"number": 1, "title": "Submit Form", "description": "Visit SNGPL office."}]', '["CNIC", "Property Docs"]', '6-12 months', 'Rs. 6000+', 'Long waiting lists exist', true, 200, 45),
    ('Report Electricity Theft', 'report-electricity-theft', electric_cat_id, 'How to report power theft anonymously.', '[{"number": 1, "title": "Call Helpline", "description": "Dial 118 or local subdivision."}]', '["None"]', 'Immediate', 'Free', 'Do not confront thieves', true, 80, 10),
    ('Net Metering Application', 'net-metering-application', electric_cat_id, 'Install solar net metering to sell power back.', '[{"number": 1, "title": "Install Solar", "description": "Get system from AEDB vendor."}]', '["CNIC", "Load Sanction"]', '3-4 months', 'Rs. 20,000 fee', 'Requires 3-phase meter', true, 300, 80),
    ('Electricity Bill Installments', 'electricity-bill-installments', electric_cat_id, 'How to pay high bills in installments.', '[{"number": 1, "title": "Visit Office", "description": "Go to Revenue Officer."}]', '["Bill Copy", "CNIC"]', 'Same day', 'Free', 'Only once a year usually', true, 150, 25),
    ('Change of Name on Bill', 'change-name-bill', electric_cat_id, 'Transfer electricity meter to new owner.', '[{"number": 1, "title": "Apply", "description": "Submit change of name form."}]', '["Sale Deed", "CNIC"]', '30 days', 'Rs. 1000', 'Clear dues first', true, 90, 12),
    ('Solar System Installation', 'solar-system-installation', electric_cat_id, 'Guide to installing home solar system.', '[{"number": 1, "title": "Assessment", "description": "Calculate load requirements."}]', '["Roof Space"]', '1 week', 'Rs. 100k/kW', 'South facing panels best', true, 250, 60),
    ('Report Gas Leakage', 'report-gas-leakage', electric_cat_id, 'Emergency reporting for gas leaks.', '[{"number": 1, "title": "Call 1199", "description": "SNGPL/SSGC emergency."}]', '["None"]', 'Immediate', 'Free', 'Open windows immediately', true, 110, 30),
    ('Online Bill Payment', 'online-bill-payment', electric_cat_id, 'Pay utility bills via banking apps.', '[{"number": 1, "title": "Open App", "description": "Select Bill Payment."}]', '["Consumer ID"]', 'Instant', 'Free', 'Save receipt', true, 400, 90),
    ('UPS Battery Maintenance', 'ups-battery-maintenance', electric_cat_id, 'Tips for maintaining UPS batteries.', '[{"number": 1, "title": "Check Water", "description": "Top up distilled water."}]', '["Distilled Water"]', 'Monthly', 'Rs. 100', 'Keep terminals clean', true, 180, 40),
    ('Green Meter Application', 'green-meter-application', electric_cat_id, 'Getting a green meter for solar.', '[{"number": 1, "title": "Apply", "description": "Submit file to DISCO."}]', '["Inspection Report"]', '2 months', 'Meter cost', 'Vendor handles mostly', true, 220, 55),
    ('Load Extension', 'load-extension', electric_cat_id, 'Increasing your sanctioned load limit.', '[{"number": 1, "title": "Apply", "description": "Form A-1 for extension."}]', '["Bill", "CNIC"]', '15 days', 'Security deposit', 'Avoid penalties', true, 70, 8),
    ('Faulty Meter Replacement', 'faulty-meter-replacement', electric_cat_id, 'Replace burnt or stopped meter.', '[{"number": 1, "title": "Report", "description": "Inform subdivision."}]', '["Bill"]', '1-2 weeks', 'Free if technical fault', 'Pay average bill meanwhile', true, 130, 20),
    ('Peak Hours Saving', 'peak-hours-saving', electric_cat_id, 'Save money by avoiding peak hours.', '[{"number": 1, "title": "Check Time", "description": "Usually 6pm-10pm."}]', '["None"]', 'Daily', 'Free', 'Turn off ACs', true, 350, 75),
    ('Generator Safety', 'generator-safety', electric_cat_id, 'Safe operation of backup generators.', '[{"number": 1, "title": "Placement", "description": "Open air only."}]', '["None"]', 'N/A', 'N/A', 'Never run indoors', true, 100, 15),
    ('IESCO New Connection', 'iesco-new-connection', electric_cat_id, 'Islamabad electricity connection.', '[{"number": 1, "title": "Apply", "description": "Online ENC portal."}]', '["Docs"]', '30 days', 'Standard rates', 'Check status online', true, 140, 22),
    ('K-Electric Bill SMS', 'ke-bill-sms', electric_cat_id, 'Get KE bill via SMS.', '[{"number": 1, "title": "Register", "description": "SMS REG <space> AccNo to 8119."}]', '["Mobile"]', 'Instant', 'SMS charges', 'Timely updates', true, 280, 65),
    ('Demand Notice Payment', 'demand-notice-payment', electric_cat_id, 'How to pay connection demand notice.', '[{"number": 1, "title": "Bank", "description": "Pay at designated bank."}]', '["DN Challan"]', '1 day', 'As per DN', 'Keep copy safe', true, 95, 10),
    ('Street Light Complaint', 'street-light-complaint', electric_cat_id, 'Fix broken street lights.', '[{"number": 1, "title": "Report", "description": "Local municipal app."}]', '["Location"]', '1 week', 'Free', 'Mark pole number', true, 160, 28),
    ('Gas Low Pressure', 'gas-low-pressure', electric_cat_id, 'Report low gas pressure.', '[{"number": 1, "title": "Call", "description": "Helpline 1199."}]', '["Consumer No"]', '24 hours', 'Free', 'Check neighbors first', true, 190, 35),
    ('Disconnection Restoration', 'disconnection-restoration', electric_cat_id, 'Restore supply after non-payment.', '[{"number": 1, "title": "Pay Dues", "description": "Clear all bills + reconnection fee."}]', '["Paid Bill"]', '24 hours', 'Reconnection fee', 'Visit office', true, 110, 18),
    ('Temporary Connection', 'temporary-connection', electric_cat_id, 'Electricity for construction/events.', '[{"number": 1, "title": "Apply", "description": "Temporary connection form."}]', '["CNIC", "Purpose"]', '3 days', 'Higher tariff', 'Prepaid usually', true, 60, 5),
    ('Understanding Bill', 'understanding-bill', electric_cat_id, 'Guide to reading electricity bill.', '[{"number": 1, "title": "Read", "description": "Check FPA, Taxes, Units."}]', '["Bill"]', 'N/A', 'Free', 'Check meter reading image', true, 310, 70),
    ('Energy Saver Tips', 'energy-saver-tips', electric_cat_id, 'Reduce electricity consumption.', '[{"number": 1, "title": "Switch", "description": "Use LEDs and Inverters."}]', '["None"]', 'Ongoing', 'Savings', 'Clean AC filters', true, 450, 95),
    ('SSGC Online Bill', 'ssgc-online-bill', electric_cat_id, 'Download SSGC duplicate bill.', '[{"number": 1, "title": "Website", "description": "Visit ssgc.com.pk."}]', '["Consumer No"]', 'Instant', 'Free', 'Print for payment', true, 230, 48)
    ON CONFLICT (slug) DO NOTHING;

    -- HEALTH GUIDES
    INSERT INTO guides (title, slug, category_id, problem_explanation, steps, required_documents, timeline_expectation, estimated_cost, pro_tips, is_published, views_count, upvotes_count) VALUES
    ('Sehat Sahulat Card', 'sehat-sahulat-card', health_cat_id, 'Check eligibility for health card.', '[{"number": 1, "title": "SMS", "description": "Send CNIC to 8500."}]', '["CNIC"]', 'Instant', 'Free', 'Coverage up to 1M', true, 500, 120),
    ('Dengue Prevention', 'dengue-prevention', health_cat_id, 'Prevent dengue breeding.', '[{"number": 1, "title": "Clean Water", "description": "Remove standing water."}]', '["None"]', 'Daily', 'Free', 'Use repellent', true, 300, 60),
    ('Polio Vaccination', 'polio-vaccination', health_cat_id, 'Polio drops schedule.', '[{"number": 1, "title": "Teams", "description": "Door to door teams."}]', '["Child"]', 'Campaign days', 'Free', 'Mandatory for travel', true, 200, 40),
    ('COVID Certificate', 'covid-certificate', health_cat_id, 'Download NIMS certificate.', '[{"number": 1, "title": "NIMS Website", "description": "nims.nadra.gov.pk"}]', '["CNIC", "Date of Dose"]', 'Instant', 'Rs. 100', 'Keep PDF saved', true, 450, 90),
    ('Blood Donation', 'blood-donation', health_cat_id, 'How to donate blood safely.', '[{"number": 1, "title": "Center", "description": "Visit blood bank."}]', '["CNIC", "Good Health"]', '30 mins', 'Free', 'Eat before donating', true, 180, 50),
    ('First Aid Burns', 'first-aid-burns', health_cat_id, 'Immediate treatment for burns.', '[{"number": 1, "title": "Cool Water", "description": "Run cool water for 20 mins."}]', '["Water"]', 'Immediate', 'Free', 'No ice or toothpaste', true, 250, 70),
    ('CPR Guide', 'cpr-guide', health_cat_id, 'Basic CPR steps.', '[{"number": 1, "title": "Push Hard", "description": "Chest compressions."}]', '["Hands"]', 'Until help arrives', 'Free', 'Call 1122 first', true, 320, 85),
    ('Ambulance Services', 'ambulance-services', health_cat_id, 'Emergency ambulance numbers.', '[{"number": 1, "title": "Call", "description": "Edhi 115, Rescue 1122, Chhipa 1020."}]', '["Phone"]', '10 mins', 'Varies', '1122 is best equipped', true, 400, 100),
    ('Mental Health Help', 'mental-health-help', health_cat_id, 'Helplines for mental support.', '[{"number": 1, "title": "Call", "description": "Umang 0311-7786264."}]', '["Phone"]', '24/7', 'Free', 'Confidential', true, 150, 35),
    ('Drug Abuse Report', 'drug-abuse-report', health_cat_id, 'Report drug peddling.', '[{"number": 1, "title": "ANF", "description": "Call 1415."}]', '["Location"]', 'Immediate', 'Free', 'Anonymous', true, 120, 25),
    ('Food Adulteration', 'food-adulteration', health_cat_id, 'Report unsafe food.', '[{"number": 1, "title": "Food Authority", "description": "Punjab Food Authority 1223."}]', '["Evidence"]', '24 hours', 'Free', 'Take photos', true, 210, 45),
    ('Free Insulin', 'free-insulin', health_cat_id, 'Govt free insulin program.', '[{"number": 1, "title": "Hospital", "description": "Visit DHQ hospital."}]', '["Prescription", "CNIC"]', 'Monthly', 'Free', 'For registered patients', true, 170, 40),
    ('Thalassemia Support', 'thalassemia-support', health_cat_id, 'Support for Thalassemia patients.', '[{"number": 1, "title": "Register", "description": "Sundas Foundation / Fatimid."}]', '["Medical Reports"]', 'Ongoing', 'Free/Subsidized', 'Regular transfusions', true, 140, 30),
    ('Hepatitis C Treatment', 'hepatitis-c-treatment', health_cat_id, 'Free treatment program.', '[{"number": 1, "title": "Screening", "description": "Get tested at DHQ."}]', '["CNIC"]', '3-6 months', 'Free', 'Complete the course', true, 190, 42),
    ('Vaccination Center', 'vaccination-center', health_cat_id, 'Find nearest center.', '[{"number": 1, "title": "Search", "description": "Google Maps or 1166."}]', '["None"]', 'N/A', 'Free', 'Check timings', true, 220, 48),
    ('Medical Store Complaint', 'medical-store-complaint', health_cat_id, 'Report overcharging/fake drugs.', '[{"number": 1, "title": "Report", "description": "Drug Inspector or 1033."}]', '["Receipt"]', '1 week', 'Free', 'Keep receipt', true, 130, 20),
    ('Mother Child Health', 'mother-child-health', health_cat_id, 'MCH center services.', '[{"number": 1, "title": "Visit", "description": "Local BHU/RHC."}]', '["CNIC"]', 'Ongoing', 'Free', 'Antenatal care', true, 160, 38),
    ('Dog Bite Treatment', 'dog-bite-treatment', health_cat_id, 'Rabies vaccine guide.', '[{"number": 1, "title": "Wash", "description": "Wash with soap 15 mins."}]', '["Vaccine"]', 'Immediate', 'Free at Govt Hosp', 'Don''t delay', true, 240, 55),
    ('Smog Protection', 'smog-protection', health_cat_id, 'Protect from air pollution.', '[{"number": 1, "title": "Mask", "description": "Wear N95 mask."}]', '["Mask"]', 'Winter', 'Low', 'Avoid outdoor exercise', true, 310, 75),
    ('Heatstroke Prevention', 'heatstroke-prevention', health_cat_id, 'Stay safe in summer.', '[{"number": 1, "title": "Hydrate", "description": "Drink ORS/Water."}]', '["Water"]', 'Summer', 'Free', 'Stay indoors', true, 290, 65)
    ON CONFLICT (slug) DO NOTHING;

    -- EDUCATION GUIDES
    INSERT INTO guides (title, slug, category_id, problem_explanation, steps, required_documents, timeline_expectation, estimated_cost, pro_tips, is_published, views_count, upvotes_count) VALUES
    ('HEC Degree Attestation', 'hec-degree-attestation', edu_cat_id, 'Attest degrees from HEC.', '[{"number": 1, "title": "Portal", "description": "eservices.hec.gov.pk"}]', '["Original Degree", "Transcripts"]', '15 days', 'Rs. 1000+', 'TCS courier option available', true, 600, 150),
    ('PEC Registration', 'pec-registration', edu_cat_id, 'Engineer registration.', '[{"number": 1, "title": "Apply", "description": "portal.pec.org.pk"}]', '["Degree", "CNIC"]', '1 month', 'Rs. 2000+', 'CPD points needed for renewal', true, 350, 80),
    ('PMDC Registration', 'pmdc-registration', edu_cat_id, 'Doctor registration.', '[{"number": 1, "title": "Online", "description": "pmc.gov.pk"}]', '["MBBS Degree"]', '1 month', 'Fee varies', 'Mandatory for practice', true, 320, 75),
    ('IBCC Equivalence', 'ibcc-equivalence', edu_cat_id, 'O/A Level equivalence.', '[{"number": 1, "title": "Apply", "description": "ibcc.edu.pk"}]', '["Certificates"]', '2 weeks', 'Rs. 2000+', 'Required for university', true, 400, 95),
    ('Ehsaas Scholarship', 'ehsaas-scholarship', edu_cat_id, 'Undergraduate scholarship.', '[{"number": 1, "title": "Apply", "description": "hec.gov.pk/ehsaas"}]', '["Income Cert"]', 'Annual', 'Full tuition', 'Need based', true, 550, 130),
    ('PEEF Scholarship', 'peef-scholarship', edu_cat_id, 'Punjab Educational Endowment Fund.', '[{"number": 1, "title": "Form", "description": "peef.org.pk"}]', '["Domicile", "Marksheet"]', 'Annual', 'Stipend', 'Merit based', true, 480, 110),
    ('CSS Exam Registration', 'css-exam-registration', edu_cat_id, 'Apply for CSS exam.', '[{"number": 1, "title": "FPSC", "description": "fpsc.gov.pk"}]', '["Bachelor Degree"]', 'Oct-Nov', 'Rs. 2200', 'Prepare early', true, 650, 160),
    ('MDCAT Registration', 'mdcat-registration', edu_cat_id, 'Medical entrance exam.', '[{"number": 1, "title": "PMDC", "description": "Register online."}]', '["FSc Result"]', 'Aug-Sep', 'Rs. 6000', 'Study syllabus', true, 500, 120),
    ('E-Rozgaar Training', 'e-rozgaar-training', edu_cat_id, 'Freelancing training.', '[{"number": 1, "title": "Apply", "description": "erozgaar.pitb.gov.pk"}]', '["16 Years Edu"]', '3 months', 'Free', 'Earn online', true, 420, 100),
    ('TEVTA Admission', 'tevta-admission', edu_cat_id, 'Technical skills courses.', '[{"number": 1, "title": "Visit", "description": "Local TEVTA institute."}]', '["Matric"]', '3-6 months', 'Low/Free', 'Practical skills', true, 280, 60),
    ('AIOU Admission', 'aiou-admission', edu_cat_id, 'Distance learning admission.', '[{"number": 1, "title": "Online", "description": "aiou.edu.pk"}]', '["Docs"]', 'Semester wise', 'Low cost', 'Study from home', true, 380, 85),
    ('Virtual University', 'virtual-university', edu_cat_id, 'Online degree programs.', '[{"number": 1, "title": "Apply", "description": "vu.edu.pk"}]', '["Docs"]', 'Semester wise', 'Moderate', 'IT degrees good', true, 340, 78),
    ('Foreign Scholarship NOC', 'foreign-scholarship-noc', edu_cat_id, 'NOC for studying abroad.', '[{"number": 1, "title": "Ministry", "description": "Education Ministry."}]', '["Offer Letter"]', '2 weeks', 'Free', 'Check visa reqs', true, 200, 45),
    ('School Complaint', 'school-complaint', edu_cat_id, 'Report private school issues.', '[{"number": 1, "title": "CEO Edu", "description": "District Education Authority."}]', '["Application"]', '15 days', 'Free', 'Fee hikes regulated', true, 180, 40),
    ('Public Library Card', 'public-library-card', edu_cat_id, 'Membership for libraries.', '[{"number": 1, "title": "Visit", "description": "Quaid-e-Azam Library etc."}]', '["CNIC", "Photos"]', '1 day', 'Rs. 500', 'Quiet study place', true, 150, 35),
    ('Literacy Centers', 'literacy-centers', edu_cat_id, 'Adult education.', '[{"number": 1, "title": "Locate", "description": "Literacy Dept."}]', '["CNIC"]', '6 months', 'Free', 'Basic reading/writing', true, 120, 25),
    ('Special Education', 'special-education', edu_cat_id, 'Schools for special children.', '[{"number": 1, "title": "Visit", "description": "Special Edu Dept."}]', '["Disability Cert"]', 'Annual', 'Free', 'Transport provided', true, 160, 38),
    ('B-Form for School', 'b-form-school', edu_cat_id, 'B-Form requirement.', '[{"number": 1, "title": "NADRA", "description": "Get B-Form."}]', '["Birth Cert"]', '1 week', 'Rs. 50', 'Mandatory for admission', true, 450, 105),
    ('Attestation MOFA', 'attestation-mofa', edu_cat_id, 'Foreign office attestation.', '[{"number": 1, "title": "Courier", "description": "Gerrys/Leopard."}]', '["Attested Docs"]', '1 week', 'Fee varies', 'Final step for abroad', true, 520, 125),
    ('Learn Quran Online', 'learn-quran-online', edu_cat_id, 'Govt Quran initiatives.', '[{"number": 1, "title": "Search", "description": "Approved centers."}]', '["None"]', 'Ongoing', 'Varies', 'Verify tutor', true, 250, 55)
    ON CONFLICT (slug) DO NOTHING;

    -- SOCIAL CAUSES GUIDES
    INSERT INTO guides (title, slug, category_id, problem_explanation, steps, required_documents, timeline_expectation, estimated_cost, pro_tips, is_published, views_count, upvotes_count) VALUES
    ('Zakat Eligibility', 'zakat-eligibility', social_cat_id, 'How to get Zakat.', '[{"number": 1, "title": "Committee", "description": "Local Zakat Committee."}]', '["CNIC", "Poverty Proof"]', 'Ramadan', 'Free', 'Apply before Ramadan', true, 300, 70),
    ('Orphan Sponsorship', 'orphan-sponsorship', social_cat_id, 'Sponsor an orphan.', '[{"number": 1, "title": "NGO", "description": "Al-Khidmat / Edhi."}]', '["Donation"]', 'Monthly', 'Rs. 3000-5000', 'Regular reports', true, 220, 50),
    ('Shelter Homes', 'shelter-homes', social_cat_id, 'Panahgah locations.', '[{"number": 1, "title": "Visit", "description": "Nearest Panahgah."}]', '["None"]', 'Nightly', 'Free', 'Food included', true, 280, 65),
    ('Report Child Labor', 'report-child-labor', social_cat_id, 'Stop child labor.', '[{"number": 1, "title": "Call", "description": "1121 Helpline."}]', '["Location"]', 'Immediate', 'Free', 'Anonymous', true, 190, 45),
    ('Domestic Violence', 'domestic-violence', social_cat_id, 'Report abuse.', '[{"number": 1, "title": "Call", "description": "1043 Women Helpline."}]', '["None"]', 'Immediate', 'Free', 'Safe houses available', true, 250, 60),
    ('Women Safety App', 'women-safety-app', social_cat_id, 'PSCA Women Safety.', '[{"number": 1, "title": "Install", "description": "Play Store."}]', '["Smartphone"]', 'Instant', 'Free', 'Live location share', true, 320, 80),
    ('Transgender Card', 'transgender-card', social_cat_id, 'CNIC for transgender.', '[{"number": 1, "title": "NADRA", "description": "Select Gender X."}]', '["Old CNIC"]', '1 week', 'Free', 'Rights protection', true, 150, 35),
    ('Senior Citizen Card', 'senior-citizen-card', social_cat_id, 'Privileges for 60+.', '[{"number": 1, "title": "NADRA", "description": "Auto at 60."}]', '["CNIC"]', 'N/A', 'Free', 'Transport discounts', true, 200, 48),
    ('Disabled Person CNIC', 'disabled-person-cnic', social_cat_id, 'Special CNIC.', '[{"number": 1, "title": "Social Welfare", "description": "Disability Certificate."}]', '["Medical Board"]', '1 month', 'Free', 'Job quota', true, 240, 58),
    ('Wheelchair Request', 'wheelchair-request', social_cat_id, 'Free wheelchair.', '[{"number": 1, "title": "Bait-ul-Mal", "description": "Apply."}]', '["Disability CNIC"]', '2-3 months', 'Free', 'Waiting list', true, 180, 42),
    ('Bait-ul-Mal Aid', 'bait-ul-mal-aid', social_cat_id, 'Financial assistance.', '[{"number": 1, "title": "Apply", "description": "District Office."}]', '["Application"]', 'Monthly', 'Free', 'Medical/Education', true, 260, 62),
    ('Marriage Grant', 'marriage-grant', social_cat_id, 'Grant for poor girls.', '[{"number": 1, "title": "Workers Welfare", "description": "Apply."}]', '["Nikkah Nama"]', 'Post-marriage', 'Rs. 100k+', 'Labor dept', true, 210, 52),
    ('Dowry Complaint', 'dowry-complaint', social_cat_id, 'Report dowry demands.', '[{"number": 1, "title": "Police", "description": "File complaint."}]', '["Evidence"]', 'Legal process', 'Free', 'Illegal practice', true, 140, 32),
    ('Animal Cruelty', 'animal-cruelty', social_cat_id, 'Report abuse.', '[{"number": 1, "title": "ACR App", "description": "Report online."}]', '["Video"]', 'Varies', 'Free', 'Society for prevention', true, 170, 40),
    ('Langar Khana', 'langar-khana', social_cat_id, 'Free food centers.', '[{"number": 1, "title": "Visit", "description": "Saylani / Govt Langar."}]', '["None"]', 'Daily', 'Free', 'Open to all', true, 230, 55)
    ON CONFLICT (slug) DO NOTHING;

    -- LEGAL GUIDES
    INSERT INTO guides (title, slug, category_id, problem_explanation, steps, required_documents, timeline_expectation, estimated_cost, pro_tips, is_published, views_count, upvotes_count) VALUES
    ('FIR Registration', 'fir-registration', legal_cat_id, 'File First Information Report.', '[{"number": 1, "title": "Police Station", "description": "Visit nearest station."}]', '["CNIC", "Application"]', 'Immediate', 'Free', 'Get copy of FIR', true, 400, 95),
    ('Police Character Cert', 'police-character-cert', legal_cat_id, 'Certificate for visa/job.', '[{"number": 1, "title": "Khidmat Markaz", "description": "Visit PKM."}]', '["CNIC", "Passport"]', '3 days', 'Rs. 350', 'Valid 6 months', true, 450, 110),
    ('Tenant Registration', 'tenant-registration', legal_cat_id, 'Register tenant with police.', '[{"number": 1, "title": "App", "description": "Tenant Reg App."}]', '["CNIC", "Agreement"]', 'Instant', 'Free', 'Mandatory by law', true, 300, 75),
    ('Employee Registration', 'employee-registration', legal_cat_id, 'Register domestic help.', '[{"number": 1, "title": "Khidmat Markaz", "description": "Register details."}]', '["CNIC", "Photo"]', 'Instant', 'Free', 'Safety measure', true, 250, 60),
    ('Legal Aid Women', 'legal-aid-women', legal_cat_id, 'Free legal help.', '[{"number": 1, "title": "Call", "description": "Punjab Women Helpline."}]', '["None"]', 'Immediate', 'Free', 'Govt lawyers', true, 180, 45),
    ('Consumer Court', 'consumer-court', legal_cat_id, 'Sue for defective products.', '[{"number": 1, "title": "Notice", "description": "Send 15 day notice."}]', '["Receipt", "Notice"]', '1-3 months', 'Minimal', 'Damages awarded', true, 220, 55),
    ('Cyber Crime Report', 'cyber-crime-report', legal_cat_id, 'Report online fraud/harassment.', '[{"number": 1, "title": "FIA", "description": "nr3c.gov.pk"}]', '["Screenshots"]', 'Investigation', 'Free', 'Do not delete evidence', true, 500, 130),
    ('Lost CNIC Report', 'lost-cnic-report', legal_cat_id, 'Report lost ID.', '[{"number": 1, "title": "NADRA", "description": "Apply reprint."}]', '["FIR/Report"]', '1 week', 'Reprint fee', 'Block old one', true, 350, 85),
    ('Khula Procedure', 'khula-procedure', legal_cat_id, 'Divorce procedure for women.', '[{"number": 1, "title": "Family Court", "description": "File suit."}]', '["Nikkah Nama"]', '3-6 months', 'Lawyer fee', 'Reconciliation attempt', true, 280, 65),
    ('Child Custody', 'child-custody', legal_cat_id, 'Custody laws.', '[{"number": 1, "title": "Guardian Court", "description": "File petition."}]', '["Birth Cert"]', 'Varies', 'Lawyer fee', 'Welfare of minor', true, 240, 58),
    ('Succession Certificate', 'succession-certificate', legal_cat_id, 'Inheritance distribution.', '[{"number": 1, "title": "NADRA", "description": "Succession counter."}]', '["Death Cert", "FRC"]', '15 days', 'Rs. 10k-20k', 'Biometric of heirs', true, 380, 92),
    ('Property Registry', 'property-registry', legal_cat_id, 'Verify land ownership.', '[{"number": 1, "title": "Arazi Center", "description": "Check record."}]', '["CNIC", "Copy"]', 'Same day', 'Fee', 'Biometric verification', true, 420, 105),
    ('Power of Attorney', 'power-of-attorney', legal_cat_id, 'Register POA.', '[{"number": 1, "title": "Embassy/Registrar", "description": "Attest deed."}]', '["CNIC", "Witnesses"]', '1 week', 'Fee', 'Digital POA for overseas', true, 310, 78),
    ('Affidavit Attestation', 'affidavit-attestation', legal_cat_id, 'Oath commissioner.', '[{"number": 1, "title": "Court", "description": "Visit Oath Comm."}]', '["CNIC", "Content"]', '1 hour', 'Rs. 100-500', 'Read before signing', true, 200, 48),
    ('Court Marriage', 'court-marriage', legal_cat_id, 'Legal marriage procedure.', '[{"number": 1, "title": "Court", "description": "Magistrate/Nikkah."}]', '["CNIC", "Age Proof"]', 'Same day', 'Fee', 'Valid legally', true, 330, 82)
    ON CONFLICT (slug) DO NOTHING;

    -- GOVERNMENT SERVICES GUIDES
    INSERT INTO guides (title, slug, category_id, problem_explanation, steps, required_documents, timeline_expectation, estimated_cost, pro_tips, is_published, views_count, upvotes_count) VALUES
    ('Domicile Certificate', 'domicile-certificate', govt_cat_id, 'Apply for domicile.', '[{"number": 1, "title": "Khidmat Markaz", "description": "Submit file."}]', '["CNIC", "Utility Bills"]', '15 days', 'Rs. 200', 'Required for jobs', true, 550, 140),
    ('Birth Certificate', 'birth-certificate', govt_cat_id, 'Computerized birth cert.', '[{"number": 1, "title": "UC Office", "description": "Union Council."}]', '["Hospital Cert", "CNIC"]', '3-7 days', 'Rs. 100-300', 'Late entry fine', true, 600, 155),
    ('Death Certificate', 'death-certificate', govt_cat_id, 'Register death.', '[{"number": 1, "title": "UC Office", "description": "Union Council."}]', '["Hospital Cert", "CNIC"]', '3-7 days', 'Rs. 100-300', 'For inheritance', true, 400, 95),
    ('Marriage Certificate', 'marriage-certificate', govt_cat_id, 'Computerized Nikkah Nama.', '[{"number": 1, "title": "UC Office", "description": "Submit Urdu Nikkah Nama."}]', '["Nikkah Nama", "CNIC"]', '3-7 days', 'Rs. 100-300', 'For visa/travel', true, 500, 125),
    ('Divorce Certificate', 'divorce-certificate', govt_cat_id, 'Register divorce.', '[{"number": 1, "title": "UC Office", "description": "Arbitration Council."}]', '["Order/Deed"]', '90 days', 'Fee', 'Effectiveness cert', true, 250, 60),
    ('Passport Application', 'passport-application', govt_cat_id, 'New passport.', '[{"number": 1, "title": "Passport Office", "description": "Visit office."}]', '["CNIC", "Bank Challan"]', '10-15 days', 'Rs. 3000+', 'Online appointment', true, 700, 180),
    ('Passport Renewal', 'passport-renewal', govt_cat_id, 'Renew passport online.', '[{"number": 1, "title": "Website", "description": "onlinemrp.dgip.gov.pk"}]', '["Old Passport", "Photo"]', '10 days', 'Fee', 'Delivery at home', true, 650, 165),
    ('Arms License', 'arms-license', govt_cat_id, 'Weapon license.', '[{"number": 1, "title": "Home Dept", "description": "Apply for approval."}]', '["CNIC", "Tax Filer"]', 'Months', 'High fee', 'Quotas apply', true, 300, 75),
    ('FBR Tax Filer', 'fbr-tax-filer', govt_cat_id, 'Become active taxpayer.', '[{"number": 1, "title": "Iris", "description": "iris.fbr.gov.pk"}]', '["CNIC", "Income Info"]', 'Instant', 'Free', 'Reduced tax rates', true, 800, 200),
    ('E-Stamp Paper', 'e-stamp-paper', govt_cat_id, 'Get stamp paper online.', '[{"number": 1, "title": "Website", "description": "es.punjab.gov.pk"}]', '["Challan 32-A"]', 'Instant', 'Value based', 'Bank print out', true, 450, 110)
    ON CONFLICT (slug) DO NOTHING;

    RAISE NOTICE '✅ Successfully seeded remaining guides (Electricity, Health, Education, Social, Legal, Govt)';
END $$;

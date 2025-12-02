-- CitizenConnect Database Schema
-- Complete database structure for the civic platform

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS & AUTHENTICATION
-- =====================================================

-- User profiles table (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT,
    city TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'citizen' CHECK (role IN ('citizen', 'donor', 'volunteer', 'admin')),
    is_verified BOOLEAN DEFAULT FALSE,
    badges TEXT[] DEFAULT '{}',
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ISSUE GUIDES SYSTEM
-- =====================================================

-- Categories for guides
CREATE TABLE public.categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    color TEXT DEFAULT '#009950',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Issue guides
CREATE TABLE public.guides (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    problem_explanation TEXT NOT NULL,
    steps JSONB NOT NULL DEFAULT '[]',
    required_documents TEXT[],
    contact_emails TEXT[],
    contact_phones TEXT[],
    online_portals TEXT[],
    timeline_expectation TEXT,
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    is_published BOOLEAN DEFAULT FALSE,
    views_count INTEGER DEFAULT 0,
    upvotes_count INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0,
    ratings_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Guide upvotes
CREATE TABLE public.guide_upvotes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    guide_id UUID REFERENCES public.guides(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(guide_id, user_id)
);

-- Guide ratings
CREATE TABLE public.guide_ratings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    guide_id UUID REFERENCES public.guides(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(guide_id, user_id)
);

-- =====================================================
-- COMMUNITY INTERACTION
-- =====================================================

-- Comments on guides
CREATE TABLE public.comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    guide_id UUID REFERENCES public.guides(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_tip BOOLEAN DEFAULT FALSE,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comment likes
CREATE TABLE public.comment_likes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(comment_id, user_id)
);

-- =====================================================
-- BLOOD DONOR & RECIPIENT MODULE
-- =====================================================

CREATE TABLE public.blood_donors (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    blood_group TEXT NOT NULL CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    city TEXT NOT NULL,
    area TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    last_donation_date DATE,
    donation_count INTEGER DEFAULT 0,
    contact_phone TEXT NOT NULL,
    contact_whatsapp TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blood requests (urgent broadcasts)
CREATE TABLE public.blood_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    requester_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    patient_name TEXT NOT NULL,
    blood_group TEXT NOT NULL CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    units_needed INTEGER DEFAULT 1,
    hospital_name TEXT NOT NULL,
    hospital_address TEXT,
    city TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    urgency_level TEXT DEFAULT 'normal' CHECK (urgency_level IN ('normal', 'urgent', 'critical')),
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'fulfilled', 'closed')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- EMERGENCY HELP MODULE
-- =====================================================

CREATE TABLE public.emergency_guides (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL CHECK (category IN ('medical', 'accident', 'fire', 'natural_disaster', 'other')),
    description TEXT,
    steps JSONB NOT NULL DEFAULT '[]',
    checklist JSONB DEFAULT '[]',
    emergency_contacts JSONB DEFAULT '[]',
    ngo_contacts JSONB DEFAULT '[]',
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- DONATION MODULE
-- =====================================================

-- Donation categories
CREATE TABLE public.donation_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Donation cases
CREATE TABLE public.donation_cases (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category_id UUID REFERENCES public.donation_categories(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    story TEXT,
    beneficiary_name TEXT,
    goal_amount DECIMAL(12,2) NOT NULL,
    raised_amount DECIMAL(12,2) DEFAULT 0,
    currency TEXT DEFAULT 'PKR',
    images TEXT[],
    documents TEXT[],
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    jazzcash_number TEXT,
    easypaisa_number TEXT,
    bank_details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Donations made
CREATE TABLE public.donations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    case_id UUID REFERENCES public.donation_cases(id) ON DELETE SET NULL,
    donor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    amount DECIMAL(12,2) NOT NULL,
    payment_method TEXT,
    transaction_id TEXT,
    is_anonymous BOOLEAN DEFAULT FALSE,
    donor_name TEXT,
    donor_message TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Donation updates (transparency)
CREATE TABLE public.donation_updates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    case_id UUID REFERENCES public.donation_cases(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    images TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- VOLUNTEER MODULE
-- =====================================================

CREATE TABLE public.volunteers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    skills TEXT[],
    areas_of_interest TEXT[],
    city TEXT NOT NULL,
    area TEXT,
    availability TEXT CHECK (availability IN ('weekdays', 'weekends', 'both', 'flexible')),
    hours_per_week INTEGER,
    experience TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    tasks_completed INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Volunteer discussion threads
CREATE TABLE public.volunteer_discussions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    category TEXT,
    is_pinned BOOLEAN DEFAULT FALSE,
    views_count INTEGER DEFAULT 0,
    replies_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Discussion replies
CREATE TABLE public.discussion_replies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    discussion_id UUID REFERENCES public.volunteer_discussions(id) ON DELETE CASCADE,
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- NOTIFICATIONS
-- =====================================================

CREATE TABLE public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT,
    link TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CONTACT & FEEDBACK
-- =====================================================

CREATE TABLE public.contact_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- SITE STATISTICS (for dashboard)
-- =====================================================

CREATE TABLE public.site_stats (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    stat_date DATE DEFAULT CURRENT_DATE UNIQUE,
    total_users INTEGER DEFAULT 0,
    total_guides INTEGER DEFAULT 0,
    total_donors INTEGER DEFAULT 0,
    total_volunteers INTEGER DEFAULT 0,
    total_donations_amount DECIMAL(12,2) DEFAULT 0,
    total_blood_requests INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guide_upvotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guide_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donation_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donation_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donation_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussion_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Categories policies (public read)
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Only admins can manage categories" ON public.categories FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Guides policies
CREATE POLICY "Published guides are viewable by everyone" ON public.guides FOR SELECT USING (is_published = true);
CREATE POLICY "Users can create guides" ON public.guides FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update own guides" ON public.guides FOR UPDATE USING (auth.uid() = author_id);

-- Guide upvotes policies
CREATE POLICY "Upvotes are viewable by everyone" ON public.guide_upvotes FOR SELECT USING (true);
CREATE POLICY "Users can manage own upvotes" ON public.guide_upvotes FOR ALL USING (auth.uid() = user_id);

-- Guide ratings policies
CREATE POLICY "Ratings are viewable by everyone" ON public.guide_ratings FOR SELECT USING (true);
CREATE POLICY "Users can manage own ratings" ON public.guide_ratings FOR ALL USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Comments are viewable by everyone" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Users can create comments" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON public.comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- Comment likes policies
CREATE POLICY "Comment likes are viewable by everyone" ON public.comment_likes FOR SELECT USING (true);
CREATE POLICY "Users can manage own comment likes" ON public.comment_likes FOR ALL USING (auth.uid() = user_id);

-- Blood donors policies
CREATE POLICY "Blood donors are viewable by everyone" ON public.blood_donors FOR SELECT USING (true);
CREATE POLICY "Users can manage own donor profile" ON public.blood_donors FOR ALL USING (auth.uid() = user_id);

-- Blood requests policies
CREATE POLICY "Blood requests are viewable by everyone" ON public.blood_requests FOR SELECT USING (true);
CREATE POLICY "Users can create blood requests" ON public.blood_requests FOR INSERT WITH CHECK (auth.uid() = requester_id);
CREATE POLICY "Users can update own blood requests" ON public.blood_requests FOR UPDATE USING (auth.uid() = requester_id);

-- Emergency guides policies
CREATE POLICY "Emergency guides are viewable by everyone" ON public.emergency_guides FOR SELECT USING (is_published = true);

-- Donation categories policies
CREATE POLICY "Donation categories are viewable by everyone" ON public.donation_categories FOR SELECT USING (true);

-- Donation cases policies
CREATE POLICY "Active donation cases are viewable by everyone" ON public.donation_cases FOR SELECT USING (is_active = true);
CREATE POLICY "Users can create donation cases" ON public.donation_cases FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update own cases" ON public.donation_cases FOR UPDATE USING (auth.uid() = author_id);

-- Donations policies
CREATE POLICY "Users can view own donations" ON public.donations FOR SELECT USING (auth.uid() = donor_id OR is_anonymous = false);
CREATE POLICY "Users can create donations" ON public.donations FOR INSERT WITH CHECK (auth.uid() = donor_id);

-- Donation updates policies
CREATE POLICY "Donation updates are viewable by everyone" ON public.donation_updates FOR SELECT USING (true);

-- Volunteers policies
CREATE POLICY "Volunteers are viewable by everyone" ON public.volunteers FOR SELECT USING (true);
CREATE POLICY "Users can manage own volunteer profile" ON public.volunteers FOR ALL USING (auth.uid() = user_id);

-- Volunteer discussions policies
CREATE POLICY "Discussions are viewable by everyone" ON public.volunteer_discussions FOR SELECT USING (true);
CREATE POLICY "Users can create discussions" ON public.volunteer_discussions FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update own discussions" ON public.volunteer_discussions FOR UPDATE USING (auth.uid() = author_id);

-- Discussion replies policies
CREATE POLICY "Replies are viewable by everyone" ON public.discussion_replies FOR SELECT USING (true);
CREATE POLICY "Users can create replies" ON public.discussion_replies FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- Contact messages policies
CREATE POLICY "Anyone can submit contact messages" ON public.contact_messages FOR INSERT WITH CHECK (true);

-- Site stats policies
CREATE POLICY "Stats are viewable by everyone" ON public.site_stats FOR SELECT USING (true);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update guide upvotes count
CREATE OR REPLACE FUNCTION public.update_guide_upvotes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.guides SET upvotes_count = upvotes_count + 1 WHERE id = NEW.guide_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.guides SET upvotes_count = upvotes_count - 1 WHERE id = OLD.guide_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_guide_upvotes
    AFTER INSERT OR DELETE ON public.guide_upvotes
    FOR EACH ROW EXECUTE FUNCTION public.update_guide_upvotes_count();

-- Function to update comment likes count
CREATE OR REPLACE FUNCTION public.update_comment_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.comments SET likes_count = likes_count + 1 WHERE id = NEW.comment_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.comments SET likes_count = likes_count - 1 WHERE id = OLD.comment_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_comment_likes
    AFTER INSERT OR DELETE ON public.comment_likes
    FOR EACH ROW EXECUTE FUNCTION public.update_comment_likes_count();

-- Function to update guide ratings
CREATE OR REPLACE FUNCTION public.update_guide_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.guides
    SET 
        average_rating = (SELECT AVG(rating)::DECIMAL(3,2) FROM public.guide_ratings WHERE guide_id = COALESCE(NEW.guide_id, OLD.guide_id)),
        ratings_count = (SELECT COUNT(*) FROM public.guide_ratings WHERE guide_id = COALESCE(NEW.guide_id, OLD.guide_id))
    WHERE id = COALESCE(NEW.guide_id, OLD.guide_id);
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_guide_rating_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.guide_ratings
    FOR EACH ROW EXECUTE FUNCTION public.update_guide_rating();

-- Function to update donation case raised amount
CREATE OR REPLACE FUNCTION public.update_donation_raised_amount()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' THEN
        UPDATE public.donation_cases
        SET raised_amount = (
            SELECT COALESCE(SUM(amount), 0) 
            FROM public.donations 
            WHERE case_id = NEW.case_id AND status = 'completed'
        )
        WHERE id = NEW.case_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_donation_amount
    AFTER INSERT OR UPDATE ON public.donations
    FOR EACH ROW EXECUTE FUNCTION public.update_donation_raised_amount();

-- Function to increment guide views
CREATE OR REPLACE FUNCTION public.increment_guide_views(guide_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.guides SET views_count = views_count + 1 WHERE id = guide_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- SEED DATA
-- =====================================================

-- Insert default categories
INSERT INTO public.categories (name, slug, description, icon) VALUES
('Roads & Transport', 'roads-transport', 'Issues related to roads, traffic, and public transport', '🚗'),
('Sewerage & Water', 'sewerage-water', 'Water supply and sewerage system issues', '💧'),
('Electricity & Gas', 'electricity-gas', 'Power outages, gas supply, and utility issues', '⚡'),
('Health', 'health', 'Healthcare services and medical assistance', '🏥'),
('Education', 'education', 'Educational institutions and academic issues', '📚'),
('Social Causes', 'social-causes', 'Community welfare and social issues', '🤝');

-- Insert donation categories
INSERT INTO public.donation_categories (name, slug, description, icon) VALUES
('Medical Cases', 'medical', 'Help patients with medical expenses', '🏥'),
('Education', 'education', 'Support students with education costs', '📚'),
('Food & Nutrition', 'food', 'Provide food to those in need', '🍽️'),
('Orphan Support', 'orphan', 'Support orphaned children', '👶'),
('Disaster Relief', 'disaster', 'Help disaster victims recover', '🆘');

-- Insert emergency guides
INSERT INTO public.emergency_guides (title, slug, category, description, steps, checklist, emergency_contacts) VALUES
('Medical Emergency Response', 'medical-emergency', 'medical', 'What to do in a medical emergency',
'[{"step": 1, "title": "Stay Calm", "description": "Keep yourself calm and assess the situation"}, {"step": 2, "title": "Call Emergency Services", "description": "Dial 1122 (Rescue) or 115 (Edhi)"}, {"step": 3, "title": "Provide First Aid", "description": "If trained, provide basic first aid while waiting for help"}]',
'["Check breathing", "Check pulse", "Stop any bleeding", "Keep patient warm"]',
'[{"name": "Rescue 1122", "phone": "1122"}, {"name": "Edhi Foundation", "phone": "115"}, {"name": "Chippa Foundation", "phone": "1021"}]'),

('Fire Emergency', 'fire-emergency', 'fire', 'What to do during a fire emergency',
'[{"step": 1, "title": "Alert Everyone", "description": "Shout Fire! and activate any fire alarms"}, {"step": 2, "title": "Evacuate", "description": "Leave the building immediately using stairs, not elevators"}, {"step": 3, "title": "Call Fire Brigade", "description": "Dial 16 for fire emergency"}]',
'["Stay low if there is smoke", "Feel doors before opening", "Have an escape route", "Meet at designated point"]',
'[{"name": "Fire Brigade", "phone": "16"}, {"name": "Rescue 1122", "phone": "1122"}]'),

('Natural Disaster Preparedness', 'natural-disaster', 'natural_disaster', 'How to prepare for and respond to natural disasters',
'[{"step": 1, "title": "Prepare Emergency Kit", "description": "Keep water, food, flashlight, first aid kit ready"}, {"step": 2, "title": "Know Evacuation Routes", "description": "Identify safe places and evacuation routes"}, {"step": 3, "title": "Stay Informed", "description": "Monitor weather updates and official announcements"}]',
'["Emergency water supply", "Non-perishable food", "Flashlight and batteries", "First aid kit", "Important documents", "Cash"]',
'[{"name": "NDMA Helpline", "phone": "051-9205037"}, {"name": "Rescue 1122", "phone": "1122"}]');

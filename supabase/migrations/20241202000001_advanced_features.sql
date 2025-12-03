-- Advanced Features and Functions for CitizenConnect
-- Real-time subscriptions, search, analytics

-- =====================================================
-- FULL-TEXT SEARCH
-- =====================================================

-- Add search vectors for guides
ALTER TABLE public.guides ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Create index for full-text search
CREATE INDEX IF NOT EXISTS guides_search_idx ON public.guides USING gin(search_vector);

-- Function to update search vector
CREATE OR REPLACE FUNCTION public.guides_search_vector_update()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector :=
        setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.problem_explanation, '')), 'B');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update search vector
DROP TRIGGER IF EXISTS guides_search_vector_trigger ON public.guides;
CREATE TRIGGER guides_search_vector_trigger
    BEFORE INSERT OR UPDATE ON public.guides
    FOR EACH ROW EXECUTE FUNCTION public.guides_search_vector_update();

-- Function for searching guides
CREATE OR REPLACE FUNCTION public.search_guides(search_query text, limit_count int DEFAULT 10)
RETURNS SETOF public.guides AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM public.guides
    WHERE 
        is_published = true
        AND search_vector @@ plainto_tsquery('english', search_query)
    ORDER BY ts_rank(search_vector, plainto_tsquery('english', search_query)) DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql STABLE;

-- =====================================================
-- ANALYTICS FUNCTIONS
-- =====================================================

-- Function to get dashboard stats
CREATE OR REPLACE FUNCTION public.get_dashboard_stats()
RETURNS json AS $$
DECLARE
    result json;
BEGIN
    SELECT json_build_object(
        'total_users', (SELECT COUNT(*) FROM public.profiles),
        'total_guides', (SELECT COUNT(*) FROM public.guides WHERE is_published = true),
        'total_blood_donors', (SELECT COUNT(*) FROM public.blood_donors WHERE is_available = true),
        'total_volunteers', (SELECT COUNT(*) FROM public.volunteers WHERE is_active = true),
        'total_donations', (SELECT COALESCE(SUM(amount), 0) FROM public.donations WHERE status = 'completed'),
        'active_blood_requests', (SELECT COUNT(*) FROM public.blood_requests WHERE status = 'open'),
        'total_donation_cases', (SELECT COUNT(*) FROM public.donation_cases WHERE is_active = true),
        'recent_guides', (
            SELECT json_agg(t) FROM (
                SELECT id, title, created_at, views_count, upvotes_count
                FROM public.guides
                WHERE is_published = true
                ORDER BY created_at DESC
                LIMIT 5
            ) t
        ),
        'recent_blood_requests', (
            SELECT json_agg(t) FROM (
                SELECT id, patient_name, blood_group, city, urgency_level, created_at
                FROM public.blood_requests
                WHERE status = 'open'
                ORDER BY created_at DESC
                LIMIT 5
            ) t
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Function to get user stats
CREATE OR REPLACE FUNCTION public.get_user_stats(user_uuid uuid)
RETURNS json AS $$
DECLARE
    result json;
BEGIN
    SELECT json_build_object(
        'guides_created', (SELECT COUNT(*) FROM public.guides WHERE author_id = user_uuid),
        'donations_made', (SELECT COUNT(*) FROM public.donations WHERE donor_id = user_uuid),
        'total_donated', (SELECT COALESCE(SUM(amount), 0) FROM public.donations WHERE donor_id = user_uuid AND status = 'completed'),
        'comments_made', (SELECT COUNT(*) FROM public.comments WHERE user_id = user_uuid),
        'is_blood_donor', (SELECT EXISTS(SELECT 1 FROM public.blood_donors WHERE user_id = user_uuid)),
        'is_volunteer', (SELECT EXISTS(SELECT 1 FROM public.volunteers WHERE user_id = user_uuid))
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- =====================================================
-- NOTIFICATION SYSTEM
-- =====================================================

-- Function to create notification
CREATE OR REPLACE FUNCTION public.create_notification(
    target_user_id uuid,
    notification_type text,
    notification_title text,
    notification_message text DEFAULT NULL,
    notification_link text DEFAULT NULL
)
RETURNS uuid AS $$
DECLARE
    new_notification_id uuid;
BEGIN
    INSERT INTO public.notifications (user_id, type, title, message, link)
    VALUES (target_user_id, notification_type, notification_title, notification_message, notification_link)
    RETURNING id INTO new_notification_id;
    
    RETURN new_notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to notify on new blood request
CREATE OR REPLACE FUNCTION public.notify_blood_donors()
RETURNS TRIGGER AS $$
DECLARE
    donor_record RECORD;
BEGIN
    -- Notify all matching blood donors in the same city
    FOR donor_record IN 
        SELECT user_id FROM public.blood_donors 
        WHERE blood_group = NEW.blood_group 
        AND city = NEW.city 
        AND is_available = true
    LOOP
        PERFORM public.create_notification(
            donor_record.user_id,
            'blood_request',
            'Urgent Blood Request',
            'Blood needed for ' || NEW.patient_name || ' at ' || NEW.hospital_name,
            '/blood-bank?request=' || NEW.id::text
        );
    END LOOP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS notify_donors_on_blood_request ON public.blood_requests;
CREATE TRIGGER notify_donors_on_blood_request
    AFTER INSERT ON public.blood_requests
    FOR EACH ROW
    WHEN (NEW.urgency_level IN ('urgent', 'critical'))
    EXECUTE FUNCTION public.notify_blood_donors();

-- =====================================================
-- LEADERBOARD FUNCTIONS
-- =====================================================

-- Top contributors leaderboard
CREATE OR REPLACE FUNCTION public.get_top_contributors(limit_count int DEFAULT 10)
RETURNS TABLE (
    user_id uuid,
    full_name text,
    total_contributions bigint,
    guides_count bigint,
    donations_count bigint,
    comments_count bigint
) AS $$
BEGIN
    RETURN QUERY
    WITH user_stats AS (
        SELECT 
            p.id,
            p.full_name,
            COALESCE(g.guide_count, 0) as guides,
            COALESCE(d.donation_count, 0) as donations,
            COALESCE(c.comment_count, 0) as comments
        FROM public.profiles p
        LEFT JOIN (
            SELECT author_id, COUNT(*) as guide_count 
            FROM public.guides 
            WHERE is_published = true 
            GROUP BY author_id
        ) g ON p.id = g.author_id
        LEFT JOIN (
            SELECT donor_id, COUNT(*) as donation_count 
            FROM public.donations 
            WHERE status = 'completed' 
            GROUP BY donor_id
        ) d ON p.id = d.donor_id
        LEFT JOIN (
            SELECT user_id, COUNT(*) as comment_count 
            FROM public.comments 
            GROUP BY user_id
        ) c ON p.id = c.user_id
    )
    SELECT 
        id,
        full_name,
        (guides + donations + comments) as total_contributions,
        guides,
        donations,
        comments
    FROM user_stats
    WHERE (guides + donations + comments) > 0
    ORDER BY total_contributions DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql STABLE;

-- Top blood donors
CREATE OR REPLACE FUNCTION public.get_top_blood_donors(limit_count int DEFAULT 10)
RETURNS TABLE (
    donor_id uuid,
    full_name text,
    blood_group text,
    city text,
    donation_count int
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        bd.id,
        p.full_name,
        bd.blood_group,
        bd.city,
        bd.donation_count
    FROM public.blood_donors bd
    INNER JOIN public.profiles p ON bd.user_id = p.id
    ORDER BY bd.donation_count DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql STABLE;

-- =====================================================
-- ADVANCED FILTERING FUNCTIONS
-- =====================================================

-- Get guides by filters
CREATE OR REPLACE FUNCTION public.get_filtered_guides(
    category_slug text DEFAULT NULL,
    search_term text DEFAULT NULL,
    sort_by text DEFAULT 'recent'
)
RETURNS SETOF public.guides AS $$
BEGIN
    RETURN QUERY
    SELECT g.*
    FROM public.guides g
    LEFT JOIN public.categories c ON g.category_id = c.id
    WHERE 
        g.is_published = true
        AND (category_slug IS NULL OR c.slug = category_slug)
        AND (
            search_term IS NULL 
            OR g.title ILIKE '%' || search_term || '%'
            OR g.problem_explanation ILIKE '%' || search_term || '%'
        )
    ORDER BY
        CASE 
            WHEN sort_by = 'recent' THEN g.created_at
            ELSE NULL
        END DESC,
        CASE 
            WHEN sort_by = 'popular' THEN g.views_count
            ELSE NULL
        END DESC,
        CASE 
            WHEN sort_by = 'rated' THEN g.average_rating
            ELSE NULL
        END DESC;
END;
$$ LANGUAGE plpgsql STABLE;

-- Get blood donors by filters
CREATE OR REPLACE FUNCTION public.get_filtered_blood_donors(
    blood_group_filter text DEFAULT NULL,
    city_filter text DEFAULT NULL
)
RETURNS TABLE (
    id uuid,
    user_id uuid,
    full_name text,
    avatar_url text,
    blood_group text,
    city text,
    area text,
    contact_phone text,
    last_donation_date date,
    donation_count int
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        bd.id,
        bd.user_id,
        p.full_name,
        p.avatar_url,
        bd.blood_group,
        bd.city,
        bd.area,
        bd.contact_phone,
        bd.last_donation_date,
        bd.donation_count
    FROM public.blood_donors bd
    INNER JOIN public.profiles p ON bd.user_id = p.id
    WHERE 
        bd.is_available = true
        AND (blood_group_filter IS NULL OR bd.blood_group = blood_group_filter)
        AND (city_filter IS NULL OR bd.city = city_filter)
    ORDER BY bd.donation_count DESC;
END;
$$ LANGUAGE plpgsql STABLE;

-- =====================================================
-- AUTOMATED STATISTICS UPDATE
-- =====================================================

-- Function to update daily stats
CREATE OR REPLACE FUNCTION public.update_daily_stats()
RETURNS void AS $$
BEGIN
    INSERT INTO public.site_stats (
        stat_date,
        total_users,
        total_guides,
        total_donors,
        total_volunteers,
        total_donations_amount,
        total_blood_requests
    )
    VALUES (
        CURRENT_DATE,
        (SELECT COUNT(*) FROM public.profiles),
        (SELECT COUNT(*) FROM public.guides WHERE is_published = true),
        (SELECT COUNT(*) FROM public.blood_donors WHERE is_available = true),
        (SELECT COUNT(*) FROM public.volunteers WHERE is_active = true),
        (SELECT COALESCE(SUM(amount), 0) FROM public.donations WHERE status = 'completed'),
        (SELECT COUNT(*) FROM public.blood_requests WHERE status = 'open')
    )
    ON CONFLICT (stat_date) 
    DO UPDATE SET
        total_users = EXCLUDED.total_users,
        total_guides = EXCLUDED.total_guides,
        total_donors = EXCLUDED.total_donors,
        total_volunteers = EXCLUDED.total_volunteers,
        total_donations_amount = EXCLUDED.total_donations_amount,
        total_blood_requests = EXCLUDED.total_blood_requests;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- BADGE SYSTEM
-- =====================================================

-- Function to award badges
CREATE OR REPLACE FUNCTION public.check_and_award_badges(user_uuid uuid)
RETURNS text[] AS $$
DECLARE
    new_badges text[] := '{}';
    user_badges text[];
    guide_count int;
    donation_count int;
    comment_count int;
BEGIN
    -- Get current badges
    SELECT badges INTO user_badges FROM public.profiles WHERE id = user_uuid;
    
    -- Check guide creator badges
    SELECT COUNT(*) INTO guide_count FROM public.guides WHERE author_id = user_uuid AND is_published = true;
    IF guide_count >= 1 AND NOT 'first_guide' = ANY(user_badges) THEN
        new_badges := array_append(new_badges, 'first_guide');
    END IF;
    IF guide_count >= 5 AND NOT 'guide_contributor' = ANY(user_badges) THEN
        new_badges := array_append(new_badges, 'guide_contributor');
    END IF;
    IF guide_count >= 10 AND NOT 'guide_master' = ANY(user_badges) THEN
        new_badges := array_append(new_badges, 'guide_master');
    END IF;
    
    -- Check donation badges
    SELECT COUNT(*) INTO donation_count FROM public.donations WHERE donor_id = user_uuid AND status = 'completed';
    IF donation_count >= 1 AND NOT 'first_donation' = ANY(user_badges) THEN
        new_badges := array_append(new_badges, 'first_donation');
    END IF;
    IF donation_count >= 5 AND NOT 'generous_donor' = ANY(user_badges) THEN
        new_badges := array_append(new_badges, 'generous_donor');
    END IF;
    
    -- Check community participation
    SELECT COUNT(*) INTO comment_count FROM public.comments WHERE user_id = user_uuid;
    IF comment_count >= 10 AND NOT 'community_helper' = ANY(user_badges) THEN
        new_badges := array_append(new_badges, 'community_helper');
    END IF;
    
    -- Update badges if new ones earned
    IF array_length(new_badges, 1) > 0 THEN
        UPDATE public.profiles 
        SET badges = badges || new_badges
        WHERE id = user_uuid;
    END IF;
    
    RETURN new_badges;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- REALTIME PUBLICATION
-- =====================================================

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.blood_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.donation_cases;

-- =====================================================
-- PERFORMANCE INDEXES
-- =====================================================

-- Additional indexes for performance
CREATE INDEX IF NOT EXISTS idx_guides_category ON public.guides(category_id);
CREATE INDEX IF NOT EXISTS idx_guides_author ON public.guides(author_id);
CREATE INDEX IF NOT EXISTS idx_guides_published ON public.guides(is_published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blood_donors_location ON public.blood_donors(city, blood_group) WHERE is_available = true;
CREATE INDEX IF NOT EXISTS idx_blood_requests_status ON public.blood_requests(status, urgency_level, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_donations_case ON public.donations(case_id, status);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_guide ON public.comments(guide_id, created_at DESC);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_guides_category_published ON public.guides(category_id, is_published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_donations_donor_status ON public.donations(donor_id, status, created_at DESC);

-- =====================================================
-- COMMUNITY ISSUES & MENTORSHIP SYSTEM
-- A fully automated community-driven issue resolution platform
-- =====================================================

-- Issue categories for better organization
CREATE TABLE IF NOT EXISTS issue_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT DEFAULT '#10b981',
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Insert default categories
INSERT INTO issue_categories (name, slug, description, icon, color, priority) VALUES
  ('Roads & Potholes', 'roads', 'Road damage, potholes, broken pavements', 'road', '#ef4444', 1),
  ('Garbage & Sanitation', 'sanitation', 'Garbage collection, cleanliness issues', 'trash-2', '#f59e0b', 2),
  ('Street Lights', 'streetlights', 'Non-functional or damaged street lights', 'lamp', '#eab308', 3),
  ('Water Supply', 'water', 'Water shortage, contamination, leakage', 'droplet', '#3b82f6', 4),
  ('Electricity', 'electricity', 'Power outages, dangerous wiring', 'zap', '#8b5cf6', 5),
  ('Public Safety', 'safety', 'Security concerns, dangerous areas', 'shield', '#dc2626', 6),
  ('Parks & Public Spaces', 'parks', 'Maintenance of parks and public areas', 'trees', '#22c55e', 7),
  ('Traffic & Signals', 'traffic', 'Traffic signals, road signs, congestion', 'traffic-cone', '#f97316', 8),
  ('Government Services', 'government', 'Issues with NADRA, passport office, etc.', 'building', '#6366f1', 9),
  ('Other', 'other', 'General civic issues', 'help-circle', '#64748b', 10)
ON CONFLICT (slug) DO NOTHING;

-- Community Issues Table
CREATE TABLE IF NOT EXISTS community_issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category_id UUID REFERENCES issue_categories(id),
  
  -- Location
  city TEXT NOT NULL,
  area TEXT,
  address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Reporter
  reporter_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reporter_name TEXT,
  reporter_contact TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  
  -- Status & Priority
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'assigned', 'in_progress', 'resolved', 'closed', 'rejected')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  urgency_score INTEGER DEFAULT 50,
  
  -- Assignment
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  assigned_mentor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  -- Media
  images TEXT[],
  documents TEXT[],
  
  -- Voting & Engagement
  upvotes INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  
  -- Resolution
  resolution_notes TEXT,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Issue Comments/Discussions
CREATE TABLE IF NOT EXISTS issue_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID REFERENCES community_issues(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  is_solution BOOLEAN DEFAULT false,
  is_official BOOLEAN DEFAULT false,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Issue Upvotes (to prevent duplicate votes)
CREATE TABLE IF NOT EXISTS issue_upvotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID REFERENCES community_issues(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(issue_id, user_id)
);

-- Issue Assignments History
CREATE TABLE IF NOT EXISTS issue_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID REFERENCES community_issues(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  assigned_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  role TEXT CHECK (role IN ('contributor', 'mentor', 'admin')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'transferred', 'declined')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Mentors & Contributors Table (extends profiles)
CREATE TABLE IF NOT EXISTS community_contributors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'contributor' CHECK (role IN ('contributor', 'mentor', 'senior_mentor', 'admin')),
  
  -- Expertise
  expertise_areas TEXT[],
  categories TEXT[], -- Which issue categories they help with
  
  -- Stats
  issues_resolved INTEGER DEFAULT 0,
  issues_assigned INTEGER DEFAULT 0,
  avg_resolution_time INTERVAL,
  rating DECIMAL(3, 2) DEFAULT 5.00,
  total_ratings INTEGER DEFAULT 0,
  
  -- Availability
  is_available BOOLEAN DEFAULT true,
  max_active_issues INTEGER DEFAULT 5,
  
  -- Recognition
  badges TEXT[],
  points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  
  -- Location preference
  preferred_city TEXT,
  preferred_areas TEXT[],
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Issue Activity Log (for transparency)
CREATE TABLE IF NOT EXISTS issue_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID REFERENCES community_issues(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Contributor Ratings
CREATE TABLE IF NOT EXISTS contributor_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contributor_id UUID REFERENCES community_contributors(id) ON DELETE CASCADE,
  issue_id UUID REFERENCES community_issues(id) ON DELETE SET NULL,
  rated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(issue_id, rated_by)
);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Generate unique ticket number
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TEXT AS $$
DECLARE
  new_ticket TEXT;
  ticket_exists BOOLEAN;
BEGIN
  LOOP
    new_ticket := 'CC-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
    SELECT EXISTS(SELECT 1 FROM community_issues WHERE ticket_number = new_ticket) INTO ticket_exists;
    IF NOT ticket_exists THEN
      RETURN new_ticket;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Auto-assign issue to available contributor based on category and location
CREATE OR REPLACE FUNCTION auto_assign_issue(issue_id UUID)
RETURNS UUID AS $$
DECLARE
  issue_record RECORD;
  contributor_id UUID;
BEGIN
  -- Get issue details
  SELECT * INTO issue_record FROM community_issues WHERE id = issue_id;
  
  -- Find best matching contributor
  SELECT cc.user_id INTO contributor_id
  FROM community_contributors cc
  JOIN profiles p ON cc.user_id = p.id
  WHERE cc.is_available = true
    AND cc.role IN ('contributor', 'mentor', 'senior_mentor')
    AND (cc.preferred_city IS NULL OR cc.preferred_city = issue_record.city)
    AND cc.issues_assigned - cc.issues_resolved < cc.max_active_issues
  ORDER BY 
    cc.rating DESC,
    cc.issues_resolved DESC,
    RANDOM()
  LIMIT 1;
  
  -- Assign if found
  IF contributor_id IS NOT NULL THEN
    UPDATE community_issues 
    SET assigned_to = contributor_id, 
        status = 'assigned',
        updated_at = now()
    WHERE id = issue_id;
    
    -- Update contributor stats
    UPDATE community_contributors 
    SET issues_assigned = issues_assigned + 1
    WHERE user_id = contributor_id;
    
    -- Log activity
    INSERT INTO issue_activity_log (issue_id, actor_id, action, details)
    VALUES (issue_id, contributor_id, 'auto_assigned', '{"type": "system_assignment"}'::jsonb);
  END IF;
  
  RETURN contributor_id;
END;
$$ LANGUAGE plpgsql;

-- Calculate urgency score based on votes, time, and priority
CREATE OR REPLACE FUNCTION calculate_urgency_score(p_issue_id UUID)
RETURNS INTEGER AS $$
DECLARE
  issue_record RECORD;
  score INTEGER := 50;
BEGIN
  SELECT * INTO issue_record FROM community_issues WHERE id = p_issue_id;
  
  -- Base score from priority
  CASE issue_record.priority
    WHEN 'urgent' THEN score := 90;
    WHEN 'high' THEN score := 70;
    WHEN 'medium' THEN score := 50;
    WHEN 'low' THEN score := 30;
  END CASE;
  
  -- Add points for upvotes (max 20 extra)
  score := score + LEAST(issue_record.upvotes * 2, 20);
  
  -- Add points for age (older issues get priority, max 10 extra)
  score := score + LEAST(EXTRACT(DAY FROM (NOW() - issue_record.created_at))::INTEGER, 10);
  
  -- Cap at 100
  score := LEAST(score, 100);
  
  -- Update the issue
  UPDATE community_issues SET urgency_score = score WHERE id = p_issue_id;
  
  RETURN score;
END;
$$ LANGUAGE plpgsql;

-- Get community stats
CREATE OR REPLACE FUNCTION get_community_stats()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_issues', (SELECT COUNT(*) FROM community_issues),
    'open_issues', (SELECT COUNT(*) FROM community_issues WHERE status = 'open'),
    'in_progress', (SELECT COUNT(*) FROM community_issues WHERE status IN ('assigned', 'in_progress')),
    'resolved_issues', (SELECT COUNT(*) FROM community_issues WHERE status IN ('resolved', 'closed')),
    'total_contributors', (SELECT COUNT(*) FROM community_contributors),
    'active_mentors', (SELECT COUNT(*) FROM community_contributors WHERE role IN ('mentor', 'senior_mentor') AND is_available = true),
    'avg_resolution_time', (
      SELECT COALESCE(
        EXTRACT(HOURS FROM AVG(resolved_at - created_at))::INTEGER,
        0
      ) || ' hours'
      FROM community_issues 
      WHERE resolved_at IS NOT NULL
    ),
    'this_month_resolved', (
      SELECT COUNT(*) FROM community_issues 
      WHERE resolved_at >= DATE_TRUNC('month', CURRENT_DATE)
    ),
    'top_categories', (
      SELECT json_agg(row_to_json(t))
      FROM (
        SELECT ic.name, COUNT(ci.id) as count
        FROM issue_categories ic
        LEFT JOIN community_issues ci ON ci.category_id = ic.id
        GROUP BY ic.id, ic.name
        ORDER BY count DESC
        LIMIT 5
      ) t
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE community_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE issue_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE issue_upvotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_contributors ENABLE ROW LEVEL SECURITY;

-- Everyone can view issues
CREATE POLICY "Public issues are viewable by everyone" ON community_issues
  FOR SELECT USING (true);

-- Users can create issues
CREATE POLICY "Authenticated users can create issues" ON community_issues
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL OR is_anonymous = true);

-- Users can update their own issues
CREATE POLICY "Users can update own issues" ON community_issues
  FOR UPDATE USING (auth.uid() = reporter_id OR 
    auth.uid() = assigned_to OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Comments policies
CREATE POLICY "Anyone can view comments" ON issue_comments
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can comment" ON issue_comments
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can edit own comments" ON issue_comments
  FOR UPDATE USING (auth.uid() = author_id);

-- Contributors visible to all
CREATE POLICY "Contributors are public" ON community_contributors
  FOR SELECT USING (true);

CREATE POLICY "Users can manage own contributor profile" ON community_contributors
  FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Auto-generate ticket number
CREATE OR REPLACE FUNCTION set_ticket_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.ticket_number IS NULL THEN
    NEW.ticket_number := generate_ticket_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_ticket_number
  BEFORE INSERT ON community_issues
  FOR EACH ROW
  EXECUTE FUNCTION set_ticket_number();

-- Update timestamps
CREATE OR REPLACE FUNCTION update_issue_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_issue_timestamp
  BEFORE UPDATE ON community_issues
  FOR EACH ROW
  EXECUTE FUNCTION update_issue_timestamp();

-- Log status changes
CREATE OR REPLACE FUNCTION log_issue_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO issue_activity_log (issue_id, actor_id, action, details)
    VALUES (
      NEW.id,
      NEW.assigned_to,
      'status_changed',
      json_build_object('old_status', OLD.status, 'new_status', NEW.status)::jsonb
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_log_status_change
  AFTER UPDATE ON community_issues
  FOR EACH ROW
  EXECUTE FUNCTION log_issue_status_change();

-- Update contributor stats when issue is resolved
CREATE OR REPLACE FUNCTION update_contributor_on_resolution()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'resolved' AND OLD.status != 'resolved' AND NEW.assigned_to IS NOT NULL THEN
    UPDATE community_contributors
    SET 
      issues_resolved = issues_resolved + 1,
      points = points + 10,
      updated_at = now()
    WHERE user_id = NEW.assigned_to;
    
    -- Level up check
    UPDATE community_contributors
    SET level = FLOOR(points / 100) + 1
    WHERE user_id = NEW.assigned_to;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_contributor_resolution
  AFTER UPDATE ON community_issues
  FOR EACH ROW
  EXECUTE FUNCTION update_contributor_on_resolution();

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_issues_status ON community_issues(status);
CREATE INDEX IF NOT EXISTS idx_issues_city ON community_issues(city);
CREATE INDEX IF NOT EXISTS idx_issues_category ON community_issues(category_id);
CREATE INDEX IF NOT EXISTS idx_issues_assigned ON community_issues(assigned_to);
CREATE INDEX IF NOT EXISTS idx_issues_reporter ON community_issues(reporter_id);
CREATE INDEX IF NOT EXISTS idx_issues_created ON community_issues(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_issues_urgency ON community_issues(urgency_score DESC);
CREATE INDEX IF NOT EXISTS idx_contributors_available ON community_contributors(is_available, role);
CREATE INDEX IF NOT EXISTS idx_comments_issue ON issue_comments(issue_id);

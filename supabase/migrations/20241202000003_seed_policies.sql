-- Allow anonymous inserts for seed data (run this in Supabase SQL Editor)
-- These policies allow inserting data without authentication for demo purposes

-- Guides: allow insert without author
CREATE POLICY "Allow anonymous guide inserts" ON public.guides 
FOR INSERT WITH CHECK (true);

-- Donation cases: allow insert without author
CREATE POLICY "Allow anonymous donation case inserts" ON public.donation_cases 
FOR INSERT WITH CHECK (true);

-- Blood donors: allow insert without user
CREATE POLICY "Allow anonymous blood donor inserts" ON public.blood_donors 
FOR INSERT WITH CHECK (true);

-- Blood requests: allow insert without requester
CREATE POLICY "Allow anonymous blood request inserts" ON public.blood_requests 
FOR INSERT WITH CHECK (true);

-- Volunteers: allow insert without user
CREATE POLICY "Allow anonymous volunteer inserts" ON public.volunteers 
FOR INSERT WITH CHECK (true);

-- Also allow SELECT on all tables
CREATE POLICY "Allow public read on guides" ON public.guides 
FOR SELECT USING (true);

CREATE POLICY "Allow public read on donation_cases" ON public.donation_cases 
FOR SELECT USING (true);

CREATE POLICY "Allow public read on donations" ON public.donations 
FOR SELECT USING (true);

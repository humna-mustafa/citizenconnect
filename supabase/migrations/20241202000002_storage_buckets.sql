-- Create Storage Buckets and Policies
-- This file sets up the storage buckets for the application

-- Enable the storage extension if not already enabled (usually enabled by default in Supabase)
-- CREATE EXTENSION IF NOT EXISTS "storage";

-- 1. Create Buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('avatars', 'avatars', true),
  ('guide-attachments', 'guide-attachments', true),
  ('campaign-images', 'campaign-images', true),
  ('evidence-files', 'evidence-files', false) -- Private bucket for sensitive docs
ON CONFLICT (id) DO NOTHING;

-- 2. Policies for 'avatars'
-- Anyone can view avatars
CREATE POLICY "Avatar images are publicly accessible" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'avatars' );

-- Authenticated users can upload their own avatar
CREATE POLICY "Users can upload their own avatar" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK ( bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text );

-- Users can update their own avatar
CREATE POLICY "Users can update their own avatar" 
ON storage.objects FOR UPDATE
TO authenticated 
USING ( bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text );

-- 3. Policies for 'guide-attachments'
-- Anyone can view guide attachments
CREATE POLICY "Guide attachments are publicly accessible" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'guide-attachments' );

-- Authenticated users can upload attachments
CREATE POLICY "Authenticated users can upload guide attachments" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK ( bucket_id = 'guide-attachments' );

-- 4. Policies for 'campaign-images'
-- Anyone can view campaign images
CREATE POLICY "Campaign images are publicly accessible" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'campaign-images' );

-- Authenticated users can upload campaign images
CREATE POLICY "Authenticated users can upload campaign images" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK ( bucket_id = 'campaign-images' );

-- 5. Policies for 'evidence-files' (Private)
-- Only the uploader and admins can view
CREATE POLICY "Users can view their own evidence files" 
ON storage.objects FOR SELECT 
TO authenticated 
USING ( 
  bucket_id = 'evidence-files' 
  AND (
    (storage.foldername(name))[1] = auth.uid()::text 
    OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  )
);

-- Users can upload evidence
CREATE POLICY "Users can upload evidence files" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK ( bucket_id = 'evidence-files' AND (storage.foldername(name))[1] = auth.uid()::text );

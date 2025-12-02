export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string
          phone: string | null
          city: string | null
          avatar_url: string | null
          role: 'citizen' | 'donor' | 'volunteer' | 'admin'
          is_verified: boolean
          badges: string[]
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name: string
          phone?: string | null
          city?: string | null
          avatar_url?: string | null
          role?: 'citizen' | 'donor' | 'volunteer' | 'admin'
          is_verified?: boolean
          badges?: string[]
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string
          phone?: string | null
          city?: string | null
          avatar_url?: string | null
          role?: 'citizen' | 'donor' | 'volunteer' | 'admin'
          is_verified?: boolean
          badges?: string[]
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon: string | null
          color: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          icon?: string | null
          color?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          icon?: string | null
          color?: string
          created_at?: string
        }
      }
      guides: {
        Row: {
          id: string
          title: string
          slug: string
          category_id: string | null
          problem_explanation: string
          steps: Json
          required_documents: string[] | null
          contact_emails: string[] | null
          contact_phones: string[] | null
          online_portals: string[] | null
          timeline_expectation: string | null
          author_id: string | null
          is_published: boolean
          views_count: number
          upvotes_count: number
          average_rating: number
          ratings_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          category_id?: string | null
          problem_explanation: string
          steps?: Json
          required_documents?: string[] | null
          contact_emails?: string[] | null
          contact_phones?: string[] | null
          online_portals?: string[] | null
          timeline_expectation?: string | null
          author_id?: string | null
          is_published?: boolean
          views_count?: number
          upvotes_count?: number
          average_rating?: number
          ratings_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          category_id?: string | null
          problem_explanation?: string
          steps?: Json
          required_documents?: string[] | null
          contact_emails?: string[] | null
          contact_phones?: string[] | null
          online_portals?: string[] | null
          timeline_expectation?: string | null
          author_id?: string | null
          is_published?: boolean
          views_count?: number
          upvotes_count?: number
          average_rating?: number
          ratings_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      guide_upvotes: {
        Row: {
          id: string
          guide_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          guide_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          guide_id?: string
          user_id?: string
          created_at?: string
        }
      }
      guide_ratings: {
        Row: {
          id: string
          guide_id: string
          user_id: string
          rating: number
          created_at: string
        }
        Insert: {
          id?: string
          guide_id: string
          user_id: string
          rating: number
          created_at?: string
        }
        Update: {
          id?: string
          guide_id?: string
          user_id?: string
          rating?: number
          created_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          guide_id: string
          user_id: string
          parent_id: string | null
          content: string
          is_tip: boolean
          likes_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          guide_id: string
          user_id: string
          parent_id?: string | null
          content: string
          is_tip?: boolean
          likes_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          guide_id?: string
          user_id?: string
          parent_id?: string | null
          content?: string
          is_tip?: boolean
          likes_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      comment_likes: {
        Row: {
          id: string
          comment_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          comment_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          comment_id?: string
          user_id?: string
          created_at?: string
        }
      }
      blood_donors: {
        Row: {
          id: string
          user_id: string
          blood_group: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'
          city: string
          area: string | null
          is_available: boolean
          last_donation_date: string | null
          donation_count: number
          contact_phone: string
          contact_whatsapp: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          blood_group: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'
          city: string
          area?: string | null
          is_available?: boolean
          last_donation_date?: string | null
          donation_count?: number
          contact_phone: string
          contact_whatsapp?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          blood_group?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'
          city?: string
          area?: string | null
          is_available?: boolean
          last_donation_date?: string | null
          donation_count?: number
          contact_phone?: string
          contact_whatsapp?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      blood_requests: {
        Row: {
          id: string
          requester_id: string
          patient_name: string
          blood_group: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'
          units_needed: number
          hospital_name: string
          hospital_address: string | null
          city: string
          contact_phone: string
          urgency_level: 'normal' | 'urgent' | 'critical'
          status: 'open' | 'fulfilled' | 'closed'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          requester_id: string
          patient_name: string
          blood_group: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'
          units_needed?: number
          hospital_name: string
          hospital_address?: string | null
          city: string
          contact_phone: string
          urgency_level?: 'normal' | 'urgent' | 'critical'
          status?: 'open' | 'fulfilled' | 'closed'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          requester_id?: string
          patient_name?: string
          blood_group?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'
          units_needed?: number
          hospital_name?: string
          hospital_address?: string | null
          city?: string
          contact_phone?: string
          urgency_level?: 'normal' | 'urgent' | 'critical'
          status?: 'open' | 'fulfilled' | 'closed'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      emergency_guides: {
        Row: {
          id: string
          title: string
          slug: string
          category: 'medical' | 'accident' | 'fire' | 'natural_disaster' | 'other'
          description: string | null
          steps: Json
          checklist: Json
          emergency_contacts: Json
          ngo_contacts: Json
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          category: 'medical' | 'accident' | 'fire' | 'natural_disaster' | 'other'
          description?: string | null
          steps?: Json
          checklist?: Json
          emergency_contacts?: Json
          ngo_contacts?: Json
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          category?: 'medical' | 'accident' | 'fire' | 'natural_disaster' | 'other'
          description?: string | null
          steps?: Json
          checklist?: Json
          emergency_contacts?: Json
          ngo_contacts?: Json
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      donation_categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          icon?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          icon?: string | null
          created_at?: string
        }
      }
      donation_cases: {
        Row: {
          id: string
          title: string
          slug: string
          category_id: string | null
          description: string
          story: string | null
          beneficiary_name: string | null
          goal_amount: number
          raised_amount: number
          currency: string
          images: string[] | null
          documents: string[] | null
          is_verified: boolean
          is_active: boolean
          author_id: string | null
          jazzcash_number: string | null
          easypaisa_number: string | null
          bank_details: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          category_id?: string | null
          description: string
          story?: string | null
          beneficiary_name?: string | null
          goal_amount: number
          raised_amount?: number
          currency?: string
          images?: string[] | null
          documents?: string[] | null
          is_verified?: boolean
          is_active?: boolean
          author_id?: string | null
          jazzcash_number?: string | null
          easypaisa_number?: string | null
          bank_details?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          category_id?: string | null
          description?: string
          story?: string | null
          beneficiary_name?: string | null
          goal_amount?: number
          raised_amount?: number
          currency?: string
          images?: string[] | null
          documents?: string[] | null
          is_verified?: boolean
          is_active?: boolean
          author_id?: string | null
          jazzcash_number?: string | null
          easypaisa_number?: string | null
          bank_details?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      donations: {
        Row: {
          id: string
          case_id: string | null
          donor_id: string | null
          amount: number
          payment_method: string | null
          transaction_id: string | null
          is_anonymous: boolean
          donor_name: string | null
          donor_message: string | null
          status: 'pending' | 'completed' | 'failed' | 'refunded'
          created_at: string
        }
        Insert: {
          id?: string
          case_id?: string | null
          donor_id?: string | null
          amount: number
          payment_method?: string | null
          transaction_id?: string | null
          is_anonymous?: boolean
          donor_name?: string | null
          donor_message?: string | null
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          created_at?: string
        }
        Update: {
          id?: string
          case_id?: string | null
          donor_id?: string | null
          amount?: number
          payment_method?: string | null
          transaction_id?: string | null
          is_anonymous?: boolean
          donor_name?: string | null
          donor_message?: string | null
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          created_at?: string
        }
      }
      donation_updates: {
        Row: {
          id: string
          case_id: string
          title: string
          content: string
          images: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          case_id: string
          title: string
          content: string
          images?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          case_id?: string
          title?: string
          content?: string
          images?: string[] | null
          created_at?: string
        }
      }
      volunteers: {
        Row: {
          id: string
          user_id: string
          skills: string[] | null
          areas_of_interest: string[] | null
          city: string
          area: string | null
          availability: 'weekdays' | 'weekends' | 'both' | 'flexible' | null
          hours_per_week: number | null
          experience: string | null
          is_active: boolean
          tasks_completed: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          skills?: string[] | null
          areas_of_interest?: string[] | null
          city: string
          area?: string | null
          availability?: 'weekdays' | 'weekends' | 'both' | 'flexible' | null
          hours_per_week?: number | null
          experience?: string | null
          is_active?: boolean
          tasks_completed?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          skills?: string[] | null
          areas_of_interest?: string[] | null
          city?: string
          area?: string | null
          availability?: 'weekdays' | 'weekends' | 'both' | 'flexible' | null
          hours_per_week?: number | null
          experience?: string | null
          is_active?: boolean
          tasks_completed?: number
          created_at?: string
          updated_at?: string
        }
      }
      volunteer_discussions: {
        Row: {
          id: string
          title: string
          content: string
          author_id: string
          category: string | null
          is_pinned: boolean
          views_count: number
          replies_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          author_id: string
          category?: string | null
          is_pinned?: boolean
          views_count?: number
          replies_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          author_id?: string
          category?: string | null
          is_pinned?: boolean
          views_count?: number
          replies_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      discussion_replies: {
        Row: {
          id: string
          discussion_id: string
          author_id: string
          content: string
          likes_count: number
          created_at: string
        }
        Insert: {
          id?: string
          discussion_id: string
          author_id: string
          content: string
          likes_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          discussion_id?: string
          author_id?: string
          content?: string
          likes_count?: number
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string | null
          link: string | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          message?: string | null
          link?: string | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          message?: string | null
          link?: string | null
          is_read?: boolean
          created_at?: string
        }
      }
      contact_messages: {
        Row: {
          id: string
          name: string
          email: string
          subject: string | null
          message: string
          is_resolved: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          subject?: string | null
          message: string
          is_resolved?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          subject?: string | null
          message?: string
          is_resolved?: boolean
          created_at?: string
        }
      }
      site_stats: {
        Row: {
          id: string
          stat_date: string
          total_users: number
          total_guides: number
          total_donors: number
          total_volunteers: number
          total_donations_amount: number
          total_blood_requests: number
          created_at: string
        }
        Insert: {
          id?: string
          stat_date?: string
          total_users?: number
          total_guides?: number
          total_donors?: number
          total_volunteers?: number
          total_donations_amount?: number
          total_blood_requests?: number
          created_at?: string
        }
        Update: {
          id?: string
          stat_date?: string
          total_users?: number
          total_guides?: number
          total_donors?: number
          total_volunteers?: number
          total_donations_amount?: number
          total_blood_requests?: number
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_guide_views: {
        Args: { guide_id: string }
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          profile_pic: string | null;
          city: string | null;
          lat: number | null;
          lng: number | null;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          phone?: string | null;
          profile_pic?: string | null;
          city?: string | null;
          lat?: number | null;
          lng?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          profile_pic?: string | null;
          city?: string | null;
          lat?: number | null;
          lng?: number | null;
          created_at?: string;
        };
      };
      gym_owners: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          is_verified: boolean;
          plan_type: string;
          country: string;
          currency: string;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          phone?: string | null;
          is_verified?: boolean;
          plan_type?: string;
          country?: string;
          currency?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          is_verified?: boolean;
          plan_type?: string;
          country?: string;
          currency?: string;
          created_at?: string;
        };
      };
      gyms: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          description: string | null;
          address: string;
          country: string;
          lat: number;
          lng: number;
          location: unknown | null;
          phone: string;
          email: string;
          gym_type: string;
          gender_type: string;
          is_verified: boolean;
          is_featured: boolean;
          total_rating: number;
          rating_count: number;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          description?: string | null;
          address: string;
          country?: string;
          lat: number;
          lng: number;
          phone: string;
          email: string;
          gym_type?: string;
          gender_type?: string;
          is_verified?: boolean;
          is_featured?: boolean;
          total_rating?: number;
          rating_count?: number;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          name?: string;
          description?: string | null;
          address?: string;
          country?: string;
          lat?: number;
          lng?: number;
          phone?: string;
          email?: string;
          gym_type?: string;
          gender_type?: string;
          is_verified?: boolean;
          is_featured?: boolean;
          total_rating?: number;
          rating_count?: number;
          status?: string;
          created_at?: string;
        };
      };
      gym_photos: {
        Row: {
          id: string;
          gym_id: string;
          url: string;
          is_video: boolean;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          gym_id: string;
          url: string;
          is_video?: boolean;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          gym_id?: string;
          url?: string;
          is_video?: boolean;
          order_index?: number;
          created_at?: string;
        };
      };
      gym_timings: {
        Row: {
          id: string;
          gym_id: string;
          day_of_week: number;
          open_time: string | null;
          close_time: string | null;
          is_closed: boolean;
          is_24x7: boolean;
        };
        Insert: {
          id?: string;
          gym_id: string;
          day_of_week: number;
          open_time?: string | null;
          close_time?: string | null;
          is_closed?: boolean;
          is_24x7?: boolean;
        };
        Update: {
          id?: string;
          gym_id?: string;
          day_of_week?: number;
          open_time?: string | null;
          close_time?: string | null;
          is_closed?: boolean;
          is_24x7?: boolean;
        };
      };
      gym_amenities: {
        Row: {
          id: string;
          gym_id: string;
          amenity_name: string;
        };
        Insert: {
          id?: string;
          gym_id: string;
          amenity_name: string;
        };
        Update: {
          id?: string;
          gym_id?: string;
          amenity_name?: string;
        };
      };
      gym_equipment: {
        Row: {
          id: string;
          gym_id: string;
          equipment_name: string;
        };
        Insert: {
          id?: string;
          gym_id: string;
          equipment_name: string;
        };
        Update: {
          id?: string;
          gym_id?: string;
          equipment_name?: string;
        };
      };
      membership_plans: {
        Row: {
          id: string;
          gym_id: string;
          plan_name: string;
          duration_days: number;
          price: number;
          currency: string;
          features: string[] | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          gym_id: string;
          plan_name: string;
          duration_days?: number;
          price: number;
          currency?: string;
          features?: string[] | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          gym_id?: string;
          plan_name?: string;
          duration_days?: number;
          price?: number;
          currency?: string;
          features?: string[] | null;
          is_active?: boolean;
          created_at?: string;
        };
      };
      trainers: {
        Row: {
          id: string;
          gym_id: string;
          name: string;
          photo_url: string | null;
          specialization: string;
          experience_years: number;
          bio: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          gym_id: string;
          name: string;
          photo_url?: string | null;
          specialization: string;
          experience_years?: number;
          bio?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          gym_id?: string;
          name?: string;
          photo_url?: string | null;
          specialization?: string;
          experience_years?: number;
          bio?: string | null;
          created_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          user_id: string;
          gym_id: string;
          rating: number;
          cleanliness_rating: number | null;
          equipment_rating: number | null;
          staff_rating: number | null;
          value_rating: number | null;
          comment: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          gym_id: string;
          rating: number;
          cleanliness_rating?: number | null;
          equipment_rating?: number | null;
          staff_rating?: number | null;
          value_rating?: number | null;
          comment?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          gym_id?: string;
          rating?: number;
          cleanliness_rating?: number | null;
          equipment_rating?: number | null;
          staff_rating?: number | null;
          value_rating?: number | null;
          comment?: string | null;
          created_at?: string;
        };
      };
      saved_gyms: {
        Row: {
          id: string;
          user_id: string;
          gym_id: string;
          saved_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          gym_id: string;
          saved_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          gym_id?: string;
          saved_at?: string;
        };
      };
      trial_requests: {
        Row: {
          id: string;
          user_id: string;
          gym_id: string;
          preferred_date: string;
          status: string;
          note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          gym_id: string;
          preferred_date: string;
          status?: string;
          note?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          gym_id?: string;
          preferred_date?: string;
          status?: string;
          note?: string | null;
          created_at?: string;
        };
      };
      announcements: {
        Row: {
          id: string;
          gym_id: string;
          title: string;
          body: string;
          expires_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          gym_id: string;
          title: string;
          body: string;
          expires_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          gym_id?: string;
          title?: string;
          body?: string;
          expires_at?: string | null;
          created_at?: string;
        };
      };
      gym_deals: {
        Row: {
          id: string;
          gym_id: string;
          title: string;
          description: string;
          discount_percent: number;
          expires_at: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          gym_id: string;
          title: string;
          description: string;
          discount_percent: number;
          expires_at: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          gym_id?: string;
          title?: string;
          description?: string;
          discount_percent?: number;
          expires_at?: string;
          is_active?: boolean;
          created_at?: string;
        };
      };
      owner_subscriptions: {
        Row: {
          id: string;
          owner_id: string;
          plan_type: string;
          start_date: string;
          end_date: string;
          payment_id: string;
          amount: number;
          currency: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          plan_type?: string;
          start_date?: string;
          end_date: string;
          payment_id: string;
          amount: number;
          currency?: string;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          plan_type?: string;
          start_date?: string;
          end_date?: string;
          payment_id?: string;
          amount?: number;
          currency?: string;
          status?: string;
          created_at?: string;
        };
      };
      verifications: {
        Row: {
          id: string;
          owner_id: string;
          gym_id: string;
          document_url: string;
          status: string;
          reviewed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          gym_id: string;
          document_url: string;
          status?: string;
          reviewed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          gym_id?: string;
          document_url?: string;
          status?: string;
          reviewed_at?: string | null;
          created_at?: string;
        };
      };
    };
    Functions: {
      gyms_within_radius: {
        Args: {
          user_lat: number;
          user_lng: number;
          radius_km: number;
        };
        Returns: {
          id: string;
          owner_id: string;
          name: string;
          description: string;
          address: string;
          country: string;
          lat: number;
          lng: number;
          phone: string;
          email: string;
          gym_type: string;
          gender_type: string;
          is_verified: boolean;
          is_featured: boolean;
          total_rating: number;
          rating_count: number;
          status: string;
          created_at: string;
          distance_km: number;
        }[];
      };
    };
  };
}

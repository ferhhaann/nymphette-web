export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      admin_audit_log: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: unknown | null
          record_id: string | null
          table_name: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          record_id?: string | null
          table_name: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          record_id?: string | null
          table_name?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      authors: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          social_links: Json | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          social_links?: Json | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          social_links?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      blog_categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      blog_comments: {
        Row: {
          author_email: string
          author_name: string
          content: string
          created_at: string | null
          id: string
          post_id: string | null
          status: string | null
        }
        Insert: {
          author_email: string
          author_name: string
          content: string
          created_at?: string | null
          id?: string
          post_id?: string | null
          status?: string | null
        }
        Update: {
          author_email?: string
          author_name?: string
          content?: string
          created_at?: string | null
          id?: string
          post_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string | null
          category_id: string | null
          content: string
          created_at: string | null
          excerpt: string | null
          featured: boolean | null
          featured_image: string | null
          gallery_images: Json | null
          id: string
          meta_description: string | null
          meta_title: string | null
          published_at: string | null
          reading_time: number | null
          slug: string
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          views_count: number | null
        }
        Insert: {
          author_id?: string | null
          category_id?: string | null
          content: string
          created_at?: string | null
          excerpt?: string | null
          featured?: boolean | null
          featured_image?: string | null
          gallery_images?: Json | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          reading_time?: number | null
          slug: string
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          views_count?: number | null
        }
        Update: {
          author_id?: string | null
          category_id?: string | null
          content?: string
          created_at?: string | null
          excerpt?: string | null
          featured?: boolean | null
          featured_image?: string | null
          gallery_images?: Json | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          reading_time?: number | null
          slug?: string
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "authors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_info: {
        Row: {
          created_at: string | null
          id: string
          key: string
          section: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          created_at?: string | null
          id?: string
          key: string
          section: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          created_at?: string | null
          id?: string
          key?: string
          section?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          status: string | null
          subject: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          status?: string | null
          subject?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          status?: string | null
          subject?: string | null
        }
        Relationships: []
      }
      content: {
        Row: {
          created_at: string | null
          id: string
          key: string
          section: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          created_at?: string | null
          id?: string
          key: string
          section: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          created_at?: string | null
          id?: string
          key?: string
          section?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      cors_configuration: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          setting_name: string
          setting_value: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          setting_name: string
          setting_value: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          setting_name?: string
          setting_value?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      countries: {
        Row: {
          about_content: string | null
          annual_visitors: number | null
          art_culture_content: string | null
          before_you_go_tips: Json | null
          best_season: string | null
          best_time_content: string | null
          capital: string | null
          climate: string | null
          contact_email: string | null
          contact_info: Json | null
          contact_phone: string | null
          created_at: string | null
          culture: string | null
          currency: string | null
          description: string | null
          dos_donts: Json | null
          food_shopping_content: string | null
          fun_facts: Json | null
          gender_female_percentage: number | null
          gender_male_percentage: number | null
          hero_image_url: string | null
          hero_images: Json | null
          id: string
          languages: string[] | null
          map_outline_url: string | null
          name: string
          overview_description: string | null
          reasons_to_visit: Json | null
          region: string
          slug: string
          speciality: string | null
          travel_tips: string | null
          updated_at: string | null
          visitor_statistics: Json | null
        }
        Insert: {
          about_content?: string | null
          annual_visitors?: number | null
          art_culture_content?: string | null
          before_you_go_tips?: Json | null
          best_season?: string | null
          best_time_content?: string | null
          capital?: string | null
          climate?: string | null
          contact_email?: string | null
          contact_info?: Json | null
          contact_phone?: string | null
          created_at?: string | null
          culture?: string | null
          currency?: string | null
          description?: string | null
          dos_donts?: Json | null
          food_shopping_content?: string | null
          fun_facts?: Json | null
          gender_female_percentage?: number | null
          gender_male_percentage?: number | null
          hero_image_url?: string | null
          hero_images?: Json | null
          id?: string
          languages?: string[] | null
          map_outline_url?: string | null
          name: string
          overview_description?: string | null
          reasons_to_visit?: Json | null
          region: string
          slug: string
          speciality?: string | null
          travel_tips?: string | null
          updated_at?: string | null
          visitor_statistics?: Json | null
        }
        Update: {
          about_content?: string | null
          annual_visitors?: number | null
          art_culture_content?: string | null
          before_you_go_tips?: Json | null
          best_season?: string | null
          best_time_content?: string | null
          capital?: string | null
          climate?: string | null
          contact_email?: string | null
          contact_info?: Json | null
          contact_phone?: string | null
          created_at?: string | null
          culture?: string | null
          currency?: string | null
          description?: string | null
          dos_donts?: Json | null
          food_shopping_content?: string | null
          fun_facts?: Json | null
          gender_female_percentage?: number | null
          gender_male_percentage?: number | null
          hero_image_url?: string | null
          hero_images?: Json | null
          id?: string
          languages?: string[] | null
          map_outline_url?: string | null
          name?: string
          overview_description?: string | null
          reasons_to_visit?: Json | null
          region?: string
          slug?: string
          speciality?: string | null
          travel_tips?: string | null
          updated_at?: string | null
          visitor_statistics?: Json | null
        }
        Relationships: []
      }
      country_attractions: {
        Row: {
          category: string
          country_id: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          order_index: number | null
          type: string | null
        }
        Insert: {
          category?: string
          country_id: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          order_index?: number | null
          type?: string | null
        }
        Update: {
          category?: string
          country_id?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          order_index?: number | null
          type?: string | null
        }
        Relationships: []
      }
      country_cities: {
        Row: {
          country_id: string
          created_at: string
          description: string | null
          highlights: string[] | null
          id: string
          image_url: string | null
          is_capital: boolean | null
          name: string
          order_index: number | null
        }
        Insert: {
          country_id: string
          created_at?: string
          description?: string | null
          highlights?: string[] | null
          id?: string
          image_url?: string | null
          is_capital?: boolean | null
          name: string
          order_index?: number | null
        }
        Update: {
          country_id?: string
          created_at?: string
          description?: string | null
          highlights?: string[] | null
          id?: string
          image_url?: string | null
          is_capital?: boolean | null
          name?: string
          order_index?: number | null
        }
        Relationships: []
      }
      country_content: {
        Row: {
          content: Json
          country_id: string
          created_at: string
          id: string
          order_index: number | null
          section_type: string
          title: string | null
          updated_at: string
        }
        Insert: {
          content?: Json
          country_id: string
          created_at?: string
          id?: string
          order_index?: number | null
          section_type: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          content?: Json
          country_id?: string
          created_at?: string
          id?: string
          order_index?: number | null
          section_type?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      country_essential_tips: {
        Row: {
          country_id: string
          created_at: string | null
          icon: string
          id: string
          note: string
          order_index: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          country_id: string
          created_at?: string | null
          icon?: string
          id?: string
          note: string
          order_index?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          country_id?: string
          created_at?: string | null
          icon?: string
          id?: string
          note?: string
          order_index?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_country_essential_tips_country"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      country_faqs: {
        Row: {
          answer: string
          country_id: string | null
          created_at: string | null
          id: string
          question: string
        }
        Insert: {
          answer: string
          country_id?: string | null
          created_at?: string | null
          id?: string
          question: string
        }
        Update: {
          answer?: string
          country_id?: string | null
          created_at?: string | null
          id?: string
          question?: string
        }
        Relationships: [
          {
            foreignKeyName: "country_faqs_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      country_hero_images: {
        Row: {
          alt_text: string | null
          caption: string | null
          country_id: string
          created_at: string | null
          id: string
          image_url: string
          order_index: number | null
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          country_id: string
          created_at?: string | null
          id?: string
          image_url: string
          order_index?: number | null
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          country_id?: string
          created_at?: string | null
          id?: string
          image_url?: string
          order_index?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "country_hero_images_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      country_must_visit: {
        Row: {
          country_id: string
          created_at: string | null
          description: string | null
          highlights: string[] | null
          id: string
          image_url: string | null
          name: string
          order_index: number | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          country_id: string
          created_at?: string | null
          description?: string | null
          highlights?: string[] | null
          id?: string
          image_url?: string | null
          name: string
          order_index?: number | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          country_id?: string
          created_at?: string | null
          description?: string | null
          highlights?: string[] | null
          id?: string
          image_url?: string | null
          name?: string
          order_index?: number | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_country_must_visit_country"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      country_sections: {
        Row: {
          content: Json
          country_id: string
          created_at: string | null
          id: string
          images: Json | null
          is_enabled: boolean | null
          order_index: number | null
          section_name: string
          title: string | null
          updated_at: string | null
        }
        Insert: {
          content?: Json
          country_id: string
          created_at?: string | null
          id?: string
          images?: Json | null
          is_enabled?: boolean | null
          order_index?: number | null
          section_name: string
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: Json
          country_id?: string
          created_at?: string | null
          id?: string
          images?: Json | null
          is_enabled?: boolean | null
          order_index?: number | null
          section_name?: string
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "country_sections_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      enquiries: {
        Row: {
          assigned_to: string | null
          created_at: string
          destination: string | null
          email: string
          id: string
          message: string | null
          name: string
          notes: string | null
          phone: string | null
          priority: string | null
          source: string
          source_id: string | null
          status: string | null
          travel_date: string | null
          travelers: number | null
          updated_at: string
          whatsapp_sent: boolean | null
          whatsapp_sent_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          destination?: string | null
          email: string
          id?: string
          message?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          priority?: string | null
          source: string
          source_id?: string | null
          status?: string | null
          travel_date?: string | null
          travelers?: number | null
          updated_at?: string
          whatsapp_sent?: boolean | null
          whatsapp_sent_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          destination?: string | null
          email?: string
          id?: string
          message?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          priority?: string | null
          source?: string
          source_id?: string | null
          status?: string | null
          travel_date?: string | null
          travelers?: number | null
          updated_at?: string
          whatsapp_sent?: boolean | null
          whatsapp_sent_at?: string | null
        }
        Relationships: []
      }
      enquiry_logs: {
        Row: {
          action: string
          created_at: string
          enquiry_id: string | null
          id: string
          ip_address: string | null
          new_values: Json | null
          notes: string | null
          old_values: Json | null
          performed_by: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          created_at?: string
          enquiry_id?: string | null
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          notes?: string | null
          old_values?: Json | null
          performed_by?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          enquiry_id?: string | null
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          notes?: string | null
          old_values?: Json | null
          performed_by?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enquiry_logs_enquiry_id_fkey"
            columns: ["enquiry_id"]
            isOneToOne: false
            referencedRelation: "enquiries"
            referencedColumns: ["id"]
          },
        ]
      }
      essential_tips: {
        Row: {
          country_id: string | null
          created_at: string | null
          icon: string
          id: string
          note: string
          title: string
        }
        Insert: {
          country_id?: string | null
          created_at?: string | null
          icon: string
          id?: string
          note: string
          title: string
        }
        Update: {
          country_id?: string | null
          created_at?: string | null
          icon?: string
          id?: string
          note?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "essential_tips_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      famous_places: {
        Row: {
          country_id: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          type: string | null
        }
        Insert: {
          country_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          type?: string | null
        }
        Update: {
          country_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "famous_places_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      group_tour_categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      group_tours: {
        Row: {
          available_spots: number
          badges: string[] | null
          category_id: string | null
          contact_info: Json | null
          created_at: string | null
          currency: string | null
          description: string | null
          destination: string
          difficulty_level: string | null
          duration: string
          early_bird_discount: number | null
          end_date: string
          exclusions: string[] | null
          featured: boolean | null
          gallery_images: Json | null
          group_type: string | null
          highlights: string[] | null
          id: string
          image_url: string | null
          inclusions: string[] | null
          is_eco_friendly: boolean | null
          itinerary: Json | null
          last_minute_discount: number | null
          max_age: number | null
          max_participants: number
          min_age: number | null
          original_price: number | null
          price: number
          rating: number | null
          reviews_count: number | null
          start_date: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          available_spots: number
          badges?: string[] | null
          category_id?: string | null
          contact_info?: Json | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          destination: string
          difficulty_level?: string | null
          duration: string
          early_bird_discount?: number | null
          end_date: string
          exclusions?: string[] | null
          featured?: boolean | null
          gallery_images?: Json | null
          group_type?: string | null
          highlights?: string[] | null
          id?: string
          image_url?: string | null
          inclusions?: string[] | null
          is_eco_friendly?: boolean | null
          itinerary?: Json | null
          last_minute_discount?: number | null
          max_age?: number | null
          max_participants: number
          min_age?: number | null
          original_price?: number | null
          price: number
          rating?: number | null
          reviews_count?: number | null
          start_date: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          available_spots?: number
          badges?: string[] | null
          category_id?: string | null
          contact_info?: Json | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          destination?: string
          difficulty_level?: string | null
          duration?: string
          early_bird_discount?: number | null
          end_date?: string
          exclusions?: string[] | null
          featured?: boolean | null
          gallery_images?: Json | null
          group_type?: string | null
          highlights?: string[] | null
          id?: string
          image_url?: string | null
          inclusions?: string[] | null
          is_eco_friendly?: boolean | null
          itinerary?: Json | null
          last_minute_discount?: number | null
          max_age?: number | null
          max_participants?: number
          min_age?: number | null
          original_price?: number | null
          price?: number
          rating?: number | null
          reviews_count?: number | null
          start_date?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_tours_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "group_tour_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      packages: {
        Row: {
          best_time: string | null
          category: string
          country: string
          country_id: string | null
          country_slug: string | null
          created_at: string | null
          duration: string
          exclusions: string[] | null
          featured: boolean | null
          group_size: string | null
          highlights: string[] | null
          id: string
          image: string
          inclusions: string[] | null
          itinerary: Json | null
          original_price: string | null
          overview_badge_style: string | null
          overview_badge_variant: string | null
          overview_description: string | null
          overview_highlights_label: string | null
          overview_section_title: string | null
          price: string
          rating: number | null
          region: string
          reviews: number | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          best_time?: string | null
          category: string
          country: string
          country_id?: string | null
          country_slug?: string | null
          created_at?: string | null
          duration: string
          exclusions?: string[] | null
          featured?: boolean | null
          group_size?: string | null
          highlights?: string[] | null
          id?: string
          image: string
          inclusions?: string[] | null
          itinerary?: Json | null
          original_price?: string | null
          overview_badge_style?: string | null
          overview_badge_variant?: string | null
          overview_description?: string | null
          overview_highlights_label?: string | null
          overview_section_title?: string | null
          price: string
          rating?: number | null
          region: string
          reviews?: number | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          best_time?: string | null
          category?: string
          country?: string
          country_id?: string | null
          country_slug?: string | null
          created_at?: string | null
          duration?: string
          exclusions?: string[] | null
          featured?: boolean | null
          group_size?: string | null
          highlights?: string[] | null
          id?: string
          image?: string
          inclusions?: string[] | null
          itinerary?: Json | null
          original_price?: string | null
          overview_badge_style?: string | null
          overview_badge_variant?: string | null
          overview_description?: string | null
          overview_highlights_label?: string | null
          overview_section_title?: string | null
          price?: string
          rating?: number | null
          region?: string
          reviews?: number | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_packages_country_id"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_settings: {
        Row: {
          canonical_url: string | null
          created_at: string
          id: string
          is_active: boolean
          meta_description: string
          meta_keywords: string | null
          meta_title: string
          og_description: string | null
          og_image: string | null
          og_title: string | null
          page_type: string
          page_url: string
          robots_meta: string | null
          structured_data: Json | null
          updated_at: string
        }
        Insert: {
          canonical_url?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          meta_description: string
          meta_keywords?: string | null
          meta_title: string
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          page_type: string
          page_url: string
          robots_meta?: string | null
          structured_data?: Json | null
          updated_at?: string
        }
        Update: {
          canonical_url?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          meta_description?: string
          meta_keywords?: string | null
          meta_title?: string
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          page_type?: string
          page_url?: string
          robots_meta?: string | null
          structured_data?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      tour_reviews: {
        Row: {
          created_at: string | null
          id: string
          is_verified: boolean | null
          rating: number | null
          review_date: string | null
          review_text: string | null
          reviewer_image: string | null
          reviewer_name: string
          social_media_link: string | null
          tour_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          rating?: number | null
          review_date?: string | null
          review_text?: string | null
          reviewer_image?: string | null
          reviewer_name: string
          social_media_link?: string | null
          tour_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          rating?: number | null
          review_date?: string | null
          review_text?: string | null
          reviewer_image?: string | null
          reviewer_name?: string
          social_media_link?: string | null
          tour_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tour_reviews_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "group_tours"
            referencedColumns: ["id"]
          },
        ]
      }
      travel_purposes: {
        Row: {
          color: string | null
          country_id: string | null
          created_at: string | null
          display_name: string | null
          id: string
          name: string
          percentage: number
        }
        Insert: {
          color?: string | null
          country_id?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          name: string
          percentage: number
        }
        Update: {
          color?: string | null
          country_id?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          name?: string
          percentage?: number
        }
        Relationships: [
          {
            foreignKeyName: "travel_purposes_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      audit_data_access: {
        Args: { operation: string; table_name: string; user_id?: string }
        Returns: undefined
      }
      check_auth_security_compliance: {
        Args: Record<PropertyKey, never>
        Returns: {
          compliant: boolean
          current_value: string
          recommended_value: string
          setting_name: string
          severity: string
        }[]
      }
      get_author_for_blog: {
        Args: { author_id: string }
        Returns: {
          avatar_url: string
          bio: string
          id: string
          name: string
          social_links: Json
        }[]
      }
      get_author_public_info: {
        Args: { author_id: string }
        Returns: {
          avatar_url: string
          bio: string
          id: string
          name: string
          social_links: Json
        }[]
      }
      get_author_public_info_safe: {
        Args: { author_id: string }
        Returns: {
          avatar_url: string
          bio: string
          id: string
          name: string
          social_links: Json
        }[]
      }
      get_author_safe_info: {
        Args: { author_id: string }
        Returns: {
          avatar_url: string
          bio: string
          created_at: string
          id: string
          name: string
          social_links: Json
          updated_at: string
        }[]
      }
      get_authors_public: {
        Args: Record<PropertyKey, never>
        Returns: {
          avatar_url: string
          bio: string
          created_at: string
          id: string
          name: string
          social_links: Json
          updated_at: string
        }[]
      }
      get_blog_comments_public: {
        Args: { blog_post_id: string }
        Returns: {
          author_name: string
          content: string
          created_at: string
          id: string
          post_id: string
          status: string
        }[]
      }
      get_blog_comments_safe: {
        Args: { blog_post_id: string }
        Returns: {
          author_name: string
          content: string
          created_at: string
          id: string
          post_id: string
          status: string
        }[]
      }
      get_group_tour_image_url: {
        Args: { image_path: string }
        Returns: string
      }
      get_security_recommendations: {
        Args: Record<PropertyKey, never>
        Returns: {
          action_required: string
          category: string
          priority: string
          recommendation: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      log_admin_action: {
        Args: { _action: string; _record_id?: string; _table_name: string }
        Returns: undefined
      }
      validate_admin_access: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const

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
      countries: {
        Row: {
          annual_visitors: number | null
          best_season: string | null
          capital: string | null
          climate: string | null
          created_at: string | null
          culture: string | null
          currency: string | null
          gender_female_percentage: number | null
          gender_male_percentage: number | null
          id: string
          languages: string[] | null
          name: string
          region: string
          slug: string
          speciality: string | null
          updated_at: string | null
        }
        Insert: {
          annual_visitors?: number | null
          best_season?: string | null
          capital?: string | null
          climate?: string | null
          created_at?: string | null
          culture?: string | null
          currency?: string | null
          gender_female_percentage?: number | null
          gender_male_percentage?: number | null
          id?: string
          languages?: string[] | null
          name: string
          region: string
          slug: string
          speciality?: string | null
          updated_at?: string | null
        }
        Update: {
          annual_visitors?: number | null
          best_season?: string | null
          capital?: string | null
          climate?: string | null
          created_at?: string | null
          culture?: string | null
          currency?: string | null
          gender_female_percentage?: number | null
          gender_male_percentage?: number | null
          id?: string
          languages?: string[] | null
          name?: string
          region?: string
          slug?: string
          speciality?: string | null
          updated_at?: string | null
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
      packages: {
        Row: {
          best_time: string | null
          category: string
          country: string
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
          title: string
          updated_at: string | null
        }
        Insert: {
          best_time?: string | null
          category: string
          country: string
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
          title: string
          updated_at?: string | null
        }
        Update: {
          best_time?: string | null
          category?: string
          country?: string
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
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      travel_purposes: {
        Row: {
          country_id: string | null
          created_at: string | null
          id: string
          name: string
          percentage: number
        }
        Insert: {
          country_id?: string | null
          created_at?: string | null
          id?: string
          name: string
          percentage: number
        }
        Update: {
          country_id?: string | null
          created_at?: string | null
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const

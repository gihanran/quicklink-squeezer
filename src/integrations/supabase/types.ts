export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bio_card_links: {
        Row: {
          bio_card_id: string | null
          clicks: number | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          title: string
          url: string
        }
        Insert: {
          bio_card_id?: string | null
          clicks?: number | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          title: string
          url: string
        }
        Update: {
          bio_card_id?: string | null
          clicks?: number | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          title?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "bio_card_links_bio_card_id_fkey"
            columns: ["bio_card_id"]
            isOneToOne: false
            referencedRelation: "bio_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      bio_card_social_links: {
        Row: {
          bio_card_id: string | null
          created_at: string | null
          icon: string | null
          id: string
          platform: string
          url: string
        }
        Insert: {
          bio_card_id?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          platform: string
          url: string
        }
        Update: {
          bio_card_id?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          platform?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "bio_card_social_links_bio_card_id_fkey"
            columns: ["bio_card_id"]
            isOneToOne: false
            referencedRelation: "bio_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      bio_cards: {
        Row: {
          background_image_url: string | null
          bg_color: string | null
          button_color: string | null
          button_style: string | null
          clicks: number | null
          created_at: string | null
          description: string | null
          id: string
          profile_image_url: string | null
          slug: string
          title: string
          updated_at: string | null
          user_id: string
          views: number | null
        }
        Insert: {
          background_image_url?: string | null
          bg_color?: string | null
          button_color?: string | null
          button_style?: string | null
          clicks?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          profile_image_url?: string | null
          slug: string
          title: string
          updated_at?: string | null
          user_id: string
          views?: number | null
        }
        Update: {
          background_image_url?: string | null
          bg_color?: string | null
          button_color?: string | null
          button_style?: string | null
          clicks?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          profile_image_url?: string | null
          slug?: string
          title?: string
          updated_at?: string | null
          user_id?: string
          views?: number | null
        }
        Relationships: []
      }
      link_unlockers: {
        Row: {
          click_count: number
          countdown_seconds: number
          created_at: string
          description: string
          destination_button_text: string
          destination_link: string
          id: string
          unlocker_button_text: string
          unlocker_link: string
          unlocks: number
          user_id: string
          visits: number
        }
        Insert: {
          click_count?: number
          countdown_seconds?: number
          created_at?: string
          description?: string
          destination_button_text?: string
          destination_link: string
          id?: string
          unlocker_button_text?: string
          unlocker_link: string
          unlocks?: number
          user_id: string
          visits?: number
        }
        Update: {
          click_count?: number
          countdown_seconds?: number
          created_at?: string
          description?: string
          destination_button_text?: string
          destination_link?: string
          id?: string
          unlocker_button_text?: string
          unlocker_link?: string
          unlocks?: number
          user_id?: string
          visits?: number
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_global: boolean | null
          message: string
          sender_id: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_global?: boolean | null
          message: string
          sender_id?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_global?: boolean | null
          message?: string
          sender_id?: string | null
          title?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio_card_limit: number | null
          country: string | null
          created_at: string
          email: string | null
          first_name: string | null
          full_name: string | null
          has_completed_profile: boolean | null
          id: string
          is_active: boolean | null
          is_admin: boolean | null
          last_name: string | null
          link_limit: number | null
          updated_at: string
          whatsapp_number: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio_card_limit?: number | null
          country?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          has_completed_profile?: boolean | null
          id: string
          is_active?: boolean | null
          is_admin?: boolean | null
          last_name?: string | null
          link_limit?: number | null
          updated_at?: string
          whatsapp_number?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio_card_limit?: number | null
          country?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          has_completed_profile?: boolean | null
          id?: string
          is_active?: boolean | null
          is_admin?: boolean | null
          last_name?: string | null
          link_limit?: number | null
          updated_at?: string
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      short_urls: {
        Row: {
          created_at: string
          custom_short_code: string | null
          expires_at: string | null
          id: string
          original_url: string
          short_code: string
          title: string | null
          user_id: string | null
          visits: number
        }
        Insert: {
          created_at?: string
          custom_short_code?: string | null
          expires_at?: string | null
          id?: string
          original_url: string
          short_code: string
          title?: string | null
          user_id?: string | null
          visits?: number
        }
        Update: {
          created_at?: string
          custom_short_code?: string | null
          expires_at?: string | null
          id?: string
          original_url?: string
          short_code?: string
          title?: string | null
          user_id?: string | null
          visits?: number
        }
        Relationships: []
      }
      url_unlockers: {
        Row: {
          clicks: number
          created_at: string
          destination_url: string
          expiration_date: string
          id: string
          sequence: string[]
          title: string | null
          unlocks: number
          updated_at: string
          user_id: string
        }
        Insert: {
          clicks?: number
          created_at?: string
          destination_url: string
          expiration_date?: string
          id?: string
          sequence?: string[]
          title?: string | null
          unlocks?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          clicks?: number
          created_at?: string
          destination_url?: string
          expiration_date?: string
          id?: string
          sequence?: string[]
          title?: string | null
          unlocks?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      url_visits: {
        Row: {
          id: string
          ip_address: string | null
          referrer: string | null
          short_url_id: string
          user_agent: string | null
          visited_at: string
        }
        Insert: {
          id?: string
          ip_address?: string | null
          referrer?: string | null
          short_url_id: string
          user_agent?: string | null
          visited_at?: string
        }
        Update: {
          id?: string
          ip_address?: string | null
          referrer?: string | null
          short_url_id?: string
          user_agent?: string | null
          visited_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "url_visits_short_url_id_fkey"
            columns: ["short_url_id"]
            isOneToOne: false
            referencedRelation: "short_urls"
            referencedColumns: ["id"]
          },
        ]
      }
      user_notifications: {
        Row: {
          id: string
          is_read: boolean | null
          notification_id: string
          user_id: string
        }
        Insert: {
          id?: string
          is_read?: boolean | null
          notification_id: string
          user_id: string
        }
        Update: {
          id?: string
          is_read?: boolean | null
          notification_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_notifications_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "notifications"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_expired_unlockers: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_total_clicks: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_clicks: number
        }[]
      }
      get_total_links_created: {
        Args: Record<PropertyKey, never>
        Returns: {
          count: number
        }[]
      }
      increment_bio_card_link_clicks: {
        Args: { link_id: string }
        Returns: undefined
      }
      increment_bio_card_views: {
        Args: { card_slug: string }
        Returns: undefined
      }
      increment_landing_page_link_clicks: {
        Args: { link_id: string }
        Returns: undefined
      }
      increment_landing_page_views: {
        Args: { page_slug: string }
        Returns: undefined
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

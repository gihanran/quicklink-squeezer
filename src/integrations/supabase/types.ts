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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

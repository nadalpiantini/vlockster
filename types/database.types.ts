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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      automated_tasks: {
        Row: {
          ai_prompt: string | null
          created_at: string | null
          cron_schedule: string | null
          id: string
          is_active: boolean | null
          last_run: string | null
          next_run: string | null
          script_content: string | null
          task_name: string
          task_type: string | null
          updated_at: string | null
          user_id: string
          webhook_url: string | null
        }
        Insert: {
          ai_prompt?: string | null
          created_at?: string | null
          cron_schedule?: string | null
          id?: string
          is_active?: boolean | null
          last_run?: string | null
          next_run?: string | null
          script_content?: string | null
          task_name: string
          task_type?: string | null
          updated_at?: string | null
          user_id: string
          webhook_url?: string | null
        }
        Update: {
          ai_prompt?: string | null
          created_at?: string | null
          cron_schedule?: string | null
          id?: string
          is_active?: boolean | null
          last_run?: string | null
          next_run?: string | null
          script_content?: string | null
          task_name?: string
          task_type?: string | null
          updated_at?: string | null
          user_id?: string
          webhook_url?: string | null
        }
        Relationships: []
      }
      backings: {
        Row: {
          amount: number
          anonymous: boolean | null
          created_at: string | null
          id: string
          message: string | null
          payment_id: string | null
          payment_status: string | null
          project_id: string
          reward_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          anonymous?: boolean | null
          created_at?: string | null
          id?: string
          message?: string | null
          payment_id?: string | null
          payment_status?: string | null
          project_id: string
          reward_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          anonymous?: boolean | null
          created_at?: string | null
          id?: string
          message?: string | null
          payment_id?: string | null
          payment_status?: string | null
          project_id?: string
          reward_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "backings_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "backings_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "rewards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "backings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          court_id: string | null
          created_at: string | null
          ends_at: string
          id: string
          notes: string | null
          price: number | null
          starts_at: string
          status: string | null
          updated_at: string | null
          user_email: string | null
          user_name: string
          user_phone: string | null
        }
        Insert: {
          court_id?: string | null
          created_at?: string | null
          ends_at: string
          id?: string
          notes?: string | null
          price?: number | null
          starts_at: string
          status?: string | null
          updated_at?: string | null
          user_email?: string | null
          user_name: string
          user_phone?: string | null
        }
        Update: {
          court_id?: string | null
          created_at?: string | null
          ends_at?: string
          id?: string
          notes?: string | null
          price?: number | null
          starts_at?: string
          status?: string | null
          updated_at?: string | null
          user_email?: string | null
          user_name?: string
          user_phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_court_id_fkey"
            columns: ["court_id"]
            isOneToOne: false
            referencedRelation: "courts"
            referencedColumns: ["id"]
          },
        ]
      }
      clubs: {
        Row: {
          active: boolean | null
          address: string | null
          city: string | null
          country: string | null
          created_at: string | null
          description: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          active?: boolean | null
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          active?: boolean | null
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      comment_likes: {
        Row: {
          comment_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          comment_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          like_count: number | null
          parent_comment_id: string | null
          post_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          like_count?: number | null
          parent_comment_id?: string | null
          post_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          like_count?: number | null
          parent_comment_id?: string | null
          post_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      communities: {
        Row: {
          cover_image_url: string | null
          created_at: string | null
          description: string | null
          id: string
          is_private: boolean | null
          member_count: number | null
          name: string
          owner_id: string
          post_count: number | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_private?: boolean | null
          member_count?: number | null
          name: string
          owner_id: string
          post_count?: number | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_private?: boolean | null
          member_count?: number | null
          name?: string
          owner_id?: string
          post_count?: number | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "communities_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_memberships: {
        Row: {
          community_id: string
          id: string
          joined_at: string | null
          role: string | null
          user_id: string
        }
        Insert: {
          community_id: string
          id?: string
          joined_at?: string | null
          role?: string | null
          user_id: string
        }
        Update: {
          community_id?: string
          id?: string
          joined_at?: string | null
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_memberships_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_memberships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      courts: {
        Row: {
          active: boolean | null
          club_id: string | null
          covered: boolean | null
          created_at: string | null
          id: string
          lighting: boolean | null
          name: string
          surface: string | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          club_id?: string | null
          covered?: boolean | null
          created_at?: string | null
          id?: string
          lighting?: boolean | null
          name: string
          surface?: string | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          club_id?: string | null
          covered?: boolean | null
          created_at?: string | null
          id?: string
          lighting?: boolean | null
          name?: string
          surface?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courts_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_requests: {
        Row: {
          created_at: string | null
          id: string
          pitch_text: string
          pitch_title: string
          portfolio_url: string | null
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          pitch_text: string
          pitch_title: string
          portfolio_url?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          pitch_text?: string
          pitch_title?: string
          portfolio_url?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "creator_requests_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creator_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      dona_advertisements: {
        Row: {
          advertiser_name: string
          clicks: number | null
          created_at: string | null
          description: string | null
          end_date: string
          id: string
          image_url: string
          impressions: number | null
          is_active: boolean | null
          organization_id: string | null
          placement: string
          start_date: string
          target_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          advertiser_name: string
          clicks?: number | null
          created_at?: string | null
          description?: string | null
          end_date: string
          id?: string
          image_url: string
          impressions?: number | null
          is_active?: boolean | null
          organization_id?: string | null
          placement: string
          start_date: string
          target_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          advertiser_name?: string
          clicks?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string
          id?: string
          image_url?: string
          impressions?: number | null
          is_active?: boolean | null
          organization_id?: string | null
          placement?: string
          start_date?: string
          target_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dona_advertisements_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "dona_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      dona_analytics: {
        Row: {
          created_at: string | null
          event_data: Json
          event_type: string
          id: string
          ip_address: unknown
          organization_id: string
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_data: Json
          event_type: string
          id?: string
          ip_address?: unknown
          organization_id: string
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_data?: Json
          event_type?: string
          id?: string
          ip_address?: unknown
          organization_id?: string
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dona_analytics_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "dona_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dona_analytics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "dona_users"
            referencedColumns: ["id"]
          },
        ]
      }
      dona_categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          parent_id: string | null
          slug: string
          sort_order: number | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          parent_id?: string | null
          slug: string
          sort_order?: number | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "dona_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "dona_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      dona_centers: {
        Row: {
          accepted_items: Json | null
          address: Json
          capacity_info: Json | null
          coordinates: Json | null
          created_at: string | null
          description: string | null
          email: string | null
          id: string
          is_active: boolean | null
          manager_id: string | null
          name: string
          operating_hours: Json | null
          organization_id: string
          phone: string | null
          status: Database["public"]["Enums"]["dona_center_status"] | null
          updated_at: string | null
        }
        Insert: {
          accepted_items?: Json | null
          address: Json
          capacity_info?: Json | null
          coordinates?: Json | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          manager_id?: string | null
          name: string
          operating_hours?: Json | null
          organization_id: string
          phone?: string | null
          status?: Database["public"]["Enums"]["dona_center_status"] | null
          updated_at?: string | null
        }
        Update: {
          accepted_items?: Json | null
          address?: Json
          capacity_info?: Json | null
          coordinates?: Json | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          manager_id?: string | null
          name?: string
          operating_hours?: Json | null
          organization_id?: string
          phone?: string | null
          status?: Database["public"]["Enums"]["dona_center_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dona_centers_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "dona_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dona_centers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "dona_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      dona_conversations: {
        Row: {
          created_at: string | null
          delivery_id: string | null
          donation_id: string | null
          id: string
          is_active: boolean | null
          last_message_at: string | null
          organization_id: string
          participants: string[]
        }
        Insert: {
          created_at?: string | null
          delivery_id?: string | null
          donation_id?: string | null
          id?: string
          is_active?: boolean | null
          last_message_at?: string | null
          organization_id: string
          participants: string[]
        }
        Update: {
          created_at?: string | null
          delivery_id?: string | null
          donation_id?: string | null
          id?: string
          is_active?: boolean | null
          last_message_at?: string | null
          organization_id?: string
          participants?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "dona_conversations_delivery_id_fkey"
            columns: ["delivery_id"]
            isOneToOne: false
            referencedRelation: "dona_deliveries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dona_conversations_donation_id_fkey"
            columns: ["donation_id"]
            isOneToOne: false
            referencedRelation: "dona_donations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dona_conversations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "dona_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      dona_deliveries: {
        Row: {
          actual_delivery_at: string | null
          actual_pickup_at: string | null
          beneficiary_feedback: string | null
          beneficiary_id: string
          beneficiary_rating: number | null
          created_at: string | null
          delivery_address: Json
          delivery_coordinates: Json | null
          delivery_fee: number | null
          donation_id: string
          driver_id: string | null
          driver_notes: string | null
          id: string
          organization_id: string
          payment_method: string | null
          payment_status: string | null
          pickup_address: Json
          pickup_coordinates: Json | null
          proof_of_delivery: Json | null
          scheduled_delivery_at: string | null
          scheduled_pickup_at: string | null
          status: Database["public"]["Enums"]["dona_delivery_status"] | null
          tracking_number: string | null
          tracking_updates: Json | null
          updated_at: string | null
        }
        Insert: {
          actual_delivery_at?: string | null
          actual_pickup_at?: string | null
          beneficiary_feedback?: string | null
          beneficiary_id: string
          beneficiary_rating?: number | null
          created_at?: string | null
          delivery_address: Json
          delivery_coordinates?: Json | null
          delivery_fee?: number | null
          donation_id: string
          driver_id?: string | null
          driver_notes?: string | null
          id?: string
          organization_id: string
          payment_method?: string | null
          payment_status?: string | null
          pickup_address: Json
          pickup_coordinates?: Json | null
          proof_of_delivery?: Json | null
          scheduled_delivery_at?: string | null
          scheduled_pickup_at?: string | null
          status?: Database["public"]["Enums"]["dona_delivery_status"] | null
          tracking_number?: string | null
          tracking_updates?: Json | null
          updated_at?: string | null
        }
        Update: {
          actual_delivery_at?: string | null
          actual_pickup_at?: string | null
          beneficiary_feedback?: string | null
          beneficiary_id?: string
          beneficiary_rating?: number | null
          created_at?: string | null
          delivery_address?: Json
          delivery_coordinates?: Json | null
          delivery_fee?: number | null
          donation_id?: string
          driver_id?: string | null
          driver_notes?: string | null
          id?: string
          organization_id?: string
          payment_method?: string | null
          payment_status?: string | null
          pickup_address?: Json
          pickup_coordinates?: Json | null
          proof_of_delivery?: Json | null
          scheduled_delivery_at?: string | null
          scheduled_pickup_at?: string | null
          status?: Database["public"]["Enums"]["dona_delivery_status"] | null
          tracking_number?: string | null
          tracking_updates?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dona_deliveries_beneficiary_id_fkey"
            columns: ["beneficiary_id"]
            isOneToOne: false
            referencedRelation: "dona_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dona_deliveries_donation_id_fkey"
            columns: ["donation_id"]
            isOneToOne: false
            referencedRelation: "dona_donations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dona_deliveries_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "dona_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dona_deliveries_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "dona_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      dona_donations: {
        Row: {
          availability_schedule: Json | null
          beneficiary_id: string | null
          category_id: string | null
          center_id: string | null
          claimed_at: string | null
          condition: string | null
          created_at: string | null
          delivered_at: string | null
          description: string
          donor_id: string
          id: string
          images: Json | null
          is_featured: boolean | null
          is_urgent: boolean | null
          metadata: Json | null
          organization_id: string
          pickup_address: Json | null
          pickup_coordinates: Json | null
          quantity: number | null
          status: Database["public"]["Enums"]["dona_donation_status"] | null
          tags: string[] | null
          title: string
          updated_at: string | null
          views_count: number | null
        }
        Insert: {
          availability_schedule?: Json | null
          beneficiary_id?: string | null
          category_id?: string | null
          center_id?: string | null
          claimed_at?: string | null
          condition?: string | null
          created_at?: string | null
          delivered_at?: string | null
          description: string
          donor_id: string
          id?: string
          images?: Json | null
          is_featured?: boolean | null
          is_urgent?: boolean | null
          metadata?: Json | null
          organization_id: string
          pickup_address?: Json | null
          pickup_coordinates?: Json | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["dona_donation_status"] | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          views_count?: number | null
        }
        Update: {
          availability_schedule?: Json | null
          beneficiary_id?: string | null
          category_id?: string | null
          center_id?: string | null
          claimed_at?: string | null
          condition?: string | null
          created_at?: string | null
          delivered_at?: string | null
          description?: string
          donor_id?: string
          id?: string
          images?: Json | null
          is_featured?: boolean | null
          is_urgent?: boolean | null
          metadata?: Json | null
          organization_id?: string
          pickup_address?: Json | null
          pickup_coordinates?: Json | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["dona_donation_status"] | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "dona_donations_beneficiary_id_fkey"
            columns: ["beneficiary_id"]
            isOneToOne: false
            referencedRelation: "dona_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dona_donations_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "dona_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dona_donations_center_id_fkey"
            columns: ["center_id"]
            isOneToOne: false
            referencedRelation: "dona_centers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dona_donations_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "dona_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dona_donations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "dona_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      dona_messages: {
        Row: {
          attachments: Json | null
          content: string
          conversation_id: string
          created_at: string | null
          edited_at: string | null
          id: string
          is_edited: boolean | null
          is_read: boolean | null
          read_at: string | null
          sender_id: string
        }
        Insert: {
          attachments?: Json | null
          content: string
          conversation_id: string
          created_at?: string | null
          edited_at?: string | null
          id?: string
          is_edited?: boolean | null
          is_read?: boolean | null
          read_at?: string | null
          sender_id: string
        }
        Update: {
          attachments?: Json | null
          content?: string
          conversation_id?: string
          created_at?: string | null
          edited_at?: string | null
          id?: string
          is_edited?: boolean | null
          is_read?: boolean | null
          read_at?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dona_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "dona_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dona_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "dona_users"
            referencedColumns: ["id"]
          },
        ]
      }
      dona_organizations: {
        Row: {
          address: Json | null
          created_at: string | null
          description: string | null
          email: string
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          phone: string | null
          settings: Json | null
          slug: string
          subscription_expires_at: string | null
          subscription_plan: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address?: Json | null
          created_at?: string | null
          description?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          phone?: string | null
          settings?: Json | null
          slug: string
          subscription_expires_at?: string | null
          subscription_plan?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: Json | null
          created_at?: string | null
          description?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          phone?: string | null
          settings?: Json | null
          slug?: string
          subscription_expires_at?: string | null
          subscription_plan?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      dona_users: {
        Row: {
          address: Json | null
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          last_login_at: string | null
          organization_id: string | null
          phone: string | null
          preferences: Json | null
          role: Database["public"]["Enums"]["dona_user_role"]
          updated_at: string | null
          verified_at: string | null
        }
        Insert: {
          address?: Json | null
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          last_login_at?: string | null
          organization_id?: string | null
          phone?: string | null
          preferences?: Json | null
          role?: Database["public"]["Enums"]["dona_user_role"]
          updated_at?: string | null
          verified_at?: string | null
        }
        Update: {
          address?: Json | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          last_login_at?: string | null
          organization_id?: string | null
          phone?: string | null
          preferences?: Json | null
          role?: Database["public"]["Enums"]["dona_user_role"]
          updated_at?: string | null
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dona_users_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "dona_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      essentia_chat_sessions: {
        Row: {
          created_at: string | null
          id: string
          messages: Json | null
          session_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          messages?: Json | null
          session_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          messages?: Json | null
          session_id?: string
        }
        Relationships: []
      }
      essentia_contacts: {
        Row: {
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          status?: string | null
        }
        Relationships: []
      }
      essentia_downloads: {
        Row: {
          created_at: string | null
          download_count: number | null
          file_type: string
          file_url: string
          id: string
          requires_contact: boolean | null
          title: string
        }
        Insert: {
          created_at?: string | null
          download_count?: number | null
          file_type: string
          file_url: string
          id?: string
          requires_contact?: boolean | null
          title: string
        }
        Update: {
          created_at?: string | null
          download_count?: number | null
          file_type?: string
          file_url?: string
          id?: string
          requires_contact?: boolean | null
          title?: string
        }
        Relationships: []
      }
      essentia_materials: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          name: string
          specifications: Json | null
          texture_url: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          specifications?: Json | null
          texture_url?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          specifications?: Json | null
          texture_url?: string | null
        }
        Relationships: []
      }
      essentia_zones: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          features: Json | null
          id: string
          images: string[] | null
          name: string
          position: Json | null
          slug: string
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          features?: Json | null
          id?: string
          images?: string[] | null
          name: string
          position?: Json | null
          slug: string
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          features?: Json | null
          id?: string
          images?: string[] | null
          name?: string
          position?: Json | null
          slug?: string
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      lacasita_accounts: {
        Row: {
          access_token: string | null
          createdAt: string | null
          expires_at: number | null
          id: string
          id_token: string | null
          provider: string
          providerAccountId: string
          refresh_token: string | null
          scope: string | null
          session_state: string | null
          token_type: string | null
          type: string
          updatedAt: string | null
          userId: string
        }
        Insert: {
          access_token?: string | null
          createdAt?: string | null
          expires_at?: number | null
          id: string
          id_token?: string | null
          provider: string
          providerAccountId: string
          refresh_token?: string | null
          scope?: string | null
          session_state?: string | null
          token_type?: string | null
          type: string
          updatedAt?: string | null
          userId: string
        }
        Update: {
          access_token?: string | null
          createdAt?: string | null
          expires_at?: number | null
          id?: string
          id_token?: string | null
          provider?: string
          providerAccountId?: string
          refresh_token?: string | null
          scope?: string | null
          session_state?: string | null
          token_type?: string | null
          type?: string
          updatedAt?: string | null
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "lacasita_accounts_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "lacasita_users"
            referencedColumns: ["id"]
          },
        ]
      }
      lacasita_contact_inquiries: {
        Row: {
          budgetRange: string | null
          company: string | null
          createdAt: string | null
          description: string | null
          email: string
          id: string
          investmentRange: string | null
          message: string | null
          name: string
          notes: string | null
          phone: string | null
          projectTitle: string | null
          projectType: string | null
          shootingDates: string | null
          source: string | null
          status: string | null
          type: string
          updatedAt: string | null
        }
        Insert: {
          budgetRange?: string | null
          company?: string | null
          createdAt?: string | null
          description?: string | null
          email: string
          id: string
          investmentRange?: string | null
          message?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          projectTitle?: string | null
          projectType?: string | null
          shootingDates?: string | null
          source?: string | null
          status?: string | null
          type: string
          updatedAt?: string | null
        }
        Update: {
          budgetRange?: string | null
          company?: string | null
          createdAt?: string | null
          description?: string | null
          email?: string
          id?: string
          investmentRange?: string | null
          message?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          projectTitle?: string | null
          projectType?: string | null
          shootingDates?: string | null
          source?: string | null
          status?: string | null
          type?: string
          updatedAt?: string | null
        }
        Relationships: []
      }
      lacasita_location_photos: {
        Row: {
          active: boolean
          aiCaption: string | null
          category: string
          createdAt: string
          description: string | null
          featured: boolean
          id: string
          imageUrl: string
          locationId: string | null
          order: number
          tags: string | null
          title: string
          updatedAt: string
        }
        Insert: {
          active?: boolean
          aiCaption?: string | null
          category: string
          createdAt?: string
          description?: string | null
          featured?: boolean
          id: string
          imageUrl: string
          locationId?: string | null
          order?: number
          tags?: string | null
          title: string
          updatedAt: string
        }
        Update: {
          active?: boolean
          aiCaption?: string | null
          category?: string
          createdAt?: string
          description?: string | null
          featured?: boolean
          id?: string
          imageUrl?: string
          locationId?: string | null
          order?: number
          tags?: string | null
          title?: string
          updatedAt?: string
        }
        Relationships: []
      }
      lacasita_locations: {
        Row: {
          active: boolean | null
          category: string
          coordinates: string | null
          createdAt: string | null
          description: string
          featured: boolean | null
          features: string
          id: string
          images: string
          name: string
          permits: string | null
          slug: string
          updatedAt: string | null
        }
        Insert: {
          active?: boolean | null
          category: string
          coordinates?: string | null
          createdAt?: string | null
          description: string
          featured?: boolean | null
          features: string
          id: string
          images: string
          name: string
          permits?: string | null
          slug: string
          updatedAt?: string | null
        }
        Update: {
          active?: boolean | null
          category?: string
          coordinates?: string | null
          createdAt?: string | null
          description?: string
          featured?: boolean | null
          features?: string
          id?: string
          images?: string
          name?: string
          permits?: string | null
          slug?: string
          updatedAt?: string | null
        }
        Relationships: []
      }
      lacasita_news_articles: {
        Row: {
          active: boolean
          aiGenerated: boolean
          aiPrompt: string | null
          author: string | null
          category: string
          content: string | null
          createdAt: string
          featured: boolean
          id: string
          imageUrl: string | null
          publishedAt: string
          slug: string
          source: string
          sourceUrl: string | null
          summary: string
          tags: string | null
          title: string
          updatedAt: string
        }
        Insert: {
          active?: boolean
          aiGenerated?: boolean
          aiPrompt?: string | null
          author?: string | null
          category: string
          content?: string | null
          createdAt?: string
          featured?: boolean
          id: string
          imageUrl?: string | null
          publishedAt: string
          slug: string
          source: string
          sourceUrl?: string | null
          summary: string
          tags?: string | null
          title: string
          updatedAt: string
        }
        Update: {
          active?: boolean
          aiGenerated?: boolean
          aiPrompt?: string | null
          author?: string | null
          category?: string
          content?: string | null
          createdAt?: string
          featured?: boolean
          id?: string
          imageUrl?: string | null
          publishedAt?: string
          slug?: string
          source?: string
          sourceUrl?: string | null
          summary?: string
          tags?: string | null
          title?: string
          updatedAt?: string
        }
        Relationships: []
      }
      lacasita_proyectos: {
        Row: {
          activo: boolean | null
          año: number
          budgetRequired: number | null
          clientTestimonial: string | null
          createdAt: string | null
          derechos: string | null
          destacado: boolean | null
          director: string
          documentoEmbed: string | null
          documentoTitulo: string | null
          documentoUrl: string | null
          duracion: string | null
          elenco: string
          estado: string | null
          expectedTimeline: string | null
          fechaPublicacion: string | null
          formato: string | null
          fotografia: string | null
          fundingSecured: number | null
          genero: string
          guion: string | null
          id: string
          idiomas: string | null
          investmentStatus: string | null
          investmentTerms: string | null
          marketPotential: string | null
          musica: string | null
          notasPrivadas: string | null
          ourRole: string | null
          posterUrl: string | null
          premios: string | null
          servicesProvided: string | null
          sinopsis: string
          slug: string
          subtitulos: string | null
          titulo: string
          trailerUrl: string | null
          updatedAt: string | null
        }
        Insert: {
          activo?: boolean | null
          año: number
          budgetRequired?: number | null
          clientTestimonial?: string | null
          createdAt?: string | null
          derechos?: string | null
          destacado?: boolean | null
          director: string
          documentoEmbed?: string | null
          documentoTitulo?: string | null
          documentoUrl?: string | null
          duracion?: string | null
          elenco: string
          estado?: string | null
          expectedTimeline?: string | null
          fechaPublicacion?: string | null
          formato?: string | null
          fotografia?: string | null
          fundingSecured?: number | null
          genero: string
          guion?: string | null
          id: string
          idiomas?: string | null
          investmentStatus?: string | null
          investmentTerms?: string | null
          marketPotential?: string | null
          musica?: string | null
          notasPrivadas?: string | null
          ourRole?: string | null
          posterUrl?: string | null
          premios?: string | null
          servicesProvided?: string | null
          sinopsis: string
          slug: string
          subtitulos?: string | null
          titulo: string
          trailerUrl?: string | null
          updatedAt?: string | null
        }
        Update: {
          activo?: boolean | null
          año?: number
          budgetRequired?: number | null
          clientTestimonial?: string | null
          createdAt?: string | null
          derechos?: string | null
          destacado?: boolean | null
          director?: string
          documentoEmbed?: string | null
          documentoTitulo?: string | null
          documentoUrl?: string | null
          duracion?: string | null
          elenco?: string
          estado?: string | null
          expectedTimeline?: string | null
          fechaPublicacion?: string | null
          formato?: string | null
          fotografia?: string | null
          fundingSecured?: number | null
          genero?: string
          guion?: string | null
          id?: string
          idiomas?: string | null
          investmentStatus?: string | null
          investmentTerms?: string | null
          marketPotential?: string | null
          musica?: string | null
          notasPrivadas?: string | null
          ourRole?: string | null
          posterUrl?: string | null
          premios?: string | null
          servicesProvided?: string | null
          sinopsis?: string
          slug?: string
          subtitulos?: string | null
          titulo?: string
          trailerUrl?: string | null
          updatedAt?: string | null
        }
        Relationships: []
      }
      lacasita_services: {
        Row: {
          active: boolean | null
          category: string
          createdAt: string | null
          description: string
          features: string
          icon: string | null
          id: string
          name: string
          order: number | null
          pricing: string | null
          slug: string
          updatedAt: string | null
        }
        Insert: {
          active?: boolean | null
          category: string
          createdAt?: string | null
          description: string
          features: string
          icon?: string | null
          id: string
          name: string
          order?: number | null
          pricing?: string | null
          slug: string
          updatedAt?: string | null
        }
        Update: {
          active?: boolean | null
          category?: string
          createdAt?: string | null
          description?: string
          features?: string
          icon?: string | null
          id?: string
          name?: string
          order?: number | null
          pricing?: string | null
          slug?: string
          updatedAt?: string | null
        }
        Relationships: []
      }
      lacasita_sessions: {
        Row: {
          createdAt: string | null
          expires: string
          id: string
          sessionToken: string
          updatedAt: string | null
          userId: string
        }
        Insert: {
          createdAt?: string | null
          expires: string
          id: string
          sessionToken: string
          updatedAt?: string | null
          userId: string
        }
        Update: {
          createdAt?: string | null
          expires?: string
          id?: string
          sessionToken?: string
          updatedAt?: string | null
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "lacasita_sessions_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "lacasita_users"
            referencedColumns: ["id"]
          },
        ]
      }
      lacasita_team_members: {
        Row: {
          active: boolean | null
          bio: string
          createdAt: string | null
          credits: string
          email: string | null
          featured: boolean | null
          id: string
          imdb: string | null
          linkedin: string | null
          name: string
          order: number | null
          photoUrl: string | null
          role: string
          slug: string
          updatedAt: string | null
          website: string | null
        }
        Insert: {
          active?: boolean | null
          bio: string
          createdAt?: string | null
          credits: string
          email?: string | null
          featured?: boolean | null
          id: string
          imdb?: string | null
          linkedin?: string | null
          name: string
          order?: number | null
          photoUrl?: string | null
          role: string
          slug: string
          updatedAt?: string | null
          website?: string | null
        }
        Update: {
          active?: boolean | null
          bio?: string
          createdAt?: string | null
          credits?: string
          email?: string | null
          featured?: boolean | null
          id?: string
          imdb?: string | null
          linkedin?: string | null
          name?: string
          order?: number | null
          photoUrl?: string | null
          role?: string
          slug?: string
          updatedAt?: string | null
          website?: string | null
        }
        Relationships: []
      }
      lacasita_users: {
        Row: {
          createdAt: string | null
          email: string
          emailVerified: string | null
          id: string
          image: string | null
          name: string | null
          updatedAt: string | null
        }
        Insert: {
          createdAt?: string | null
          email: string
          emailVerified?: string | null
          id: string
          image?: string | null
          name?: string | null
          updatedAt?: string | null
        }
        Update: {
          createdAt?: string | null
          email?: string
          emailVerified?: string | null
          id?: string
          image?: string | null
          name?: string | null
          updatedAt?: string | null
        }
        Relationships: []
      }
      lacasita_verification_tokens: {
        Row: {
          expires: string
          identifier: string
          token: string
        }
        Insert: {
          expires: string
          identifier: string
          token: string
        }
        Update: {
          expires?: string
          identifier?: string
          token?: string
        }
        Relationships: []
      }
      matches: {
        Row: {
          court_id: string | null
          created_at: string | null
          duration_minutes: number | null
          ends_at: string | null
          id: string
          match_number: number | null
          metadata: Json | null
          round: number | null
          score: Json | null
          starts_at: string | null
          status: string | null
          team_a_id: string | null
          team_b_id: string | null
          tournament_id: string | null
          updated_at: string | null
          winner_id: string | null
        }
        Insert: {
          court_id?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          ends_at?: string | null
          id?: string
          match_number?: number | null
          metadata?: Json | null
          round?: number | null
          score?: Json | null
          starts_at?: string | null
          status?: string | null
          team_a_id?: string | null
          team_b_id?: string | null
          tournament_id?: string | null
          updated_at?: string | null
          winner_id?: string | null
        }
        Update: {
          court_id?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          ends_at?: string | null
          id?: string
          match_number?: number | null
          metadata?: Json | null
          round?: number | null
          score?: Json | null
          starts_at?: string | null
          status?: string | null
          team_a_id?: string | null
          team_b_id?: string | null
          tournament_id?: string | null
          updated_at?: string | null
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_court_id_fkey"
            columns: ["court_id"]
            isOneToOne: false
            referencedRelation: "courts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          link: string | null
          read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          link?: string | null
          read?: boolean | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          link?: string | null
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      padelia_bookings: {
        Row: {
          court_id: string | null
          created_at: string | null
          ends_at: string
          id: string
          notes: string | null
          price: number | null
          starts_at: string
          status: string | null
          updated_at: string | null
          user_email: string | null
          user_name: string
          user_phone: string | null
        }
        Insert: {
          court_id?: string | null
          created_at?: string | null
          ends_at: string
          id?: string
          notes?: string | null
          price?: number | null
          starts_at: string
          status?: string | null
          updated_at?: string | null
          user_email?: string | null
          user_name: string
          user_phone?: string | null
        }
        Update: {
          court_id?: string | null
          created_at?: string | null
          ends_at?: string
          id?: string
          notes?: string | null
          price?: number | null
          starts_at?: string
          status?: string | null
          updated_at?: string | null
          user_email?: string | null
          user_name?: string
          user_phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "padelia_bookings_court_id_fkey"
            columns: ["court_id"]
            isOneToOne: false
            referencedRelation: "padelia_courts"
            referencedColumns: ["id"]
          },
        ]
      }
      padelia_clubs: {
        Row: {
          active: boolean | null
          address: string | null
          city: string | null
          country: string | null
          created_at: string | null
          description: string | null
          email: string | null
          id: string
          logo_url: string | null
          name: string
          phone: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          active?: boolean | null
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          logo_url?: string | null
          name: string
          phone?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          active?: boolean | null
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          phone?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      padelia_courts: {
        Row: {
          active: boolean | null
          club_id: string | null
          covered: boolean | null
          created_at: string | null
          id: string
          lighting: boolean | null
          name: string
          surface: string | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          club_id?: string | null
          covered?: boolean | null
          created_at?: string | null
          id?: string
          lighting?: boolean | null
          name: string
          surface?: string | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          club_id?: string | null
          covered?: boolean | null
          created_at?: string | null
          id?: string
          lighting?: boolean | null
          name?: string
          surface?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "padelia_courts_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "padelia_clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      padelia_matches: {
        Row: {
          court_id: string | null
          created_at: string | null
          duration_minutes: number | null
          ends_at: string | null
          id: string
          match_number: number | null
          metadata: Json | null
          round: number | null
          score: Json | null
          starts_at: string | null
          status: string | null
          team_a_id: string | null
          team_b_id: string | null
          tournament_id: string | null
          updated_at: string | null
          winner_id: string | null
        }
        Insert: {
          court_id?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          ends_at?: string | null
          id?: string
          match_number?: number | null
          metadata?: Json | null
          round?: number | null
          score?: Json | null
          starts_at?: string | null
          status?: string | null
          team_a_id?: string | null
          team_b_id?: string | null
          tournament_id?: string | null
          updated_at?: string | null
          winner_id?: string | null
        }
        Update: {
          court_id?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          ends_at?: string | null
          id?: string
          match_number?: number | null
          metadata?: Json | null
          round?: number | null
          score?: Json | null
          starts_at?: string | null
          status?: string | null
          team_a_id?: string | null
          team_b_id?: string | null
          tournament_id?: string | null
          updated_at?: string | null
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "padelia_matches_court_id_fkey"
            columns: ["court_id"]
            isOneToOne: false
            referencedRelation: "padelia_courts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "padelia_matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "padelia_teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "padelia_matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "padelia_teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "padelia_matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "padelia_tournaments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "padelia_matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "padelia_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      padelia_notifications: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          message: string
          read: boolean | null
          title: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          message: string
          read?: boolean | null
          title: string
          type?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      padelia_player_ratings: {
        Row: {
          club_id: string | null
          created_at: string | null
          games_played: number | null
          id: string
          last_match_date: string | null
          losses: number | null
          player_email: string | null
          player_name: string
          rating: number | null
          updated_at: string | null
          wins: number | null
        }
        Insert: {
          club_id?: string | null
          created_at?: string | null
          games_played?: number | null
          id?: string
          last_match_date?: string | null
          losses?: number | null
          player_email?: string | null
          player_name: string
          rating?: number | null
          updated_at?: string | null
          wins?: number | null
        }
        Update: {
          club_id?: string | null
          created_at?: string | null
          games_played?: number | null
          id?: string
          last_match_date?: string | null
          losses?: number | null
          player_email?: string | null
          player_name?: string
          rating?: number | null
          updated_at?: string | null
          wins?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "padelia_player_ratings_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "padelia_clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      padelia_player_stats: {
        Row: {
          games_lost: number | null
          games_won: number | null
          id: string
          matches_lost: number | null
          matches_won: number | null
          player_key: string
          points: number | null
          tournament_id: string | null
          updated_at: string | null
        }
        Insert: {
          games_lost?: number | null
          games_won?: number | null
          id?: string
          matches_lost?: number | null
          matches_won?: number | null
          player_key: string
          points?: number | null
          tournament_id?: string | null
          updated_at?: string | null
        }
        Update: {
          games_lost?: number | null
          games_won?: number | null
          id?: string
          matches_lost?: number | null
          matches_won?: number | null
          player_key?: string
          points?: number | null
          tournament_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "padelia_player_stats_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "padelia_tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      padelia_rating_history: {
        Row: {
          created_at: string | null
          id: string
          match_id: string | null
          new_rating: number | null
          old_rating: number | null
          opponent_rating: number | null
          player_rating_id: string | null
          rating_change: number | null
          result: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          match_id?: string | null
          new_rating?: number | null
          old_rating?: number | null
          opponent_rating?: number | null
          player_rating_id?: string | null
          rating_change?: number | null
          result?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          match_id?: string | null
          new_rating?: number | null
          old_rating?: number | null
          opponent_rating?: number | null
          player_rating_id?: string | null
          rating_change?: number | null
          result?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "padelia_rating_history_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "padelia_matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "padelia_rating_history_player_rating_id_fkey"
            columns: ["player_rating_id"]
            isOneToOne: false
            referencedRelation: "padelia_player_ratings"
            referencedColumns: ["id"]
          },
        ]
      }
      padelia_teams: {
        Row: {
          created_at: string | null
          id: string
          name: string
          player1_email: string | null
          player1_name: string | null
          player1_phone: string | null
          player2_email: string | null
          player2_name: string | null
          player2_phone: string | null
          seed: number | null
          tournament_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          player1_email?: string | null
          player1_name?: string | null
          player1_phone?: string | null
          player2_email?: string | null
          player2_name?: string | null
          player2_phone?: string | null
          seed?: number | null
          tournament_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          player1_email?: string | null
          player1_name?: string | null
          player1_phone?: string | null
          player2_email?: string | null
          player2_name?: string | null
          player2_phone?: string | null
          seed?: number | null
          tournament_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "padelia_teams_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "padelia_tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      padelia_tournament_players: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          player_key: string
          team_id: string | null
          tournament_id: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          player_key: string
          team_id?: string | null
          tournament_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          player_key?: string
          team_id?: string | null
          tournament_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "padelia_tournament_players_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "padelia_teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "padelia_tournament_players_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "padelia_tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      padelia_tournaments: {
        Row: {
          club_id: string | null
          created_at: string | null
          description: string | null
          ends_at: string | null
          entry_fee: number | null
          format: string | null
          id: string
          max_teams: number | null
          min_teams: number | null
          name: string
          registration_deadline: string | null
          settings: Json | null
          starts_at: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          club_id?: string | null
          created_at?: string | null
          description?: string | null
          ends_at?: string | null
          entry_fee?: number | null
          format?: string | null
          id?: string
          max_teams?: number | null
          min_teams?: number | null
          name: string
          registration_deadline?: string | null
          settings?: Json | null
          starts_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          club_id?: string | null
          created_at?: string | null
          description?: string | null
          ends_at?: string | null
          entry_fee?: number | null
          format?: string | null
          id?: string
          max_teams?: number | null
          min_teams?: number | null
          name?: string
          registration_deadline?: string | null
          settings?: Json | null
          starts_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "padelia_tournaments_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "padelia_clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      padelia_user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          date_of_birth: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      player_ratings: {
        Row: {
          club_id: string | null
          created_at: string | null
          games_played: number | null
          id: string
          last_match_date: string | null
          losses: number | null
          player_email: string | null
          player_name: string
          rating: number | null
          updated_at: string | null
          wins: number | null
        }
        Insert: {
          club_id?: string | null
          created_at?: string | null
          games_played?: number | null
          id?: string
          last_match_date?: string | null
          losses?: number | null
          player_email?: string | null
          player_name: string
          rating?: number | null
          updated_at?: string | null
          wins?: number | null
        }
        Update: {
          club_id?: string | null
          created_at?: string | null
          games_played?: number | null
          id?: string
          last_match_date?: string | null
          losses?: number | null
          player_email?: string | null
          player_name?: string
          rating?: number | null
          updated_at?: string | null
          wins?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "player_ratings_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          comment_count: number | null
          community_id: string
          content: string
          created_at: string | null
          id: string
          like_count: number | null
          locked: boolean | null
          pinned: boolean | null
          title: string
          updated_at: string | null
          user_id: string
          view_count: number | null
        }
        Insert: {
          comment_count?: number | null
          community_id: string
          content: string
          created_at?: string | null
          id?: string
          like_count?: number | null
          locked?: boolean | null
          pinned?: boolean | null
          title: string
          updated_at?: string | null
          user_id: string
          view_count?: number | null
        }
        Update: {
          comment_count?: number | null
          community_id?: string
          content?: string
          created_at?: string | null
          id?: string
          like_count?: number | null
          locked?: boolean | null
          pinned?: boolean | null
          title?: string
          updated_at?: string | null
          user_id?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          email: string
          id: string
          is_premium_creator: boolean | null
          name: string | null
          preferred_lang: string | null
          public_profile_slug: string | null
          role: string
          role_scope: Json | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email: string
          id: string
          is_premium_creator?: boolean | null
          name?: string | null
          preferred_lang?: string | null
          public_profile_slug?: string | null
          role?: string
          role_scope?: Json | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string
          id?: string
          is_premium_creator?: boolean | null
          name?: string | null
          preferred_lang?: string | null
          public_profile_slug?: string | null
          role?: string
          role_scope?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          backers_count: number | null
          category: string | null
          created_at: string | null
          creator_id: string
          currency: string | null
          current_amount: number | null
          deadline: string
          description: string
          featured: boolean | null
          funded_at: string | null
          goal_amount: number
          id: string
          launched_at: string | null
          status: string
          subtitle: string | null
          title: string
          updated_at: string | null
          video_id: string | null
        }
        Insert: {
          backers_count?: number | null
          category?: string | null
          created_at?: string | null
          creator_id: string
          currency?: string | null
          current_amount?: number | null
          deadline: string
          description: string
          featured?: boolean | null
          funded_at?: string | null
          goal_amount: number
          id?: string
          launched_at?: string | null
          status?: string
          subtitle?: string | null
          title: string
          updated_at?: string | null
          video_id?: string | null
        }
        Update: {
          backers_count?: number | null
          category?: string | null
          created_at?: string | null
          creator_id?: string
          currency?: string | null
          current_amount?: number | null
          deadline?: string
          description?: string
          featured?: boolean | null
          funded_at?: string | null
          goal_amount?: number
          id?: string
          launched_at?: string | null
          status?: string
          subtitle?: string | null
          title?: string
          updated_at?: string | null
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      promptsmith_analytics: {
        Row: {
          created_at: string | null
          domain: Database["public"]["Enums"]["promptsmith_domain"] | null
          event_type: string
          id: string
          input_length: number | null
          metadata: Json | null
          output_length: number | null
          processing_time: number | null
          prompt_id: string | null
          quality_improvement: number | null
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          domain?: Database["public"]["Enums"]["promptsmith_domain"] | null
          event_type: string
          id?: string
          input_length?: number | null
          metadata?: Json | null
          output_length?: number | null
          processing_time?: number | null
          prompt_id?: string | null
          quality_improvement?: number | null
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          domain?: Database["public"]["Enums"]["promptsmith_domain"] | null
          event_type?: string
          id?: string
          input_length?: number | null
          metadata?: Json | null
          output_length?: number | null
          processing_time?: number | null
          prompt_id?: string | null
          quality_improvement?: number | null
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "promptsmith_analytics_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "promptsmith_prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      promptsmith_custom_rules: {
        Row: {
          active: boolean | null
          category: Database["public"]["Enums"]["promptsmith_rule_category"]
          created_at: string | null
          description: string | null
          domain: Database["public"]["Enums"]["promptsmith_domain"]
          examples: Json | null
          id: string
          name: string
          pattern: string
          priority: number | null
          replacement: string
          success_rate: number | null
          updated_at: string | null
          usage_count: number | null
          user_id: string
        }
        Insert: {
          active?: boolean | null
          category: Database["public"]["Enums"]["promptsmith_rule_category"]
          created_at?: string | null
          description?: string | null
          domain: Database["public"]["Enums"]["promptsmith_domain"]
          examples?: Json | null
          id?: string
          name: string
          pattern: string
          priority?: number | null
          replacement: string
          success_rate?: number | null
          updated_at?: string | null
          usage_count?: number | null
          user_id: string
        }
        Update: {
          active?: boolean | null
          category?: Database["public"]["Enums"]["promptsmith_rule_category"]
          created_at?: string | null
          description?: string | null
          domain?: Database["public"]["Enums"]["promptsmith_domain"]
          examples?: Json | null
          id?: string
          name?: string
          pattern?: string
          priority?: number | null
          replacement?: string
          success_rate?: number | null
          updated_at?: string | null
          usage_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      promptsmith_prompt_evaluations: {
        Row: {
          created_at: string | null
          evaluation_context: Json | null
          id: string
          max_tokens: number | null
          model: string
          processing_time_ms: number | null
          prompt_id: string
          response_quality: Json | null
          temperature: number | null
          token_usage: Json | null
        }
        Insert: {
          created_at?: string | null
          evaluation_context?: Json | null
          id?: string
          max_tokens?: number | null
          model?: string
          processing_time_ms?: number | null
          prompt_id: string
          response_quality?: Json | null
          temperature?: number | null
          token_usage?: Json | null
        }
        Update: {
          created_at?: string | null
          evaluation_context?: Json | null
          id?: string
          max_tokens?: number | null
          model?: string
          processing_time_ms?: number | null
          prompt_id?: string
          response_quality?: Json | null
          temperature?: number | null
          token_usage?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "promptsmith_prompt_evaluations_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "promptsmith_prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      promptsmith_prompts: {
        Row: {
          author_id: string | null
          avg_response_time: number | null
          category: string | null
          created_at: string | null
          description: string | null
          domain: Database["public"]["Enums"]["promptsmith_domain"]
          id: string
          is_public: boolean | null
          last_used_at: string | null
          name: string | null
          parent_id: string | null
          quality_score: Json | null
          raw_prompt: string
          refined_prompt: string
          success_rate: number | null
          system_prompt: string | null
          tags: string[] | null
          template_type:
            | Database["public"]["Enums"]["promptsmith_template_type"]
            | null
          template_variables: Json | null
          updated_at: string | null
          usage_count: number | null
          version: number | null
        }
        Insert: {
          author_id?: string | null
          avg_response_time?: number | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          domain?: Database["public"]["Enums"]["promptsmith_domain"]
          id?: string
          is_public?: boolean | null
          last_used_at?: string | null
          name?: string | null
          parent_id?: string | null
          quality_score?: Json | null
          raw_prompt: string
          refined_prompt: string
          success_rate?: number | null
          system_prompt?: string | null
          tags?: string[] | null
          template_type?:
            | Database["public"]["Enums"]["promptsmith_template_type"]
            | null
          template_variables?: Json | null
          updated_at?: string | null
          usage_count?: number | null
          version?: number | null
        }
        Update: {
          author_id?: string | null
          avg_response_time?: number | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          domain?: Database["public"]["Enums"]["promptsmith_domain"]
          id?: string
          is_public?: boolean | null
          last_used_at?: string | null
          name?: string | null
          parent_id?: string | null
          quality_score?: Json | null
          raw_prompt?: string
          refined_prompt?: string
          success_rate?: number | null
          system_prompt?: string | null
          tags?: string[] | null
          template_type?:
            | Database["public"]["Enums"]["promptsmith_template_type"]
            | null
          template_variables?: Json | null
          updated_at?: string | null
          usage_count?: number | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "promptsmith_prompts_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "promptsmith_prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      promptsmith_templates: {
        Row: {
          author_id: string | null
          average_score: number | null
          created_at: string | null
          description: string | null
          domain: Database["public"]["Enums"]["promptsmith_domain"]
          id: string
          is_public: boolean | null
          name: string
          system_prompt: string | null
          tags: string[] | null
          template_content: string
          template_type: Database["public"]["Enums"]["promptsmith_template_type"]
          updated_at: string | null
          usage_count: number | null
          variables: Json | null
        }
        Insert: {
          author_id?: string | null
          average_score?: number | null
          created_at?: string | null
          description?: string | null
          domain: Database["public"]["Enums"]["promptsmith_domain"]
          id?: string
          is_public?: boolean | null
          name: string
          system_prompt?: string | null
          tags?: string[] | null
          template_content: string
          template_type: Database["public"]["Enums"]["promptsmith_template_type"]
          updated_at?: string | null
          usage_count?: number | null
          variables?: Json | null
        }
        Update: {
          author_id?: string | null
          average_score?: number | null
          created_at?: string | null
          description?: string | null
          domain?: Database["public"]["Enums"]["promptsmith_domain"]
          id?: string
          is_public?: boolean | null
          name?: string
          system_prompt?: string | null
          tags?: string[] | null
          template_content?: string
          template_type?: Database["public"]["Enums"]["promptsmith_template_type"]
          updated_at?: string | null
          usage_count?: number | null
          variables?: Json | null
        }
        Relationships: []
      }
      Proyecto: {
        Row: {
          activo: boolean | null
          año: number
          createdAt: string
          derechos: string | null
          destacado: boolean | null
          director: string
          documentoEmbed: string | null
          documentoTitulo: string | null
          documentoUrl: string | null
          duracion: string | null
          elenco: string
          estado: string
          fechaPublicacion: string | null
          formato: string | null
          fotografia: string | null
          genero: string
          guion: string | null
          id: string
          idiomas: string | null
          musica: string | null
          notasPrivadas: string | null
          posterUrl: string | null
          premios: string | null
          sinopsis: string
          slug: string
          subtitulos: string | null
          titulo: string
          trailerUrl: string | null
          updatedAt: string
        }
        Insert: {
          activo?: boolean | null
          año: number
          createdAt?: string
          derechos?: string | null
          destacado?: boolean | null
          director: string
          documentoEmbed?: string | null
          documentoTitulo?: string | null
          documentoUrl?: string | null
          duracion?: string | null
          elenco: string
          estado?: string
          fechaPublicacion?: string | null
          formato?: string | null
          fotografia?: string | null
          genero: string
          guion?: string | null
          id?: string
          idiomas?: string | null
          musica?: string | null
          notasPrivadas?: string | null
          posterUrl?: string | null
          premios?: string | null
          sinopsis: string
          slug: string
          subtitulos?: string | null
          titulo: string
          trailerUrl?: string | null
          updatedAt?: string
        }
        Update: {
          activo?: boolean | null
          año?: number
          createdAt?: string
          derechos?: string | null
          destacado?: boolean | null
          director?: string
          documentoEmbed?: string | null
          documentoTitulo?: string | null
          documentoUrl?: string | null
          duracion?: string | null
          elenco?: string
          estado?: string
          fechaPublicacion?: string | null
          formato?: string | null
          fotografia?: string | null
          genero?: string
          guion?: string | null
          id?: string
          idiomas?: string | null
          musica?: string | null
          notasPrivadas?: string | null
          posterUrl?: string | null
          premios?: string | null
          sinopsis?: string
          slug?: string
          subtitulos?: string | null
          titulo?: string
          trailerUrl?: string | null
          updatedAt?: string
        }
        Relationships: []
      }
      rating_history: {
        Row: {
          created_at: string | null
          id: string
          match_id: string | null
          new_rating: number | null
          old_rating: number | null
          opponent_rating: number | null
          player_rating_id: string | null
          rating_change: number | null
          result: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          match_id?: string | null
          new_rating?: number | null
          old_rating?: number | null
          opponent_rating?: number | null
          player_rating_id?: string | null
          rating_change?: number | null
          result?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          match_id?: string | null
          new_rating?: number | null
          old_rating?: number | null
          opponent_rating?: number | null
          player_rating_id?: string | null
          rating_change?: number | null
          result?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rating_history_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rating_history_player_rating_id_fkey"
            columns: ["player_rating_id"]
            isOneToOne: false
            referencedRelation: "player_ratings"
            referencedColumns: ["id"]
          },
        ]
      }
      reeldoctor_audio_analysis: {
        Row: {
          audio_intensity_curve: Json | null
          audio_type: string | null
          beat_sync_detected: boolean | null
          created_at: string | null
          id: string
          music_genre: string | null
          reel_id: string
        }
        Insert: {
          audio_intensity_curve?: Json | null
          audio_type?: string | null
          beat_sync_detected?: boolean | null
          created_at?: string | null
          id?: string
          music_genre?: string | null
          reel_id: string
        }
        Update: {
          audio_intensity_curve?: Json | null
          audio_type?: string | null
          beat_sync_detected?: boolean | null
          created_at?: string | null
          id?: string
          music_genre?: string | null
          reel_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reeldoctor_audio_analysis_reel_id_fkey"
            columns: ["reel_id"]
            isOneToOne: false
            referencedRelation: "reeldoctor_reels"
            referencedColumns: ["id"]
          },
        ]
      }
      reeldoctor_jobs: {
        Row: {
          completed_at: string | null
          created_at: string | null
          error_message: string | null
          id: string
          job_type: string
          reel_id: string
          started_at: string | null
          status: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          job_type: string
          reel_id: string
          started_at?: string | null
          status?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          job_type?: string
          reel_id?: string
          started_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reeldoctor_jobs_reel_id_fkey"
            columns: ["reel_id"]
            isOneToOne: false
            referencedRelation: "reeldoctor_reels"
            referencedColumns: ["id"]
          },
        ]
      }
      reeldoctor_patterns: {
        Row: {
          avg_engagement_rate: number | null
          confidence_score: number | null
          created_at: string | null
          id: string
          pattern_details: Json | null
          pattern_name: string
          pattern_type: string
          sample_size: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avg_engagement_rate?: number | null
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          pattern_details?: Json | null
          pattern_name: string
          pattern_type: string
          sample_size?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avg_engagement_rate?: number | null
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          pattern_details?: Json | null
          pattern_name?: string
          pattern_type?: string
          sample_size?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reeldoctor_patterns_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "reeldoctor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reeldoctor_profiles: {
        Row: {
          analysis_credits: number | null
          created_at: string | null
          id: string
          instagram_user_id: string | null
          instagram_username: string | null
          subscription_tier: string | null
          updated_at: string | null
        }
        Insert: {
          analysis_credits?: number | null
          created_at?: string | null
          id: string
          instagram_user_id?: string | null
          instagram_username?: string | null
          subscription_tier?: string | null
          updated_at?: string | null
        }
        Update: {
          analysis_credits?: number | null
          created_at?: string | null
          id?: string
          instagram_user_id?: string | null
          instagram_username?: string | null
          subscription_tier?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reeldoctor_recommendations: {
        Row: {
          based_on_pattern_id: string | null
          created_at: string | null
          description: string
          expected_impact: string | null
          id: string
          priority: string | null
          recommendation_type: string
          reel_id: string
          title: string
          user_applied: boolean | null
          user_id: string
          user_rating: number | null
        }
        Insert: {
          based_on_pattern_id?: string | null
          created_at?: string | null
          description: string
          expected_impact?: string | null
          id?: string
          priority?: string | null
          recommendation_type: string
          reel_id: string
          title: string
          user_applied?: boolean | null
          user_id: string
          user_rating?: number | null
        }
        Update: {
          based_on_pattern_id?: string | null
          created_at?: string | null
          description?: string
          expected_impact?: string | null
          id?: string
          priority?: string | null
          recommendation_type?: string
          reel_id?: string
          title?: string
          user_applied?: boolean | null
          user_id?: string
          user_rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reeldoctor_recommendations_based_on_pattern_id_fkey"
            columns: ["based_on_pattern_id"]
            isOneToOne: false
            referencedRelation: "reeldoctor_patterns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reeldoctor_recommendations_reel_id_fkey"
            columns: ["reel_id"]
            isOneToOne: false
            referencedRelation: "reeldoctor_reels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reeldoctor_recommendations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "reeldoctor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reeldoctor_reels: {
        Row: {
          comments: number | null
          created_at: string | null
          duration_seconds: number | null
          engagement_rate: number | null
          id: string
          instagram_url: string | null
          likes: number | null
          processed_at: string | null
          resolution: string | null
          saves: number | null
          shares: number | null
          status: string | null
          thumbnail_path: string | null
          updated_at: string | null
          upload_date: string | null
          user_id: string
          video_file_path: string
          views: number | null
        }
        Insert: {
          comments?: number | null
          created_at?: string | null
          duration_seconds?: number | null
          engagement_rate?: number | null
          id?: string
          instagram_url?: string | null
          likes?: number | null
          processed_at?: string | null
          resolution?: string | null
          saves?: number | null
          shares?: number | null
          status?: string | null
          thumbnail_path?: string | null
          updated_at?: string | null
          upload_date?: string | null
          user_id: string
          video_file_path: string
          views?: number | null
        }
        Update: {
          comments?: number | null
          created_at?: string | null
          duration_seconds?: number | null
          engagement_rate?: number | null
          id?: string
          instagram_url?: string | null
          likes?: number | null
          processed_at?: string | null
          resolution?: string | null
          saves?: number | null
          shares?: number | null
          status?: string | null
          thumbnail_path?: string | null
          updated_at?: string | null
          upload_date?: string | null
          user_id?: string
          video_file_path?: string
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reeldoctor_reels_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "reeldoctor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reeldoctor_visual_analysis: {
        Row: {
          avg_faces_per_frame: number | null
          avg_scene_duration: number | null
          color_palette_name: string | null
          created_at: string | null
          dominant_colors: Json | null
          face_emotion_distribution: Json | null
          frames_with_faces: number | null
          hook_score: number | null
          id: string
          motion_intensity: string | null
          objects_detected: Json | null
          reel_id: string
          scene_count: number | null
          text_content: string[] | null
          text_detected: boolean | null
          total_frames: number
          transition_types: Json | null
        }
        Insert: {
          avg_faces_per_frame?: number | null
          avg_scene_duration?: number | null
          color_palette_name?: string | null
          created_at?: string | null
          dominant_colors?: Json | null
          face_emotion_distribution?: Json | null
          frames_with_faces?: number | null
          hook_score?: number | null
          id?: string
          motion_intensity?: string | null
          objects_detected?: Json | null
          reel_id: string
          scene_count?: number | null
          text_content?: string[] | null
          text_detected?: boolean | null
          total_frames: number
          transition_types?: Json | null
        }
        Update: {
          avg_faces_per_frame?: number | null
          avg_scene_duration?: number | null
          color_palette_name?: string | null
          created_at?: string | null
          dominant_colors?: Json | null
          face_emotion_distribution?: Json | null
          frames_with_faces?: number | null
          hook_score?: number | null
          id?: string
          motion_intensity?: string | null
          objects_detected?: Json | null
          reel_id?: string
          scene_count?: number | null
          text_content?: string[] | null
          text_detected?: boolean | null
          total_frames?: number
          transition_types?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "reeldoctor_visual_analysis_reel_id_fkey"
            columns: ["reel_id"]
            isOneToOne: false
            referencedRelation: "reeldoctor_reels"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          action_taken: string | null
          content_id: string
          content_type: string
          created_at: string | null
          description: string | null
          id: string
          reason: string
          reporter_id: string
          resolution_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          action_taken?: string | null
          content_id: string
          content_type: string
          created_at?: string | null
          description?: string | null
          id?: string
          reason: string
          reporter_id: string
          resolution_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          action_taken?: string | null
          content_id?: string
          content_type?: string
          created_at?: string | null
          description?: string | null
          id?: string
          reason?: string
          reporter_id?: string
          resolution_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      rewards: {
        Row: {
          amount: number
          available: boolean | null
          backers_count: number | null
          created_at: string | null
          currency: string | null
          delivery_date: string | null
          description: string
          id: string
          limit_quantity: number | null
          position: number | null
          project_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          available?: boolean | null
          backers_count?: number | null
          created_at?: string | null
          currency?: string | null
          delivery_date?: string | null
          description: string
          id?: string
          limit_quantity?: number | null
          position?: number | null
          project_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          available?: boolean | null
          backers_count?: number | null
          created_at?: string | null
          currency?: string | null
          delivery_date?: string | null
          description?: string
          id?: string
          limit_quantity?: number | null
          position?: number | null
          project_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rewards_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      subtasks: {
        Row: {
          created_at: string | null
          id: string
          is_completed: boolean | null
          task_text: string
          todo_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          task_text: string
          todo_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          task_text?: string
          todo_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subtasks_todo_id_fkey"
            columns: ["todo_id"]
            isOneToOne: false
            referencedRelation: "todos"
            referencedColumns: ["id"]
          },
        ]
      }
      task_execution_logs: {
        Row: {
          completed_at: string | null
          error_message: string | null
          id: string
          output: string | null
          started_at: string | null
          status: string
          task_id: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          error_message?: string | null
          id?: string
          output?: string | null
          started_at?: string | null
          status: string
          task_id?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          error_message?: string | null
          id?: string
          output?: string | null
          started_at?: string | null
          status?: string
          task_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "task_execution_logs_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "automated_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string | null
          id: string
          name: string
          player1_email: string | null
          player1_name: string | null
          player1_phone: string | null
          player2_email: string | null
          player2_name: string | null
          player2_phone: string | null
          seed: number | null
          tournament_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          player1_email?: string | null
          player1_name?: string | null
          player1_phone?: string | null
          player2_email?: string | null
          player2_name?: string | null
          player2_phone?: string | null
          seed?: number | null
          tournament_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          player1_email?: string | null
          player1_name?: string | null
          player1_phone?: string | null
          player2_email?: string | null
          player2_name?: string | null
          player2_phone?: string | null
          seed?: number | null
          tournament_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teams_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      todos: {
        Row: {
          created_at: string | null
          due_date: string | null
          id: string
          is_completed: boolean | null
          task_text: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          due_date?: string | null
          id?: string
          is_completed?: boolean | null
          task_text: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          due_date?: string | null
          id?: string
          is_completed?: boolean | null
          task_text?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      tool_categories: {
        Row: {
          created_at: string | null
          created_by: string | null
          icon_name: string | null
          id: string
          is_default: boolean | null
          name: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          icon_name?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          icon_name?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      touchbase_activity_participants: {
        Row: {
          activity_id: string
          id: string
          player_id: string | null
          registered_at: string | null
          student_id: string
        }
        Insert: {
          activity_id: string
          id?: string
          player_id?: string | null
          registered_at?: string | null
          student_id: string
        }
        Update: {
          activity_id?: string
          id?: string
          player_id?: string | null
          registered_at?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "touchbase_activity_participants_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "touchbase_extracurricular_activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "touchbase_activity_participants_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "touchbase_players"
            referencedColumns: ["id"]
          },
        ]
      }
      touchbase_attendance: {
        Row: {
          comment: string | null
          created_at: string | null
          date: string
          id: number
          status: Database["public"]["Enums"]["touchbase_attendance_status"]
          team_id: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          date: string
          id?: number
          status?: Database["public"]["Enums"]["touchbase_attendance_status"]
          team_id: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          date?: string
          id?: number
          status?: Database["public"]["Enums"]["touchbase_attendance_status"]
          team_id?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      touchbase_billing_config: {
        Row: {
          created_at: string | null
          fee_per_player: number | null
          fee_per_season: number | null
          id: number
          payment_enabled: boolean | null
          stripe_account_id: string | null
          team_id: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          fee_per_player?: number | null
          fee_per_season?: number | null
          id?: number
          payment_enabled?: boolean | null
          stripe_account_id?: string | null
          team_id: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          fee_per_player?: number | null
          fee_per_season?: number | null
          id?: number
          payment_enabled?: boolean | null
          stripe_account_id?: string | null
          team_id?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      touchbase_billing_transactions: {
        Row: {
          amount: number
          checkout_id: string
          completed_at: string | null
          created_at: string | null
          currency: string | null
          description: string
          id: number
          metadata: Json | null
          payment_method: string | null
          status: Database["public"]["Enums"]["touchbase_payment_status"] | null
          team_id: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          checkout_id: string
          completed_at?: string | null
          created_at?: string | null
          currency?: string | null
          description: string
          id?: number
          metadata?: Json | null
          payment_method?: string | null
          status?:
            | Database["public"]["Enums"]["touchbase_payment_status"]
            | null
          team_id?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          checkout_id?: string
          completed_at?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string
          id?: number
          metadata?: Json | null
          payment_method?: string | null
          status?:
            | Database["public"]["Enums"]["touchbase_payment_status"]
            | null
          team_id?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      touchbase_budgets: {
        Row: {
          allocated_amount: number
          category: string
          created_at: string | null
          deleted_at: string | null
          fiscal_year: number | null
          id: string
          notes: string | null
          org_id: string
          spent_amount: number | null
          updated_at: string | null
        }
        Insert: {
          allocated_amount: number
          category: string
          created_at?: string | null
          deleted_at?: string | null
          fiscal_year?: number | null
          id?: string
          notes?: string | null
          org_id: string
          spent_amount?: number | null
          updated_at?: string | null
        }
        Update: {
          allocated_amount?: number
          category?: string
          created_at?: string | null
          deleted_at?: string | null
          fiscal_year?: number | null
          id?: string
          notes?: string | null
          org_id?: string
          spent_amount?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "touchbase_budgets_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "touchbase_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      touchbase_clubs: {
        Row: {
          city: string | null
          country: string | null
          created_at: string | null
          id: number
          name: string
          tenant_id: number | null
          updated_at: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          id?: number
          name: string
          tenant_id?: number | null
          updated_at?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          id?: number
          name?: string
          tenant_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_club_tenant"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "touchbase_tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      touchbase_email_queue: {
        Row: {
          attempts: number | null
          body: string
          created_at: string | null
          id: number
          last_error: string | null
          sent_at: string | null
          status: Database["public"]["Enums"]["touchbase_email_status"] | null
          subject: string
          to_email: string
          to_name: string | null
          updated_at: string | null
        }
        Insert: {
          attempts?: number | null
          body: string
          created_at?: string | null
          id?: number
          last_error?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["touchbase_email_status"] | null
          subject: string
          to_email: string
          to_name?: string | null
          updated_at?: string | null
        }
        Update: {
          attempts?: number | null
          body?: string
          created_at?: string | null
          id?: number
          last_error?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["touchbase_email_status"] | null
          subject?: string
          to_email?: string
          to_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      touchbase_expenses: {
        Row: {
          amount: number
          approved_at: string | null
          approved_by: string | null
          budget_id: string | null
          category: string
          created_at: string | null
          created_by: string
          deleted_at: string | null
          description: string | null
          id: string
          org_id: string
          receipt_url: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          approved_at?: string | null
          approved_by?: string | null
          budget_id?: string | null
          category: string
          created_at?: string | null
          created_by: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          org_id: string
          receipt_url?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          approved_at?: string | null
          approved_by?: string | null
          budget_id?: string | null
          category?: string
          created_at?: string | null
          created_by?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          org_id?: string
          receipt_url?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "touchbase_expenses_budget_id_fkey"
            columns: ["budget_id"]
            isOneToOne: false
            referencedRelation: "touchbase_budgets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "touchbase_expenses_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "touchbase_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      touchbase_extracurricular_activities: {
        Row: {
          activity_date: string | null
          created_at: string | null
          deleted_at: string | null
          description: string | null
          id: string
          location: string | null
          max_participants: number | null
          name: string
          org_id: string
          updated_at: string | null
        }
        Insert: {
          activity_date?: string | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          location?: string | null
          max_participants?: number | null
          name: string
          org_id: string
          updated_at?: string | null
        }
        Update: {
          activity_date?: string | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          location?: string | null
          max_participants?: number | null
          name?: string
          org_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "touchbase_extracurricular_activities_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "touchbase_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      touchbase_games: {
        Row: {
          away_score: number | null
          away_team_id: string | null
          created_at: string | null
          game_date: string
          home_score: number | null
          home_team_id: string | null
          id: string
          location: string | null
          org_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          away_score?: number | null
          away_team_id?: string | null
          created_at?: string | null
          game_date: string
          home_score?: number | null
          home_team_id?: string | null
          id?: string
          location?: string | null
          org_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          away_score?: number | null
          away_team_id?: string | null
          created_at?: string | null
          game_date?: string
          home_score?: number | null
          home_team_id?: string | null
          id?: string
          location?: string | null
          org_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "touchbase_games_away_team_id_fkey"
            columns: ["away_team_id"]
            isOneToOne: false
            referencedRelation: "touchbase_teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "touchbase_games_home_team_id_fkey"
            columns: ["home_team_id"]
            isOneToOne: false
            referencedRelation: "touchbase_teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "touchbase_games_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "touchbase_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      touchbase_matches: {
        Row: {
          box_score: Json | null
          completed_at: string | null
          created_at: string | null
          id: number
          innings_played: number | null
          match_number: number | null
          notes: string | null
          played_at: string | null
          round: number | null
          scheduled_at: string | null
          score_away: number | null
          score_home: number | null
          status: Database["public"]["Enums"]["touchbase_match_status"] | null
          team_away: number
          team_home: number
          tournament_id: number
          updated_at: string | null
          venue: string | null
          winner_team_id: number | null
        }
        Insert: {
          box_score?: Json | null
          completed_at?: string | null
          created_at?: string | null
          id?: number
          innings_played?: number | null
          match_number?: number | null
          notes?: string | null
          played_at?: string | null
          round?: number | null
          scheduled_at?: string | null
          score_away?: number | null
          score_home?: number | null
          status?: Database["public"]["Enums"]["touchbase_match_status"] | null
          team_away: number
          team_home: number
          tournament_id: number
          updated_at?: string | null
          venue?: string | null
          winner_team_id?: number | null
        }
        Update: {
          box_score?: Json | null
          completed_at?: string | null
          created_at?: string | null
          id?: number
          innings_played?: number | null
          match_number?: number | null
          notes?: string | null
          played_at?: string | null
          round?: number | null
          scheduled_at?: string | null
          score_away?: number | null
          score_home?: number | null
          status?: Database["public"]["Enums"]["touchbase_match_status"] | null
          team_away?: number
          team_home?: number
          tournament_id?: number
          updated_at?: string | null
          venue?: string | null
          winner_team_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_match_tournament"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "touchbase_tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      touchbase_memberships: {
        Row: {
          created_at: string | null
          org_id: string
          role: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          org_id: string
          role?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          org_id?: string
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "touchbase_memberships_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "touchbase_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      touchbase_migrations: {
        Row: {
          applied_at: string | null
          batch: number
          id: number
          migration_name: string
        }
        Insert: {
          applied_at?: string | null
          batch?: number
          id?: number
          migration_name: string
        }
        Update: {
          applied_at?: string | null
          batch?: number
          id?: number
          migration_name?: string
        }
        Relationships: []
      }
      touchbase_organizations: {
        Row: {
          created_at: string | null
          id: string
          logo_url: string | null
          name: string
          slug: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name: string
          slug?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          slug?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      touchbase_personal_development_logs: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          log_type: string | null
          logged_at: string | null
          org_id: string
          player_id: string | null
          student_id: string
          title: string | null
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          log_type?: string | null
          logged_at?: string | null
          org_id: string
          player_id?: string | null
          student_id: string
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          log_type?: string | null
          logged_at?: string | null
          org_id?: string
          player_id?: string | null
          student_id?: string
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "touchbase_personal_development_logs_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "touchbase_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "touchbase_personal_development_logs_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "touchbase_players"
            referencedColumns: ["id"]
          },
        ]
      }
      touchbase_placement_test_results: {
        Row: {
          answers: Json | null
          created_at: string | null
          id: string
          org_id: string
          player_id: string | null
          recommended_level: string | null
          score: number
          student_id: string
          taken_at: string | null
          test_id: string
        }
        Insert: {
          answers?: Json | null
          created_at?: string | null
          id?: string
          org_id: string
          player_id?: string | null
          recommended_level?: string | null
          score: number
          student_id: string
          taken_at?: string | null
          test_id: string
        }
        Update: {
          answers?: Json | null
          created_at?: string | null
          id?: string
          org_id?: string
          player_id?: string | null
          recommended_level?: string | null
          score?: number
          student_id?: string
          taken_at?: string | null
          test_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "touchbase_placement_test_results_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "touchbase_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "touchbase_placement_test_results_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "touchbase_players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "touchbase_placement_test_results_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "touchbase_placement_tests"
            referencedColumns: ["id"]
          },
        ]
      }
      touchbase_placement_tests: {
        Row: {
          created_at: string | null
          created_by: string
          deleted_at: string | null
          description: string | null
          id: string
          name: string
          org_id: string
          passing_score: number | null
          questions: Json | null
          subject: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          name: string
          org_id: string
          passing_score?: number | null
          questions?: Json | null
          subject: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          name?: string
          org_id?: string
          passing_score?: number | null
          questions?: Json | null
          subject?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "touchbase_placement_tests_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "touchbase_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      touchbase_players: {
        Row: {
          academic_level: string | null
          affiliate: string | null
          birthdate: string | null
          country: string | null
          created_at: string | null
          email: string | null
          english_level: string | null
          family_info: Json | null
          full_name: string
          id: string
          jersey_number: number | null
          math_level: string | null
          notes: string | null
          org_id: string
          phone: string | null
          photo_url: string | null
          position: string | null
          science_level: string | null
          signing_year: number | null
          spanish_level: string | null
          team_id: string | null
          updated_at: string | null
        }
        Insert: {
          academic_level?: string | null
          affiliate?: string | null
          birthdate?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          english_level?: string | null
          family_info?: Json | null
          full_name: string
          id?: string
          jersey_number?: number | null
          math_level?: string | null
          notes?: string | null
          org_id: string
          phone?: string | null
          photo_url?: string | null
          position?: string | null
          science_level?: string | null
          signing_year?: number | null
          spanish_level?: string | null
          team_id?: string | null
          updated_at?: string | null
        }
        Update: {
          academic_level?: string | null
          affiliate?: string | null
          birthdate?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          english_level?: string | null
          family_info?: Json | null
          full_name?: string
          id?: string
          jersey_number?: number | null
          math_level?: string | null
          notes?: string | null
          org_id?: string
          phone?: string | null
          photo_url?: string | null
          position?: string | null
          science_level?: string | null
          signing_year?: number | null
          spanish_level?: string | null
          team_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "touchbase_players_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "touchbase_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "touchbase_players_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "touchbase_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      touchbase_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          default_org_id: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          default_org_id?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          default_org_id?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "touchbase_profiles_default_org_id_fkey"
            columns: ["default_org_id"]
            isOneToOne: false
            referencedRelation: "touchbase_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      touchbase_roster: {
        Row: {
          created_at: string | null
          id: number
          notes: string | null
          number: string | null
          position: string | null
          team_id: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          notes?: string | null
          number?: string | null
          position?: string | null
          team_id: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: number
          notes?: string | null
          number?: string | null
          position?: string | null
          team_id?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      touchbase_schedule: {
        Row: {
          created_at: string | null
          end_at: string | null
          id: number
          notes: string | null
          opponent: string | null
          start_at: string
          team_id: number
          type: Database["public"]["Enums"]["touchbase_event_type"]
          updated_at: string | null
          venue: string | null
        }
        Insert: {
          created_at?: string | null
          end_at?: string | null
          id?: number
          notes?: string | null
          opponent?: string | null
          start_at: string
          team_id: number
          type: Database["public"]["Enums"]["touchbase_event_type"]
          updated_at?: string | null
          venue?: string | null
        }
        Update: {
          created_at?: string | null
          end_at?: string | null
          id?: number
          notes?: string | null
          opponent?: string | null
          start_at?: string
          team_id?: number
          type?: Database["public"]["Enums"]["touchbase_event_type"]
          updated_at?: string | null
          venue?: string | null
        }
        Relationships: []
      }
      touchbase_seasons: {
        Row: {
          club_id: number
          created_at: string | null
          end_date: string | null
          id: number
          is_active: boolean | null
          name: string
          start_date: string | null
          updated_at: string | null
        }
        Insert: {
          club_id: number
          created_at?: string | null
          end_date?: string | null
          id?: number
          is_active?: boolean | null
          name: string
          start_date?: string | null
          updated_at?: string | null
        }
        Update: {
          club_id?: number
          created_at?: string | null
          end_date?: string | null
          id?: number
          is_active?: boolean | null
          name?: string
          start_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_season_club"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "touchbase_clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      touchbase_stats: {
        Row: {
          created_at: string | null
          id: number
          match_id: number | null
          metric: string
          team_id: number
          user_id: string
          value: number
        }
        Insert: {
          created_at?: string | null
          id?: number
          match_id?: number | null
          metric: string
          team_id: number
          user_id: string
          value: number
        }
        Update: {
          created_at?: string | null
          id?: number
          match_id?: number | null
          metric?: string
          team_id?: number
          user_id?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_stats_match"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "touchbase_schedule"
            referencedColumns: ["id"]
          },
        ]
      }
      touchbase_teachers: {
        Row: {
          address: string | null
          birthdate: string | null
          certifications: Json | null
          created_at: string | null
          degree: string | null
          deleted_at: string | null
          department: string | null
          email: string | null
          employment_type: string | null
          experience_years: number | null
          field_of_study: string | null
          full_name: string
          graduation_year: number | null
          hire_date: string | null
          id: string
          institution: string | null
          licenses: Json | null
          nationality: string | null
          notes: string | null
          org_id: string
          phone: string | null
          photo_url: string | null
          salary: number | null
          teaching_subjects: string[] | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          birthdate?: string | null
          certifications?: Json | null
          created_at?: string | null
          degree?: string | null
          deleted_at?: string | null
          department?: string | null
          email?: string | null
          employment_type?: string | null
          experience_years?: number | null
          field_of_study?: string | null
          full_name: string
          graduation_year?: number | null
          hire_date?: string | null
          id?: string
          institution?: string | null
          licenses?: Json | null
          nationality?: string | null
          notes?: string | null
          org_id: string
          phone?: string | null
          photo_url?: string | null
          salary?: number | null
          teaching_subjects?: string[] | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          birthdate?: string | null
          certifications?: Json | null
          created_at?: string | null
          degree?: string | null
          deleted_at?: string | null
          department?: string | null
          email?: string | null
          employment_type?: string | null
          experience_years?: number | null
          field_of_study?: string | null
          full_name?: string
          graduation_year?: number | null
          hire_date?: string | null
          id?: string
          institution?: string | null
          licenses?: Json | null
          nationality?: string | null
          notes?: string | null
          org_id?: string
          phone?: string | null
          photo_url?: string | null
          salary?: number | null
          teaching_subjects?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "touchbase_teachers_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "touchbase_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      touchbase_teams: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          name: string
          org_id: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          name: string
          org_id: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          name?: string
          org_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "touchbase_teams_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "touchbase_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      touchbase_tenant_analytics: {
        Row: {
          id: number
          metadata: Json | null
          metric_date: string
          metric_name: string
          metric_value: number
          recorded_at: string | null
          tenant_id: number
        }
        Insert: {
          id?: number
          metadata?: Json | null
          metric_date: string
          metric_name: string
          metric_value?: number
          recorded_at?: string | null
          tenant_id: number
        }
        Update: {
          id?: number
          metadata?: Json | null
          metric_date?: string
          metric_name?: string
          metric_value?: number
          recorded_at?: string | null
          tenant_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_analytics_tenant"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "touchbase_tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      touchbase_tenant_sessions: {
        Row: {
          id: number
          ip_address: string | null
          last_accessed: string | null
          session_key: string
          tenant_id: number
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          id?: number
          ip_address?: string | null
          last_accessed?: string | null
          session_key: string
          tenant_id: number
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          id?: number
          ip_address?: string | null
          last_accessed?: string | null
          session_key?: string
          tenant_id?: number
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_session_tenant"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "touchbase_tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      touchbase_tenants: {
        Row: {
          address: string | null
          code: string
          color_accent: string | null
          color_danger: string | null
          color_primary: string | null
          color_secondary: string | null
          created_at: string | null
          email: string | null
          favicon_url: string | null
          features_enabled: Json | null
          font_family: string | null
          id: number
          is_active: boolean | null
          locale: string | null
          logo_dark_url: string | null
          logo_url: string | null
          name: string
          phone: string | null
          settings: Json | null
          slug: string | null
          theme_mode: Database["public"]["Enums"]["touchbase_theme_mode"] | null
          timezone: string | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          address?: string | null
          code: string
          color_accent?: string | null
          color_danger?: string | null
          color_primary?: string | null
          color_secondary?: string | null
          created_at?: string | null
          email?: string | null
          favicon_url?: string | null
          features_enabled?: Json | null
          font_family?: string | null
          id?: number
          is_active?: boolean | null
          locale?: string | null
          logo_dark_url?: string | null
          logo_url?: string | null
          name: string
          phone?: string | null
          settings?: Json | null
          slug?: string | null
          theme_mode?:
            | Database["public"]["Enums"]["touchbase_theme_mode"]
            | null
          timezone?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          address?: string | null
          code?: string
          color_accent?: string | null
          color_danger?: string | null
          color_primary?: string | null
          color_secondary?: string | null
          created_at?: string | null
          email?: string | null
          favicon_url?: string | null
          features_enabled?: Json | null
          font_family?: string | null
          id?: number
          is_active?: boolean | null
          locale?: string | null
          logo_dark_url?: string | null
          logo_url?: string | null
          name?: string
          phone?: string | null
          settings?: Json | null
          slug?: string | null
          theme_mode?:
            | Database["public"]["Enums"]["touchbase_theme_mode"]
            | null
          timezone?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      touchbase_tournament_teams: {
        Row: {
          group_name: string | null
          id: number
          seed: number | null
          team_id: number
          tournament_id: number
        }
        Insert: {
          group_name?: string | null
          id?: number
          seed?: number | null
          team_id: number
          tournament_id: number
        }
        Update: {
          group_name?: string | null
          id?: number
          seed?: number | null
          team_id?: number
          tournament_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_tt_tournament"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "touchbase_tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      touchbase_tournaments: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string | null
          format: Database["public"]["Enums"]["touchbase_tournament_format"]
          id: number
          name: string
          num_groups: number | null
          season_id: number
          settings: Json | null
          start_date: string | null
          status:
            | Database["public"]["Enums"]["touchbase_tournament_status"]
            | null
          teams_per_group: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          format?: Database["public"]["Enums"]["touchbase_tournament_format"]
          id?: number
          name: string
          num_groups?: number | null
          season_id: number
          settings?: Json | null
          start_date?: string | null
          status?:
            | Database["public"]["Enums"]["touchbase_tournament_status"]
            | null
          teams_per_group?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          format?: Database["public"]["Enums"]["touchbase_tournament_format"]
          id?: number
          name?: string
          num_groups?: number | null
          season_id?: number
          settings?: Json | null
          start_date?: string | null
          status?:
            | Database["public"]["Enums"]["touchbase_tournament_status"]
            | null
          teams_per_group?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_tournament_season"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "touchbase_seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      touchbase_wellness_programs: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          description: string | null
          end_date: string | null
          id: string
          name: string
          org_id: string
          program_type: string | null
          start_date: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          org_id: string
          program_type?: string | null
          start_date?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          org_id?: string
          program_type?: string | null
          start_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "touchbase_wellness_programs_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "touchbase_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      tournaments: {
        Row: {
          club_id: string | null
          created_at: string | null
          description: string | null
          ends_at: string | null
          entry_fee: number | null
          format: string | null
          id: string
          max_teams: number | null
          min_teams: number | null
          name: string
          registration_deadline: string | null
          settings: Json | null
          starts_at: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          club_id?: string | null
          created_at?: string | null
          description?: string | null
          ends_at?: string | null
          entry_fee?: number | null
          format?: string | null
          id?: string
          max_teams?: number | null
          min_teams?: number | null
          name: string
          registration_deadline?: string | null
          settings?: Json | null
          starts_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          club_id?: string | null
          created_at?: string | null
          description?: string | null
          ends_at?: string | null
          entry_fee?: number | null
          format?: string | null
          id?: string
          max_teams?: number | null
          min_teams?: number | null
          name?: string
          registration_deadline?: string | null
          settings?: Json | null
          starts_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tournaments_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      user_api_keys: {
        Row: {
          api_key: string
          created_at: string | null
          id: string
          service_name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          api_key: string
          created_at?: string | null
          id?: string
          service_name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          api_key?: string
          created_at?: string | null
          id?: string
          service_name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_dashboard_tools: {
        Row: {
          category_name: string | null
          created_at: string | null
          id: string
          is_favorite: boolean | null
          sort_order: number | null
          tool_description: string | null
          tool_name: string
          tool_url: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category_name?: string | null
          created_at?: string | null
          id?: string
          is_favorite?: boolean | null
          sort_order?: number | null
          tool_description?: string | null
          tool_name: string
          tool_url?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category_name?: string | null
          created_at?: string | null
          id?: string
          is_favorite?: boolean | null
          sort_order?: number | null
          tool_description?: string | null
          tool_name?: string
          tool_url?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role_type"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role_type"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role_type"] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_saas_apps: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          logo: string | null
          name: string
          sort_order: number | null
          updated_at: string | null
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          logo?: string | null
          name: string
          sort_order?: number | null
          updated_at?: string | null
          url: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          logo?: string | null
          name?: string
          sort_order?: number | null
          updated_at?: string | null
          url?: string
          user_id?: string
        }
        Relationships: []
      }
      video_metrics: {
        Row: {
          completed: boolean | null
          created_at: string | null
          id: string
          liked: boolean | null
          session_id: string | null
          updated_at: string | null
          video_id: string
          viewer_id: string | null
          watched_seconds: number | null
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          liked?: boolean | null
          session_id?: string | null
          updated_at?: string | null
          video_id: string
          viewer_id?: string | null
          watched_seconds?: number | null
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          liked?: boolean | null
          session_id?: string | null
          updated_at?: string | null
          video_id?: string
          viewer_id?: string | null
          watched_seconds?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "video_metrics_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_metrics_viewer_id_fkey"
            columns: ["viewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      videos: {
        Row: {
          created_at: string | null
          description: string | null
          duration_seconds: number | null
          genre: string | null
          id: string
          is_featured: boolean | null
          like_count: number | null
          published_at: string | null
          stream_id: string
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          uploader_id: string
          view_count: number | null
          visibility: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration_seconds?: number | null
          genre?: string | null
          id?: string
          is_featured?: boolean | null
          like_count?: number | null
          published_at?: string | null
          stream_id: string
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          uploader_id: string
          view_count?: number | null
          visibility?: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration_seconds?: number | null
          genre?: string | null
          id?: string
          is_featured?: boolean | null
          like_count?: number | null
          published_at?: string | null
          stream_id?: string
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          uploader_id?: string
          view_count?: number | null
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "videos_uploader_id_fkey"
            columns: ["uploader_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      waitlist: {
        Row: {
          created_at: string | null
          email: string
          id: string
          interest: string | null
          invited_at: string | null
          joined_at: string | null
          message: string | null
          name: string | null
          referral_source: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          interest?: string | null
          invited_at?: string | null
          joined_at?: string | null
          message?: string | null
          name?: string | null
          referral_source?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          interest?: string | null
          invited_at?: string | null
          joined_at?: string | null
          message?: string | null
          name?: string | null
          referral_source?: string | null
          status?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_elo_rating: {
        Args: {
          actual_score: number
          current_rating: number
          k_factor?: number
          opponent_rating: number
        }
        Returns: number
      }
      check_court_availability: {
        Args: { court_uuid: string; end_time: string; start_time: string }
        Returns: boolean
      }
      close_expired_projects: { Args: never; Returns: undefined }
      create_notification: {
        Args: {
          notification_data?: Json
          notification_message: string
          notification_title: string
          notification_type?: string
          user_uuid: string
        }
        Returns: string
      }
      create_user_role: { Args: { user_id: string }; Returns: undefined }
      create_user_safely: {
        Args: { user_email: string; user_password?: string }
        Returns: string
      }
      ensure_user_role: { Args: { p_user_id: string }; Returns: undefined }
      get_club_rankings: {
        Args: { club_uuid: string }
        Returns: {
          games_played: number
          last_match_date: string
          losses: number
          player_email: string
          player_name: string
          rating: number
          win_percentage: number
          wins: number
        }[]
      }
      get_tournament_player_rankings: {
        Args: { tournament_uuid: string }
        Returns: {
          games_diff: number
          games_lost: number
          games_won: number
          matches_lost: number
          matches_won: number
          player_key: string
          player_name: string
          points: number
          rank: number
        }[]
      }
      get_tournament_standings: {
        Args: { tournament_uuid: string }
        Returns: {
          losses: number
          point_difference: number
          points_against: number
          points_for: number
          team_id: string
          team_name: string
          wins: number
        }[]
      }
      get_tournament_stats: { Args: { tournament_uuid: string }; Returns: Json }
      get_unread_notification_count: {
        Args: { user_uuid: string }
        Returns: number
      }
      get_user_role: {
        Args: { user_id_param: string }
        Returns: Database["public"]["Enums"]["user_role_type"]
      }
      increment_download_count: {
        Args: { download_id: string }
        Returns: undefined
      }
      initialize_player_stats: {
        Args: { tournament_uuid: string }
        Returns: number
      }
      mark_notifications_read: {
        Args: { notification_ids?: string[]; user_uuid: string }
        Returns: number
      }
      promptsmith_get_usage_stats: {
        Args: { end_date?: string; start_date?: string }
        Returns: {
          active_users: number
          avg_quality_score: number
          top_domains: string[]
          total_evaluations: number
          total_prompts: number
        }[]
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      touchbase_current_org: {
        Args: never
        Returns: {
          org_id: string
          org_name: string
          role: string
        }[]
      }
      touchbase_get_user_role: { Args: { p_org: string }; Returns: string }
      touchbase_is_org_member: { Args: { p_org: string }; Returns: boolean }
      touchbase_list_orgs: {
        Args: never
        Returns: {
          org_id: string
          org_name: string
          role: string
        }[]
      }
      touchbase_list_players_current_org: {
        Args: { p_team_id?: string }
        Returns: {
          created_at: string
          full_name: string
          id: string
          jersey_number: number
          position: string
          team_id: string
        }[]
      }
      touchbase_list_teams_current_org: {
        Args: never
        Returns: {
          category: string
          created_at: string
          id: string
          name: string
        }[]
      }
      touchbase_onboard_user: { Args: { p_org_name?: string }; Returns: string }
      touchbase_switch_org: { Args: { p_target_org: string }; Returns: boolean }
      update_player_ratings_after_match: {
        Args: { match_uuid: string }
        Returns: undefined
      }
      update_player_stats_for_match: {
        Args: {
          player_key_a1: string
          player_key_a2: string
          player_key_b1: string
          player_key_b2: string
          team_a_score: number
          team_b_score: number
          tournament_uuid: string
        }
        Returns: undefined
      }
    }
    Enums: {
      dona_center_status: "active" | "inactive" | "full" | "accepting"
      dona_delivery_status:
        | "pending"
        | "accepted"
        | "picked_up"
        | "in_transit"
        | "delivered"
        | "cancelled"
      dona_donation_status:
        | "pending"
        | "published"
        | "claimed"
        | "in_transit"
        | "delivered"
        | "cancelled"
      dona_user_role:
        | "super_admin"
        | "org_admin"
        | "org_member"
        | "driver"
        | "beneficiary"
        | "donor"
      promptsmith_domain:
        | "sql"
        | "branding"
        | "cine"
        | "saas"
        | "devops"
        | "general"
      promptsmith_rule_category:
        | "vague_terms"
        | "structure"
        | "enhancement"
        | "terminology"
        | "formatting"
        | "context"
      promptsmith_template_type:
        | "basic"
        | "chain-of-thought"
        | "few-shot"
        | "role-based"
        | "step-by-step"
      promptsmith_tone: "formal" | "casual" | "technical" | "creative"
      touchbase_attendance_status: "present" | "late" | "absent" | "excused"
      touchbase_email_status: "queued" | "sent" | "failed"
      touchbase_event_type: "practice" | "game"
      touchbase_match_status:
        | "scheduled"
        | "in_progress"
        | "completed"
        | "postponed"
        | "cancelled"
        | "forfeit"
      touchbase_payment_status: "pending" | "completed" | "failed" | "refunded"
      touchbase_theme_mode: "dark" | "light" | "auto"
      touchbase_tournament_format:
        | "round_robin"
        | "knockout"
        | "groups_knockout"
        | "double_elimination"
      touchbase_tournament_status:
        | "draft"
        | "scheduled"
        | "in_progress"
        | "completed"
        | "cancelled"
      user_role_type: "admin" | "employee"
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
      dona_center_status: ["active", "inactive", "full", "accepting"],
      dona_delivery_status: [
        "pending",
        "accepted",
        "picked_up",
        "in_transit",
        "delivered",
        "cancelled",
      ],
      dona_donation_status: [
        "pending",
        "published",
        "claimed",
        "in_transit",
        "delivered",
        "cancelled",
      ],
      dona_user_role: [
        "super_admin",
        "org_admin",
        "org_member",
        "driver",
        "beneficiary",
        "donor",
      ],
      promptsmith_domain: [
        "sql",
        "branding",
        "cine",
        "saas",
        "devops",
        "general",
      ],
      promptsmith_rule_category: [
        "vague_terms",
        "structure",
        "enhancement",
        "terminology",
        "formatting",
        "context",
      ],
      promptsmith_template_type: [
        "basic",
        "chain-of-thought",
        "few-shot",
        "role-based",
        "step-by-step",
      ],
      promptsmith_tone: ["formal", "casual", "technical", "creative"],
      touchbase_attendance_status: ["present", "late", "absent", "excused"],
      touchbase_email_status: ["queued", "sent", "failed"],
      touchbase_event_type: ["practice", "game"],
      touchbase_match_status: [
        "scheduled",
        "in_progress",
        "completed",
        "postponed",
        "cancelled",
        "forfeit",
      ],
      touchbase_payment_status: ["pending", "completed", "failed", "refunded"],
      touchbase_theme_mode: ["dark", "light", "auto"],
      touchbase_tournament_format: [
        "round_robin",
        "knockout",
        "groups_knockout",
        "double_elimination",
      ],
      touchbase_tournament_status: [
        "draft",
        "scheduled",
        "in_progress",
        "completed",
        "cancelled",
      ],
      user_role_type: ["admin", "employee"],
    },
  },
} as const

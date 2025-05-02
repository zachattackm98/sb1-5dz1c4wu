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
      arc_flash_data: {
        Row: {
          id: string
          voltage_range: string
          cleaned_equipment: string
          general_task_category: string
          specific_task: string
          parameters: string
          arc_flash_ppe_category: string
          arc_flash_boundary: string
          likelihood_of_occurrence: string
          created_at: string | null
        }
        Insert: {
          id?: string
          voltage_range: string
          cleaned_equipment: string
          general_task_category: string
          specific_task: string
          parameters: string
          arc_flash_ppe_category: string
          arc_flash_boundary: string
          likelihood_of_occurrence: string
          created_at?: string | null
        }
        Update: {
          id?: string
          voltage_range?: string
          cleaned_equipment?: string
          general_task_category?: string
          specific_task?: string
          parameters?: string
          arc_flash_ppe_category?: string
          arc_flash_boundary?: string
          likelihood_of_occurrence?: string
          created_at?: string | null
        }
      }
      arc_flash_data_duplicate: {
        Row: {
          id: string
          voltage_range: string
          cleaned_equipment: string
          general_task_category: string
          specific_task: string
          parameters: string
          arc_flash_ppe_category: string
          arc_flash_boundary: string
          likelihood_of_occurrence: string
          created_at: string | null
        }
        Insert: {
          id?: string
          voltage_range: string
          cleaned_equipment: string
          general_task_category: string
          specific_task: string
          parameters: string
          arc_flash_ppe_category: string
          arc_flash_boundary: string
          likelihood_of_occurrence: string
          created_at?: string | null
        }
        Update: {
          id?: string
          voltage_range?: string
          cleaned_equipment?: string
          general_task_category?: string
          specific_task?: string
          parameters?: string
          arc_flash_ppe_category?: string
          arc_flash_boundary?: string
          likelihood_of_occurrence?: string
          created_at?: string | null
        }
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
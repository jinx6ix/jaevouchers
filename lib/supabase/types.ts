// lib/supabase/types.ts
export type Database = {
    public: {
      Tables: {
        vouchers: {
          Row: {
            id: string
            voucher_no: string | null
            date: string | null
            hotel_name: string | null
            room_type: string | null
            clients: string | null
            adults: number | null
            children: number | null
            check_in: string | null
            check_out: string | null
            nights: number | null
            singles: number | null
            twins: number | null
            doubles: number | null
            triples: number | null
            extra_bed: number | null
            remarks: string | null
            signed_for: string | null
            signed_name: string | null
            agent_name: string | null
            status: string | null
            booking_status: string | null
            created_at: string | null
            updated_at: string | null
          }
          Insert: {
            id?: string
            voucher_no?: string | null
            date?: string | null
            hotel_name?: string | null
            room_type?: string | null
            clients?: string | null
            adults?: number | null
            children?: number | null
            check_in?: string | null
            check_out?: string | null
            nights?: number | null
            singles?: number | null
            twins?: number | null
            doubles?: number | null
            triples?: number | null
            extra_bed?: number | null
            remarks?: string | null
            signed_for?: string | null
            signed_name?: string | null
            agent_name?: string | null
            status?: string | null
            booking_status?: string | null
            created_at?: string | null
            updated_at?: string | null
          }
          Update: {
            id?: string
            voucher_no?: string | null
            date?: string | null
            hotel_name?: string | null
            room_type?: string | null
            clients?: string | null
            adults?: number | null
            children?: number | null
            check_in?: string | null
            check_out?: string | null
            nights?: number | null
            singles?: number | null
            twins?: number | null
            doubles?: number | null
            triples?: number | null
            extra_bed?: number | null
            remarks?: string | null
            signed_for?: string | null
            signed_name?: string | null
            agent_name?: string | null
            status?: string | null
            booking_status?: string | null
            created_at?: string | null
            updated_at?: string | null
          }
        }
      }
    }
  }
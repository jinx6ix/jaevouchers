// lib/voucher-storage.ts
import { VoucherData } from "./types";
import { createClient } from './supabase/client';

const STORAGE_KEY = "travel_vouchers"; // For localStorage fallback

// Generate a unique ID
const generateId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 15);
  const randomStr2 = Math.random().toString(36).substring(2, 15);
  return `${timestamp}-${randomStr}${randomStr2}`;
};

// Generate a unique voucher number in format JTE + sequence + date (DDMMYY)
export const generateVoucherNumber = async (): Promise<string> => {
  const date = new Date();
  
  // Format date as DDMMYY (e.g., 050626 for 5th June 2026)
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  const dateStr = `${day}${month}${year}`;
  
  try {
    // Try to get today's vouchers from Supabase
    const supabase = createClient();
    const { data, error } = await supabase
      .from('vouchers')
      .select('voucher_no')
      .ilike('voucher_no', `JTE%${dateStr}%`);
    
    if (error) {
      console.warn("Failed to fetch from Supabase for voucher number generation, falling back to localStorage:", error);
      // Fallback to localStorage
      const vouchers = loadVouchersLocal();
      const todayVouchers = vouchers.filter(v => 
        v.voucherNo?.includes(dateStr) && v.voucherNo?.startsWith('JTE')
      );
      
      let nextSequence = 1;
      if (todayVouchers.length > 0) {
        const sequences = todayVouchers.map(v => {
          const match = v.voucherNo?.match(/JTE(\d)/);
          return match ? parseInt(match[1]) : 0;
        });
        nextSequence = Math.max(...sequences, 0) + 1;
      }
      
      return `JTE${nextSequence}${dateStr}`;
    }
    
    // Process Supabase results
    let nextSequence = 1;
    if (data && data.length > 0) {
      const sequences = data.map(v => {
        const match = v.voucher_no?.match(/JTE(\d)/);
        return match ? parseInt(match[1]) : 0;
      });
      nextSequence = Math.max(...sequences, 0) + 1;
    }
    
    return `JTE${nextSequence}${dateStr}`;
  } catch (e) {
    console.warn("Error generating voucher number, using fallback:", e);
    // Ultimate fallback
    return `JTE1${dateStr}`;
  }
};

// Convert VoucherData to database format
const toDatabase = (voucher: VoucherData): any => ({
  id: voucher.id,
  voucher_no: voucher.voucherNo,
  date: voucher.date,
  voucher_type: voucher.voucherType ?? "hotel",
  hotel_name: voucher.hotelName,
  room_type: voucher.roomType,
  flight_name: voucher.flightName,
  flight_schedule: voucher.flightSchedule,
  clients: voucher.clients,
  adults: typeof voucher.adults === 'string' ? parseInt(voucher.adults) || 0 : voucher.adults || 0,
  children: typeof voucher.children === 'string' ? parseInt(voucher.children) || 0 : voucher.children || 0,
  check_in: voucher.checkIn,
  check_out: voucher.checkOut,
  nights: typeof voucher.nights === 'string' ? parseInt(voucher.nights) || 0 : voucher.nights || 0,
  singles: typeof voucher.singles === 'string' ? parseInt(voucher.singles) || 0 : voucher.singles || 0,
  twins: typeof voucher.twins === 'string' ? parseInt(voucher.twins) || 0 : voucher.twins || 0,
  doubles: typeof voucher.doubles === 'string' ? parseInt(voucher.doubles) || 0 : voucher.doubles || 0,
  triples: typeof voucher.triples === 'string' ? parseInt(voucher.triples) || 0 : voucher.triples || 0,
  extra_bed: typeof voucher.extraBed === 'string' ? parseInt(voucher.extraBed) || 0 : voucher.extraBed || 0,
  remarks: voucher.remarks,
  signed_for: voucher.signedFor,
  signed_name: voucher.signedName,
  agent_name: voucher.agentName,
  status: voucher.status || "active",
  booking_status: voucher.bookingStatus || "book",
  created_at: voucher.createdAt,
  updated_at: voucher.updatedAt,
});

// Convert database format to VoucherData
const fromDatabase = (db: any): VoucherData => ({
  id: db.id,
  voucherNo: db.voucher_no,
  date: db.date,
  voucherType: db.voucher_type ?? "hotel",
  hotelName: db.hotel_name,
  roomType: db.room_type,
  flightName: db.flight_name ?? "",
  flightSchedule: db.flight_schedule ?? "",
  clients: db.clients,
  adults: db.adults,
  children: db.children,
  checkIn: db.check_in,
  checkOut: db.check_out,
  nights: db.nights,
  singles: db.singles,
  twins: db.twins,
  doubles: db.doubles,
  triples: db.triples,
  extraBed: db.extra_bed,
  remarks: db.remarks,
  signedFor: db.signed_for,
  signedName: db.signed_name,
  agentName: db.agent_name,
  status: db.status,
  bookingStatus: db.booking_status,
  createdAt: db.created_at,
  updatedAt: db.updated_at,
  customerName: undefined,
  companyName: ""
});

// Save voucher to Supabase with localStorage fallback
export const saveVoucher = async (voucher: VoucherData): Promise<VoucherData> => {
  // Ensure voucher has an ID
  if (!voucher.id) {
    voucher.id = generateId();
  }
  
  // Ensure voucher has a number
  if (!voucher.voucherNo) {
    voucher.voucherNo = await generateVoucherNumber();
  }
  
  // Ensure booking status is set
  if (!voucher.bookingStatus) {
    voucher.bookingStatus = "book";
  }
  
  // Ensure agent name is set
  if (!voucher.agentName) {
    voucher.agentName = "Antony Waititu";
  }
  
  // Auto-fill signedName from agentName if not set
  if (!voucher.signedName && voucher.agentName) {
    voucher.signedName = voucher.agentName;
  }
  
  // Add timestamps
  const now = new Date().toISOString();
  if (!voucher.createdAt) {
    voucher.createdAt = now;
  }
  voucher.updatedAt = now;
  
  // Convert to database format
  const dbVoucher = toDatabase(voucher);
  
  // Try Supabase first
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('vouchers')
      .upsert(dbVoucher)
      .select()
      .single();
    
    if (error) {
      console.warn("Supabase error, falling back to localStorage:", error);
      // Fallback to localStorage
      return saveVoucherLocal(voucher);
    }
    
    // Also save to localStorage as backup
    try {
      await saveVoucherLocal(voucher, false); // Don't return, just save
    } catch (e) {
      console.warn("Failed to save to localStorage backup:", e);
    }
    
    return fromDatabase(data);
  } catch (e) {
    console.warn("Failed to save to Supabase, falling back to localStorage:", e);
    return saveVoucherLocal(voucher);
  }
};

// Save to localStorage only
const saveVoucherLocal = (voucher: VoucherData, shouldReturn: boolean = true): VoucherData => {
  const vouchers = loadVouchersLocal();
  const existingIndex = vouchers.findIndex(v => v.id === voucher.id);
  
  if (existingIndex >= 0) {
    vouchers[existingIndex] = { ...vouchers[existingIndex], ...voucher };
  } else {
    vouchers.push(voucher);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vouchers));
  
  return voucher;
};

// Load vouchers from Supabase with localStorage fallback
export const loadVouchers = async (): Promise<VoucherData[]> => {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('vouchers')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.warn("Supabase error, falling back to localStorage:", error);
      return loadVouchersLocal();
    }
    
    // Sync localStorage with Supabase data (optional)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify((data || []).map(fromDatabase)));
    } catch (e) {
      console.warn("Failed to sync localStorage:", e);
    }
    
    return (data || []).map(fromDatabase);
  } catch (e) {
    console.warn("Failed to load from Supabase, falling back to localStorage:", e);
    return loadVouchersLocal();
  }
};

// Load from localStorage only
export const loadVouchersLocal = (): VoucherData[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Update booking status
export const updateBookingStatus = async (id: string, status: "cancel" | "book" | "amend"): Promise<boolean> => {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('vouchers')
      .update({ 
        booking_status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) {
      console.warn("Supabase error in updateBookingStatus, updating localStorage:", error);
      // Update localStorage
      const vouchers = loadVouchersLocal();
      const index = vouchers.findIndex(v => v.id === id);
      if (index >= 0) {
        vouchers[index] = {
          ...vouchers[index],
          bookingStatus: status,
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(vouchers));
        return true;
      }
      return false;
    }
    
    return true;
  } catch (e) {
    console.warn("Failed to update booking status in Supabase:", e);
    return false;
  }
};

// Cancel voucher
export const cancelVoucher = async (id: string): Promise<boolean> => {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('vouchers')
      .update({ 
        status: "cancelled",
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) {
      console.warn("Supabase error in cancelVoucher, updating localStorage:", error);
      // Update localStorage
      const vouchers = loadVouchersLocal();
      const index = vouchers.findIndex(v => v.id === id);
      if (index >= 0) {
        vouchers[index] = {
          ...vouchers[index],
          status: "cancelled",
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(vouchers));
        return true;
      }
      return false;
    }
    
    return true;
  } catch (e) {
    console.warn("Failed to cancel voucher in Supabase:", e);
    return false;
  }
};

// Delete voucher
export const deleteVoucher = async (id: string): Promise<boolean> => {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('vouchers')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.warn("Supabase error in deleteVoucher, deleting from localStorage:", error);
      // Delete from localStorage
      const vouchers = loadVouchersLocal();
      const filtered = vouchers.filter(v => v.id !== id);
      if (filtered.length !== vouchers.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
        return true;
      }
      return false;
    }
    
    return true;
  } catch (e) {
    console.warn("Failed to delete voucher from Supabase:", e);
    return false;
  }
};

// Get voucher by ID
export const getVoucherById = async (id: string): Promise<VoucherData | undefined> => {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('vouchers')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.warn("Supabase error in getVoucherById, checking localStorage:", error);
      // Check localStorage
      const vouchers = loadVouchersLocal();
      return vouchers.find(v => v.id === id);
    }
    
    return data ? fromDatabase(data) : undefined;
  } catch (e) {
    console.warn("Failed to get voucher from Supabase:", e);
    const vouchers = loadVouchersLocal();
    return vouchers.find(v => v.id === id);
  }
};

// Helper function to get today's voucher count
export const getTodayVoucherCount = async (): Promise<number> => {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  const todayDateStr = `${day}${month}${year}`;
  
  try {
    const supabase = createClient();
    const { data, error, count } = await supabase
      .from('vouchers')
      .select('*', { count: 'exact', head: true })
      .ilike('voucher_no', `%${todayDateStr}%`);
    
    if (error) {
      console.warn("Supabase error in getTodayVoucherCount, using localStorage:", error);
      const vouchers = loadVouchersLocal();
      return vouchers.filter(v => 
        v.voucherNo?.includes(todayDateStr)
      ).length;
    }
    
    return count || 0;
  } catch (e) {
    console.warn("Failed to get today's count from Supabase:", e);
    const vouchers = loadVouchersLocal();
    return vouchers.filter(v => 
      v.voucherNo?.includes(todayDateStr)
    ).length;
  }
};

// Parse voucher number
export const parseVoucherNumber = (voucherNo: string): { prefix: string; sequence: number; date: string } | null => {
  const match = voucherNo.match(/^JTE(\d+)(\d{6})$/);
  if (match) {
    return {
      prefix: 'JTE',
      sequence: parseInt(match[1]),
      date: match[2]
    };
  }
  return null;
};
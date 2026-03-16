// lib/voucher-storage.ts
import { VoucherData } from "./types";

const STORAGE_KEY = "travel_vouchers";

// Generate a unique ID
const generateId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 15);
  const randomStr2 = Math.random().toString(36).substring(2, 15);
  return `${timestamp}-${randomStr}${randomStr2}`;
};

// Generate a unique voucher number in format JTE + sequence + date (DDMMYY)
// Example: JTE1050626 (JTE + 1 + 050626)
export const generateVoucherNumber = (): string => {
  const date = new Date();
  
  // Format date as DDMMYY (e.g., 050626 for 5th June 2026)
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  const dateStr = `${day}${month}${year}`;
  
  // Get existing vouchers
  const vouchers = loadVouchers();
  
  // Filter vouchers that match the pattern JTE* + today's date
  const todayVouchers = vouchers.filter(v => {
    if (!v.voucherNo) return false;
    return v.voucherNo.includes(dateStr) && v.voucherNo.startsWith('JTE');
  });
  
  // Generate sequence number
  let nextSequence = 1;
  
  if (todayVouchers.length > 0) {
    const sequences = todayVouchers.map(v => {
      const match = v.voucherNo?.match(/JTE(\d)/);
      return match ? parseInt(match[1]) : 0;
    });
    nextSequence = Math.max(...sequences, 0) + 1;
  }
  
  return `JTE${nextSequence}${dateStr}`;
};

export const saveVoucher = (voucher: VoucherData): VoucherData => {
  const vouchers = loadVouchers();
  
  // Ensure voucher has an ID
  if (!voucher.id) {
    voucher.id = generateId();
  }
  
  // Ensure voucher has a number
  if (!voucher.voucherNo) {
    voucher.voucherNo = generateVoucherNumber();
  } else if (!voucher.voucherNo.startsWith('JTE')) {
    console.log('Voucher uses old format:', voucher.voucherNo);
  }
  
  // Ensure booking status is set (default to "book")
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
  
  const existingIndex = vouchers.findIndex(v => v.id === voucher.id);
  
  if (existingIndex >= 0) {
    vouchers[existingIndex] = { ...vouchers[existingIndex], ...voucher };
  } else {
    vouchers.push(voucher);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vouchers));
  return voucher;
};

export const updateBookingStatus = (id: string, status: "cancel" | "book" | "amend"): boolean => {
  const vouchers = loadVouchers();
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
};

export const loadVouchers = (): VoucherData[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const getVoucherById = (id: string): VoucherData | undefined => {
  const vouchers = loadVouchers();
  return vouchers.find(v => v.id === id);
};

export const cancelVoucher = (id: string): boolean => {
  const vouchers = loadVouchers();
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
};

export const deleteVoucher = (id: string): boolean => {
  const vouchers = loadVouchers();
  const filtered = vouchers.filter(v => v.id !== id);
  
  if (filtered.length !== vouchers.length) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }
  
  return false;
};

// Helper function to parse voucher number
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

// Helper function to get today's voucher count
export const getTodayVoucherCount = (): number => {
  const vouchers = loadVouchers();
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = String(today.getFullYear()).slice(-2);
  const todayDateStr = `${day}${month}${year}`;
  
  return vouchers.filter(v => 
    v.voucherNo?.includes(todayDateStr) && v.voucherNo?.startsWith('JTE')
  ).length;
};
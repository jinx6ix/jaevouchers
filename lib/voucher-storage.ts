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

// Generate a unique voucher number in format V-YYYYMMDD-XXXX
export const generateVoucherNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;
  
  // Get existing vouchers to determine the next sequence number
  const vouchers = loadVouchers();
  const todayVouchers = vouchers.filter(v => 
    v.voucherNo?.startsWith(`V-${dateStr}`)
  );
  
  // Generate sequence number (padded to 4 digits)
  const sequence = String(todayVouchers.length + 1).padStart(4, '0');
  
  return `V-${dateStr}-${sequence}`;
};

export const saveVoucher = (voucher: VoucherData): VoucherData => {
  const vouchers = loadVouchers();
  
  // Ensure voucher has an ID
  if (!voucher.id) {
    voucher.id = generateId();
  }
  
  // Ensure voucher has a number (for backwards compatibility)
  if (!voucher.voucherNo) {
    voucher.voucherNo = generateVoucherNumber();
  }
  
  // Ensure booking status is set
  if (!voucher.bookingStatus) {
    voucher.bookingStatus = "reserve";
  }
  
  // Add timestamps
  const now = new Date().toISOString();
  if (!voucher.createdAt) {
    voucher.createdAt = now;
  }
  voucher.updatedAt = now;
  
  const existingIndex = vouchers.findIndex(v => v.id === voucher.id);
  
  if (existingIndex >= 0) {
    // Update existing
    vouchers[existingIndex] = { ...vouchers[existingIndex], ...voucher };
  } else {
    // Add new
    vouchers.push(voucher);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vouchers));
  return voucher;
};

export const updateBookingStatus = (id: string, status: "reserve" | "book" | "amend"): boolean => {
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
import { ReactNode } from "react";

export interface VoucherData {
  customerName: ReactNode;
  id?: string;                     // ← added for identification
  status?: "draft" | "active" | "cancelled";  // ← added

  // Static / auto-filled
  voucherNo: string;
  date: string;
  companyName: string;

  // Hotel & Room info
  hotelName: string;
  roomType: string;

  // Room breakdown
  singles: number;
  twins: number;
  doubles: number;
  triples: number;
  extraBed?: number | string; // New field for extra bed

  // Guest info
  clients: ReactNode;              // can be string | JSX.Element
  adults: number;
  children: number;

  // Booking dates
  checkIn: string;
  checkOut: string;
  nights: number;

  // Remarks & Signature
  remarks: string;
  agentName: string;
  signedFor: string;
  signedName: string;

  // Optional timestamps (nice to have)
  createdAt?: string;
  updatedAt?: string;

  bookingStatus?: "reserve" | "book" | "amend";
}

export const defaultVoucherData: VoucherData = {
  status: "draft",
  voucherNo: "",
  date: new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }),
  companyName: "Jae Travel Expeditions",

  hotelName: "",
  roomType: "Standard Room FullBoard",

  singles: 0,
  twins: 0,
  doubles: 0,
  triples: 0,

  clients: "",
  adults: 0,
  children: 0,
  extraBed: 0, // Initialize extra bed as 0

  checkIn: "",
  checkOut: "",
  nights: 0,

  remarks: "",
  agentName: "",
  signedFor: "Jae Travel Expeditions",
  signedName: "",

  createdAt: undefined,
  updatedAt: undefined,
  customerName: undefined,
  bookingStatus: "reserve", // Default to reserve
};
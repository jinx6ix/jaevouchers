import { ReactNode } from "react";

export type VoucherType = "hotel" | "flight";

export interface VoucherData {
  customerName: ReactNode;
  id?: string;
  status?: "draft" | "active" | "cancelled";

  // Voucher type selector
  voucherType?: VoucherType;

  // Static / auto-filled
  voucherNo: string;
  date: string;
  companyName: string;

  // Hotel fields
  hotelName: string;
  roomType: string;

  // Room breakdown (hotel only)
  singles: number;
  twins: number;
  doubles: number;
  triples: number;
  extraBed?: number | string;

  // Flight fields
  flightName: string;
  flightSchedule: string;

  // Guest info
  clients: ReactNode;
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

  // Optional timestamps
  createdAt?: string;
  updatedAt?: string;

  bookingStatus?: "cancel" | "book" | "amend";
}

export const defaultVoucherData: VoucherData = {
  status: "draft",
  voucherType: "hotel",
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

  flightName: "",
  flightSchedule: "",

  clients: "",
  adults: 0,
  children: 0,
  extraBed: 0,

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
  bookingStatus: "book",
};

export const AGENTS_LIST = [
  "Antony Waititu",
  "Ian Iraya",
  "Maureen Chepkoech",
  "Dedan Kimathi"
];

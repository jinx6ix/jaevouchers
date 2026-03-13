import { ReactNode } from "react";

export interface VoucherData {
  // Static / auto-filled
  voucherNo: string;
  date: string;
  companyName: string;

  // Hotel & Room info
  hotelName: string;
  roomType: string;                    // e.g. "Standard Room FullBoard"

  // Room breakdown (numbers – this is what you asked for)
  singles: number;
  twins: number;
  doubles: number;
  triples: number;

  // Guest info
  clients: ReactNode;                  // e.g. "Amit Shirali"
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
}

export const defaultVoucherData: VoucherData = {
  voucherNo: "JTE1050626",
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

  checkIn: "",
  checkOut: "",
  nights: 0,

  remarks: "PLEASE NOTE CLIENT DIETARY REQUEST VEGETERIAN",
  agentName: "Antony Waititu",
  signedFor: "Jae Travel Expeditions",
  signedName: "Antony Waititu",
};
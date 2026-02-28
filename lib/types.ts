import { ReactNode } from "react";

export interface VoucherData {
    clients: ReactNode;
    adults: ReactNode;
    children: string;
    nights: ReactNode;
    agentName: string;
    // Black / static-ish
    companyName: string;
    voucherNo: string;
    date: string;
  
    // Red / user-editable
    hotelName: string;
    roomType: string;
    clientNames: string;
    noOfAdults: string;
    noOfChildren: string;
    checkIn: string;
    checkOut: string;
    noOfNights: string;
  
    // Room types
    doubles: string;
    twins: string;
    singles: string;
    triples: string;
  
    remarks: string;
  
    // Signature
    signedFor: string;
    signedName: string;
  }
  
  export const defaultVoucherData: VoucherData = {
      companyName: "Jae Travel Expeditions",
      voucherNo: "JTE1050626",
      date: new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
      }),

      hotelName: "",
      roomType: "Standard Room  Halfboard",
      clientNames: "",
      noOfAdults: "02 Adults",
      noOfChildren: "",
      checkIn: "",
      checkOut: "",
      noOfNights: "",

      doubles: "",
      twins: "",
      singles: "",
      triples: "",

      remarks: "PLEASE NOTE CLIENT DIETARY REQUEST  VEGETERIAN",

      signedFor: "Jae Travel Expeditions",
      signedName: "Antony Waititu",
      clients: undefined,
      adults: undefined,
      children: "",
      nights: undefined,
      agentName: ""
  };
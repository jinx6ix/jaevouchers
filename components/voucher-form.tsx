"use client";

import { VoucherData } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface Props {
  data: VoucherData;
  onChange: <K extends keyof VoucherData>(field: K, value: VoucherData[K]) => void;
  onReset: () => void;
}

export default function VoucherForm({ data, onChange, onReset }: Props) {
  const totalRooms = (data.singles || 0) + (data.twins || 0) + (data.doubles || 0) + (data.triples || 0);

  return (
    <div className="space-y-8">
      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">Voucher No</label>
          <input
            title="Voucher No"
            type="text"
            value={data.voucherNo}
            onChange={(e) => onChange("voucherNo", e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            title="Date"
            type="text"
            value={data.date}
            onChange={(e) => onChange("date", e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Hotel Name</label>
          <input
            type="text"
            value={data.hotelName}
            onChange={(e) => onChange("hotelName", e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Lake Nakuru Lodge"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Room Type (e.g. Standard Room FullBoard)</label>
          <input
            title="Room Type"
            type="text"
            value={data.roomType}
            onChange={(e) => onChange("roomType", e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Clients</label>
          <input
            type="text"
            value={String(data.clients || "")}
            onChange={(e) => onChange("clients", e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Amit Shirali"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">No. of Adults</label>
          <input
            title="No. of Adults"
            type="number"
            value={data.adults}
            onChange={(e) => onChange("adults", Number(e.target.value))}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">No. of Children (under 12)</label>
          <input
            title="No. of Children"
            type="number"
            value={data.children}
            onChange={(e) => onChange("children", Number(e.target.value))}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Check In</label>
          <input
            type="text"
            value={data.checkIn}
            onChange={(e) => onChange("checkIn", e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="24 June 2026"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Check Out</label>
          <input
            type="text"
            value={data.checkOut}
            onChange={(e) => onChange("checkOut", e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="25 June 2026"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Number of Nights</label>
          <input
            title="Number of Nights"
            type="number"
            value={data.nights}
            onChange={(e) => onChange("nights", Number(e.target.value))}
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>

      {/* ROOM TYPES SECTION - THIS IS WHAT YOU ASKED FOR */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Room Types</h3>
          <div className="text-sm font-medium text-gray-600">
            Total Rooms: <span className="text-red-600 font-bold">{totalRooms}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Singles</label>
            <input
              title="Singles"
              type="number"
              min="0"
              value={data.singles || 0}
              onChange={(e) => onChange("singles", Number(e.target.value))}
              className="w-full border rounded px-4 py-3 text-center text-xl font-semibold"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Twins</label>
            <input
              title="Twins"
              type="number"
              min="0"
              value={data.twins || 0}
              onChange={(e) => onChange("twins", Number(e.target.value))}
              className="w-full border rounded px-4 py-3 text-center text-xl font-semibold"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Doubles</label>
            <input
              title="Doubles"
              type="number"
              min="0"
              value={data.doubles || 0}
              onChange={(e) => onChange("doubles", Number(e.target.value))}
              className="w-full border rounded px-4 py-3 text-center text-xl font-semibold"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Triples</label>
            <input
              title="Triples"
              type="number"
              min="0"
              value={data.triples || 0}
              onChange={(e) => onChange("triples", Number(e.target.value))}
              className="w-full border rounded px-4 py-3 text-center text-xl font-semibold"
            />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Enter any combination of room types. Preview and PDF update instantly.
        </p>
      </div>

      {/* Remarks */}
      <div>
        <label className="block text-sm font-medium mb-1">Remarks</label>
        <textarea
          title="Remarks"
          value={data.remarks}
          onChange={(e) => onChange("remarks", e.target.value)}
          rows={3}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Reset Button */}
      <Button
        onClick={onReset}
        variant="outline"
        className="w-full"
      >
        Reset Form
      </Button>
    </div>
  );
}
"use client";

import { VoucherData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface Props {
  data: VoucherData;
  onChange: <K extends keyof VoucherData>(field: K, value: VoucherData[K]) => void;
  onReset: () => void;
  disabled?: boolean;
}

export default function VoucherForm({ data, onChange, onReset, disabled }: Props) {
  const [showExtraBed, setShowExtraBed] = useState(false);
  
  const totalRooms = (data.singles || 0) + (data.twins || 0) + (data.doubles || 0) + (data.triples || 0);

  // Check if children field has a value
  useEffect(() => {
    const hasChildren = data.children && parseInt(data.children.toString()) > 0;
    setShowExtraBed(!!hasChildren);
    
    // Reset extra bed if no children
    if (!hasChildren) {
      onChange("extraBed", 0);
    }
  }, [data.children, onChange]);

  const handleNumberChange = (field: keyof VoucherData, value: string) => {
    const numValue = value === "" ? 0 : parseInt(value);
    if (!isNaN(numValue)) {
      onChange(field, numValue);
    }
  };

  return (
    <div className="space-y-8">
      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">Voucher No</label>
          <input
            title="Voucher No"
            type="text"
            value={data.voucherNo || ""}
            onChange={(e) => onChange("voucherNo", e.target.value)}
            className="w-full border rounded px-3 py-2"
            disabled={disabled}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            title="Date"
            type="text"
            value={data.date || ""}
            onChange={(e) => onChange("date", e.target.value)}
            className="w-full border rounded px-3 py-2"
            disabled={disabled}
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Hotel Name</label>
          <input
            type="text"
            value={data.hotelName || ""}
            onChange={(e) => onChange("hotelName", e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Lake Nakuru Lodge"
            disabled={disabled}
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Room Type (e.g. Standard Room FullBoard)</label>
          <input
            title="Room Type"
            type="text"
            value={data.roomType || ""}
            onChange={(e) => onChange("roomType", e.target.value)}
            className="w-full border rounded px-3 py-2"
            disabled={disabled}
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
            disabled={disabled}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">No. of Adults</label>
          <input
            title="No. of Adults"
            type="number"
            min="0"
            value={data.adults || 0}
            onChange={(e) => handleNumberChange("adults", e.target.value)}
            className="w-full border rounded px-3 py-2"
            disabled={disabled}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">No. of Children (under 12)</label>
          <input
            title="No. of Children"
            type="number"
            min="0"
            value={data.children || 0}
            onChange={(e) => handleNumberChange("children", e.target.value)}
            className="w-full border rounded px-3 py-2"
            disabled={disabled}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Check In</label>
          <input
            type="text"
            value={data.checkIn || ""}
            onChange={(e) => onChange("checkIn", e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="24 June 2026"
            disabled={disabled}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Check Out</label>
          <input
            type="text"
            value={data.checkOut || ""}
            onChange={(e) => onChange("checkOut", e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="25 June 2026"
            disabled={disabled}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Number of Nights</label>
          <input
            title="Number of Nights"
            type="number"
            min="0"
            value={data.nights || 0}
            onChange={(e) => handleNumberChange("nights", e.target.value)}
            className="w-full border rounded px-3 py-2"
            disabled={disabled}
          />
        </div>
      </div>

      {/* ROOM TYPES SECTION */}
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
              onChange={(e) => handleNumberChange("singles", e.target.value)}
              className="w-full border rounded px-4 py-3 text-center text-xl font-semibold"
              disabled={disabled}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Twins</label>
            <input
              title="Twins"
              type="number"
              min="0"
              value={data.twins || 0}
              onChange={(e) => handleNumberChange("twins", e.target.value)}
              className="w-full border rounded px-4 py-3 text-center text-xl font-semibold"
              disabled={disabled}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Doubles</label>
            <input
              title="Doubles"
              type="number"
              min="0"
              value={data.doubles || 0}
              onChange={(e) => handleNumberChange("doubles", e.target.value)}
              className="w-full border rounded px-4 py-3 text-center text-xl font-semibold"
              disabled={disabled}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Triples</label>
            <input
              title="Triples"
              type="number"
              min="0"
              value={data.triples || 0}
              onChange={(e) => handleNumberChange("triples", e.target.value)}
              className="w-full border rounded px-4 py-3 text-center text-xl font-semibold"
              disabled={disabled}
            />
          </div>
        </div>

        {/* EXTRA BED - Conditionally shown when children > 0 */}
        {showExtraBed && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-blue-700">
                Extra Bed {data.children ? `(for ${data.children} child${parseInt(data.children.toString()) > 1 ? 'ren' : ''})` : ''}
              </label>
              <span className="text-xs text-blue-600 font-medium">Optional</span>
            </div>
            <input
              title="Extra Bed"
              type="number"
              min="0"
              max={data.children || 0}
              value={data.extraBed || 0}
              onChange={(e) => handleNumberChange("extraBed", e.target.value)}
              className="w-full border border-blue-300 rounded px-4 py-3 text-center text-xl font-semibold bg-white"
              placeholder="Number of extra beds"
              disabled={disabled}
            />
            <p className="text-xs text-blue-600 mt-2">
              ⓘ Extra beds are available for children. Maximum {data.children || 0} bed(s).
            </p>
          </div>
        )}

        <p className="text-xs text-gray-500 mt-3">
          Enter any combination of room types. Extra bed option appears when children are added.
        </p>
      </div>

      {/* Remarks */}
      <div>
        <label className="block text-sm font-medium mb-1">Remarks</label>
        <textarea
          title="Remarks"
          value={data.remarks || ""}
          onChange={(e) => onChange("remarks", e.target.value)}
          rows={3}
          className="w-full border rounded px-3 py-2"
          disabled={disabled}
        />
      </div>

      {/* Reset Button */}
      <Button
        onClick={onReset}
        variant="outline"
        className="w-full"
        disabled={disabled}
      >
        Reset Form
      </Button>
    </div>
  );
}
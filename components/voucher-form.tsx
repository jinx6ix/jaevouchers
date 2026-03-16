"use client";

import { VoucherData, AGENTS_LIST } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  }, [data.children]);

  // Handle extra bed reset in a separate effect
  useEffect(() => {
    const hasChildren = data.children && parseInt(data.children.toString()) > 0;
    const extraBedValue = typeof data.extraBed === 'string' ? parseInt(data.extraBed) || 0 : data.extraBed || 0;
    
    if (!hasChildren && extraBedValue > 0) {
      onChange("extraBed", 0);
    }
  }, [data.children, data.extraBed, onChange]);

  const handleNumberChange = (field: keyof VoucherData, value: string) => {
    const numValue = value === "" ? 0 : parseInt(value);
    if (!isNaN(numValue)) {
      onChange(field, numValue);
    }
  };

  // Helper function to get numeric value for display
  const getNumericValue = (value: string | number | undefined): number => {
    if (value === undefined || value === "") return 0;
    return typeof value === 'string' ? parseInt(value) || 0 : value;
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
            value={getNumericValue(data.adults)}
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
            value={getNumericValue(data.children)}
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
            value={getNumericValue(data.nights)}
            onChange={(e) => handleNumberChange("nights", e.target.value)}
            className="w-full border rounded px-3 py-2"
            disabled={disabled}
          />
        </div>

        {/* Agent Name Selection */}
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Prepared By (Agent)</label>
          <Select
            value={data.agentName || "Antony Waititu"}
            onValueChange={(value) => {
              onChange("agentName", value);
              // Also update signedName to match agent name
              onChange("signedName", value);
            }}
            disabled={disabled}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select agent" />
            </SelectTrigger>
            <SelectContent>
              {AGENTS_LIST.map((agent) => (
                <SelectItem key={agent} value={agent}>
                  {agent}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
              value={getNumericValue(data.singles)}
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
              value={getNumericValue(data.twins)}
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
              value={getNumericValue(data.doubles)}
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
              value={getNumericValue(data.triples)}
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
                Extra Bed {data.children ? `(for ${getNumericValue(data.children)} child${getNumericValue(data.children) > 1 ? 'ren' : ''})` : ''}
              </label>
              <span className="text-xs text-blue-600 font-medium">Optional</span>
            </div>
            <input
              title="Extra Bed"
              type="number"
              min="0"
              max={getNumericValue(data.children)}
              value={getNumericValue(data.extraBed)}
              onChange={(e) => handleNumberChange("extraBed", e.target.value)}
              className="w-full border border-blue-300 rounded px-4 py-3 text-center text-xl font-semibold bg-white"
              placeholder="Number of extra beds"
              disabled={disabled}
            />
            <p className="text-xs text-blue-600 mt-2">
              ⓘ Extra beds are available for children. Maximum {getNumericValue(data.children)} bed(s).
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
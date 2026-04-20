"use client";

import { VoucherData, VoucherType, AGENTS_LIST } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Hotel, Plane } from "lucide-react";

interface Props {
  data: VoucherData;
  onChange: <K extends keyof VoucherData>(field: K, value: VoucherData[K]) => void;
  onReset: () => void;
  disabled?: boolean;
}

export default function VoucherForm({ data, onChange, onReset, disabled }: Props) {
  const [showExtraBed, setShowExtraBed] = useState(false);

  const isHotel = (data.voucherType ?? "hotel") === "hotel";
  const totalRooms = (data.singles || 0) + (data.twins || 0) + (data.doubles || 0) + (data.triples || 0);

  useEffect(() => {
    const hasChildren = data.children && parseInt(data.children.toString()) > 0;
    setShowExtraBed(!!hasChildren);
  }, [data.children]);

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

  const getNumericValue = (value: string | number | undefined): number => {
    if (value === undefined || value === "") return 0;
    return typeof value === 'string' ? parseInt(value) || 0 : value;
  };

  const handleTypeSwitch = (type: VoucherType) => {
    onChange("voucherType", type);
  };

  return (
    <div className="space-y-8">

      {/* Voucher Type Toggle */}
      <div>
        <label className="block text-sm font-medium mb-2">Voucher Type</label>
        <div className="flex rounded-lg border overflow-hidden">
          <button
            type="button"
            onClick={() => handleTypeSwitch("hotel")}
            disabled={disabled}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-medium transition-colors ${
              isHotel
                ? "bg-amber-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Hotel className="h-4 w-4" />
            Hotel Voucher
          </button>
          <button
            type="button"
            onClick={() => handleTypeSwitch("flight")}
            disabled={disabled}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-medium transition-colors border-l ${
              !isHotel
                ? "bg-sky-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Plane className="h-4 w-4" />
            Flight Voucher
          </button>
        </div>
      </div>

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

        {/* Hotel fields */}
        {isHotel && (
          <>
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
          </>
        )}

        {/* Flight fields */}
        {!isHotel && (
          <>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Airline / Flight Name</label>
              <input
                type="text"
                value={data.flightName || ""}
                onChange={(e) => onChange("flightName", e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="Kenya Airways KQ 100"
                disabled={disabled}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Flight Schedule</label>
              <input
                type="text"
                value={data.flightSchedule || ""}
                onChange={(e) => onChange("flightSchedule", e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="Nairobi (NBO) → Mombasa (MBA) | Dep. 08:00 – Arr. 09:05"
                disabled={disabled}
              />
            </div>
          </>
        )}

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
          <label className="block text-sm font-medium mb-1">{isHotel ? "Check In" : "Departure Date"}</label>
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
          <label className="block text-sm font-medium mb-1">{isHotel ? "Check Out" : "Return Date"}</label>
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
          <label className="block text-sm font-medium mb-1">{isHotel ? "Number of Nights" : "Number of Days"}</label>
          <input
            title="Nights / Days"
            type="number"
            min="0"
            value={getNumericValue(data.nights)}
            onChange={(e) => handleNumberChange("nights", e.target.value)}
            className="w-full border rounded px-3 py-2"
            disabled={disabled}
          />
        </div>

        {/* Agent */}
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Prepared By (Agent)</label>
          <Select
            value={data.agentName || "Antony Waititu"}
            onValueChange={(value) => {
              onChange("agentName", value);
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

      {/* ROOM TYPES — Hotel only */}
      {isHotel && (
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
      )}

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

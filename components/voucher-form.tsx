"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { VoucherData } from "@/lib/types";

interface VoucherFormProps {
  data: VoucherData;
  onChange: (field: keyof VoucherData, value: string) => void;
  onReset: () => void;
}

export default function VoucherForm({ data, onChange, onReset }: VoucherFormProps) {
  const [dateOpen, setDateOpen] = useState(false);
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [checkOutOpen, setCheckOutOpen] = useState(false);

  // Helper: restrict to digits only (for numbers fields)
  const handleNumberChange = (field: keyof VoucherData, value: string) => {
    const digitsOnly = value.replace(/[^0-9]/g, "");
    onChange(field, digitsOnly);
  };

  // Helper: restrict to letters & spaces only (for names)
  const handleAlphaChange = (field: keyof VoucherData, value: string) => {
    const lettersOnly = value.replace(/[^A-Za-z\s]/g, "");
    onChange(field, lettersOnly);
  };

  const handleDownload = async () => {
    // ... (keep your existing download logic - omitted for brevity)
    // Use data.voucherNo, data.date, etc.
  };

  return (
    <form className="space-y-6">
      {/* Voucher Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-red-600">Voucher Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="voucherNo" className="text-red-600 font-semibold">
              Voucher No *
            </Label>
            <Input
              id="voucherNo"
              placeholder="e.g. V2025-078"
              value={data.voucherNo || ""}
              onChange={(e) => onChange("voucherNo", e.target.value)}
              className="mt-1 border-red-300 focus:border-red-500"
            />
          </div>
          <div>
            <Label htmlFor="date" className="text-red-600 font-semibold">
              Date *
            </Label>
            <Popover open={dateOpen} onOpenChange={setDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full mt-1 justify-start text-left font-normal border-red-300",
                    !data.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {data.date || <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={data.date ? new Date(data.date) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      onChange("date", format(date, "dd MMMM yyyy"));
                    }
                    setDateOpen(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Hotel Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-red-600">Hotel Details</h3>
        <div>
          <Label htmlFor="hotelName" className="text-red-600 font-semibold">
            Hotel Name *
          </Label>
          <Input
            id="hotelName"
            placeholder="e.g. Golden Tulip"
            value={data.hotelName || ""}
            onChange={(e) => onChange("hotelName", e.target.value)}
            className="mt-1 border-red-300 focus:border-red-500"
          />
        </div>
        <div>
          <Label htmlFor="roomType" className="text-red-600 font-semibold">
            Room Type *
          </Label>
          <Input
            id="roomType"
            placeholder="e.g. Standard Room Halfboard"
            value={data.roomType || ""}
            onChange={(e) => onChange("roomType", e.target.value)}
            className="mt-1 border-red-300 focus:border-red-500"
          />
        </div>
      </div>

      {/* Client Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-red-600">Client Information</h3>
        <div>
          <Label htmlFor="clients" className="text-red-600 font-semibold">
            Clients / Guest Names *
          </Label>
          <Input
            id="clients"
            placeholder="e.g. Niranjana Sundaram x2, Family Smith"
            value={data.clients || ""}
            onChange={(e) => handleAlphaChange("clients", e.target.value)}
            className="mt-1 border-red-300 focus:border-red-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="adults" className="text-red-600 font-semibold">
              No. of Adults
            </Label>
            <Input
              id="adults"
              placeholder="e.g. 2"
              value={data.adults || ""}
              onChange={(e) => handleNumberChange("adults", e.target.value)}
              inputMode="numeric"
              pattern="[0-9]*"
              className="mt-1 border-red-300 focus:border-red-500"
            />
          </div>
          <div>
            <Label htmlFor="children" className="text-red-600 font-semibold">
              No. of Children (under 12)
            </Label>
            <Input
              id="children"
              placeholder="e.g. 1"
              value={data.children || ""}
              onChange={(e) => handleNumberChange("children", e.target.value)}
              inputMode="numeric"
              pattern="[0-9]*"
              className="mt-1 border-red-300 focus:border-red-500"
            />
          </div>
        </div>
      </div>

      {/* Travel Dates */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-red-600">Travel Dates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="checkIn" className="text-red-600 font-semibold">
              Check In *
            </Label>
            <Popover open={checkInOpen} onOpenChange={setCheckInOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full mt-1 justify-start text-left font-normal border-red-300",
                    !data.checkIn && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {data.checkIn || <span>Pick check-in date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={data.checkIn ? new Date(data.checkIn) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      onChange("checkIn", format(date, "dd MMMM yyyy"));
                    }
                    setCheckInOpen(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="checkOut" className="text-red-600 font-semibold">
              Check Out *
            </Label>
            <Popover open={checkOutOpen} onOpenChange={setCheckOutOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full mt-1 justify-start text-left font-normal border-red-300",
                    !data.checkOut && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {data.checkOut || <span>Pick check-out date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={data.checkOut ? new Date(data.checkOut) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      onChange("checkOut", format(date, "dd MMMM yyyy"));
                    }
                    setCheckOutOpen(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div>
          <Label htmlFor="nights" className="text-red-600 font-semibold">
            Number of Nights *
          </Label>
          <Input
            id="nights"
            placeholder="e.g. 3"
            value={data.nights || ""}
            onChange={(e) => handleNumberChange("nights", e.target.value)}
            inputMode="numeric"
            pattern="[0-9]*"
            className="mt-1 border-red-300 focus:border-red-500"
          />
        </div>
      </div>

      {/* Room Configuration */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-red-600">Room Configuration</h3>
        <div>
          <Label htmlFor="doubles" className="text-red-600 font-semibold">
            Number of Double Rooms
          </Label>
          <Input
            id="doubles"
            placeholder="e.g. 1"
            value={data.doubles || ""}
            onChange={(e) => handleNumberChange("doubles", e.target.value)}
            inputMode="numeric"
            pattern="[0-9]*"
            className="mt-1 border-red-300 focus:border-red-500"
          />
        </div>
      </div>

      {/* Remarks */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-red-600">Additional Information</h3>
        <div>
          <Label htmlFor="remarks" className="text-red-600 font-semibold">
            Remarks / Special Requests
          </Label>
          <Textarea
            id="remarks"
            placeholder="e.g. PLEASE NOTE CLIENT DIETARY REQUEST VEGETARIAN"
            value={data.remarks || ""}
            onChange={(e) => onChange("remarks", e.target.value)}
            className="mt-1 border-red-300 focus:border-red-500"
            rows={3}
          />
        </div>
      </div>

      {/* Prepared By */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-red-600">Prepared By</h3>
        <div>
          <Label htmlFor="agentName" className="text-red-600 font-semibold">
            Agent Name
          </Label>
          <Input
            id="agentName"
            placeholder="e.g. Antony Waititu"
            value={data.agentName || ""}
            onChange={(e) => handleAlphaChange("agentName", e.target.value)}
            className="mt-1 border-red-300 focus:border-red-500"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-6">
        <Button type="button" variant="outline" onClick={onReset} className="flex-1">
          Reset Form
        </Button>
        <Button
          type="button"
          onClick={() => window.print()}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          Print Voucher
        </Button>
        <Button
          type="button"
          onClick={handleDownload}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          Download PDF
        </Button>
      </div>
    </form>
  );
}
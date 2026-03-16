"use client";

import { useState, useEffect } from "react";
import { loadVouchers } from "@/lib/voucher-storage";
import { VoucherData } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, Edit, Eye } from "lucide-react";

interface Props {
  onSelectVoucher?: (voucher: VoucherData) => void;
}

export default function VoucherList({ onSelectVoucher }: Props) {
  const [vouchers, setVouchers] = useState<VoucherData[]>([]);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVoucher, setSelectedVoucher] = useState<VoucherData | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const refreshList = () => {
    const data = loadVouchers();
    // Sort by most recent first
    const sorted = data.sort((a, b) => {
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
    setVouchers(sorted);
    console.log("Loaded vouchers:", sorted);
  };

  useEffect(() => {
    if (open) {
      refreshList();
    }
  }, [open]);

  const handleSelectVoucher = (voucher: VoucherData) => {
    if (voucher.status === "cancelled") {
      alert("Cannot edit a cancelled voucher");
      return;
    }
    
    if (onSelectVoucher) {
      onSelectVoucher(voucher);
      setOpen(false);
    }
  };

  const handleViewVoucher = (voucher: VoucherData) => {
    setSelectedVoucher(voucher);
    setViewDialogOpen(true);
  };

  const handleAmendFromView = () => {
    if (selectedVoucher && onSelectVoucher) {
      onSelectVoucher(selectedVoucher);
      setViewDialogOpen(false);
      setOpen(false);
    }
  };

  // Helper function to safely convert to string for search
  const safeToString = (value: any): string => {
    if (value === null || value === undefined) return "";
    return String(value).toLowerCase();
  };

  const filteredVouchers = vouchers.filter(v => {
    const searchLower = searchTerm.toLowerCase();
    
    // Safely convert each field to string for comparison
    return (
      safeToString(v.voucherNo).includes(searchLower) ||
      safeToString(v.clients).includes(searchLower) ||
      safeToString(v.hotelName).includes(searchLower) ||
      safeToString(v.agentName).includes(searchLower)
    );
  });

  return (
    <>
      <Button 
        onClick={() => setOpen(true)} 
        variant="outline" 
        className="w-full"
      >
        <Eye className="mr-2 h-4 w-4" />
        View Saved Vouchers ({vouchers.length})
      </Button>

      {/* Main Voucher List Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Saved Vouchers ({filteredVouchers.length})</DialogTitle>
            <DialogDescription>
              Click on any voucher to load it for editing, or click the view button to see details.
            </DialogDescription>
          </DialogHeader>

          {/* Search Bar */}
          <div className="relative my-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search by voucher #, client, hotel, or agent..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          {/* Voucher List */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {filteredVouchers.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No vouchers found</p>
            ) : (
              filteredVouchers.map((v) => (
                <Card 
                  key={v.id} 
                  className={`p-4 hover:shadow-md transition-shadow ${
                    v.status === "cancelled" ? "opacity-60 bg-red-50" : "cursor-pointer hover:border-blue-300"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div 
                      className="flex-1"
                      onClick={() => v.status !== "cancelled" && handleSelectVoucher(v)}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-bold text-lg">#{v.voucherNo}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          v.status === "cancelled" 
                            ? "bg-red-200 text-red-800" 
                            : "bg-green-100 text-green-800"
                        }`}>
                          {v.status === "cancelled" ? "CANCELLED" : "ACTIVE"}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          v.bookingStatus === "book" 
                            ? "bg-green-100 text-green-800"
                            : v.bookingStatus === "amend"
                            ? "bg-orange-100 text-orange-800"
                            : v.bookingStatus === "cancel"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {v.bookingStatus?.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><span className="text-gray-500">Client:</span> {v.clients || "—"}</div>
                        <div><span className="text-gray-500">Hotel:</span> {v.hotelName || "—"}</div>
                        <div><span className="text-gray-500">Agent:</span> {v.agentName || "—"}</div>
                        <div><span className="text-gray-500">Date:</span> {v.date || "—"}</div>
                      </div>
                      
                      <div className="text-xs text-gray-400 mt-2">
                        Created: {v.createdAt ? new Date(v.createdAt).toLocaleString() : "Unknown"}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewVoucher(v)}
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {v.status !== "cancelled" && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleSelectVoucher(v)}
                          title="Edit voucher"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Voucher Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Voucher Details - #{selectedVoucher?.voucherNo}</DialogTitle>
          </DialogHeader>
          
          {selectedVoucher && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Voucher Number</p>
                  <p className="text-lg font-bold">{selectedVoucher.voucherNo}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p>{selectedVoucher.date}</p>
                </div>
                
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-500">Client</p>
                  <p>{selectedVoucher.clients || "—"}</p>
                </div>
                
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-500">Hotel</p>
                  <p>{selectedVoucher.hotelName || "—"}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Room Type</p>
                  <p>{selectedVoucher.roomType || "—"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Agent</p>
                  <p>{selectedVoucher.agentName || "—"}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Adults</p>
                  <p>{selectedVoucher.adults || "0"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Children</p>
                  <p>{selectedVoucher.children || "0"}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Check In</p>
                  <p>{selectedVoucher.checkIn || "—"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Check Out</p>
                  <p>{selectedVoucher.checkOut || "—"}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Nights</p>
                  <p>{selectedVoucher.nights || "0"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <div className="flex gap-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      selectedVoucher.status === "cancelled" 
                        ? "bg-red-200 text-red-800" 
                        : "bg-green-100 text-green-800"
                    }`}>
                      {selectedVoucher.status === "cancelled" ? "CANCELLED" : "ACTIVE"}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      selectedVoucher.bookingStatus === "book" 
                        ? "bg-green-100 text-green-800"
                        : selectedVoucher.bookingStatus === "amend"
                        ? "bg-orange-100 text-orange-800"
                        : selectedVoucher.bookingStatus === "cancel"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {selectedVoucher.bookingStatus?.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Room Types */}
              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-500 mb-2">Room Types</p>
                <div className="grid grid-cols-4 gap-2">
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <p className="text-xs text-gray-500">Singles</p>
                    <p className="text-lg font-bold">{selectedVoucher.singles || "0"}</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <p className="text-xs text-gray-500">Twins</p>
                    <p className="text-lg font-bold">{selectedVoucher.twins || "0"}</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <p className="text-xs text-gray-500">Doubles</p>
                    <p className="text-lg font-bold">{selectedVoucher.doubles || "0"}</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <p className="text-xs text-gray-500">Triples</p>
                    <p className="text-lg font-bold">{selectedVoucher.triples || "0"}</p>
                  </div>
                </div>
                {selectedVoucher.extraBed && parseInt(selectedVoucher.extraBed.toString()) > 0 && (
                  <div className="mt-2 p-2 bg-blue-50 rounded">
                    <p className="text-sm">
                      <span className="font-medium">Extra Bed:</span> {selectedVoucher.extraBed} 
                      <span className="text-xs text-gray-600 ml-2">
                        (for {selectedVoucher.children} child{parseInt(selectedVoucher.children?.toString() || "0") > 1 ? 'ren' : ''})
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* Remarks */}
              {selectedVoucher.remarks && (
                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-gray-500">Remarks</p>
                  <p className="mt-1 p-2 bg-gray-50 rounded">{selectedVoucher.remarks}</p>
                </div>
              )}

              {/* Timestamps */}
              <div className="border-t pt-4 text-xs text-gray-400">
                <p>Created: {selectedVoucher.createdAt ? new Date(selectedVoucher.createdAt).toLocaleString() : "Unknown"}</p>
                <p>Last Updated: {selectedVoucher.updatedAt ? new Date(selectedVoucher.updatedAt).toLocaleString() : "Unknown"}</p>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
            {selectedVoucher?.status !== "cancelled" && (
              <Button 
                onClick={handleAmendFromView}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Edit className="mr-2 h-4 w-4" />
                Amend This Voucher
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
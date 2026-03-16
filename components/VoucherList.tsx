// components/VoucherList.tsx
"use client";

import { useState, useEffect } from "react";
import { loadVouchers } from "@/lib/voucher-storage";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function VoucherList() {
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  const refreshList = () => {
    const data = loadVouchers();
    setVouchers(data);
    console.log("Loaded vouchers:", data);
  };

  useEffect(() => {
    if (open) {
      refreshList();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">View Saved Vouchers ({vouchers.length})</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Saved Vouchers ({vouchers.length})</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Button onClick={refreshList} size="sm" variant="outline">Refresh</Button>
          
          {vouchers.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No vouchers saved yet</p>
          ) : (
            vouchers.map((v) => (
              <Card key={v.id} className="p-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><strong>Voucher #:</strong> {v.voucherNo}</div>
                  <div><strong>Date:</strong> {v.date}</div>
                  <div><strong>Client:</strong> {v.clients}</div>
                  <div><strong>Hotel:</strong> {v.hotelName}</div>
                  <div><strong>Status:</strong> 
                    <span className={`ml-2 px-2 py-0.5 rounded ${
                      v.bookingStatus === "book" ? "bg-green-100 text-green-800" :
                      v.bookingStatus === "amend" ? "bg-orange-100 text-orange-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {v.bookingStatus}
                    </span>
                  </div>
                  <div><strong>ID:</strong> {v.id?.slice(0, 8)}...</div>
                </div>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
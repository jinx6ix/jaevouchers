"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Download, Loader2, Printer, Plus, Pencil, Ban, Search } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";

import VoucherForm from "@/components/voucher-form";
import VoucherPreview from "@/components/VoucherPreview";
import VoucherPDF from "@/components/voucherPDF";

import { VoucherData, defaultVoucherData } from "@/lib/types";
import {
  saveVoucher,
  cancelVoucher,
  loadVouchers,
  updateBookingStatus,
  generateVoucherNumber,
} from "@/lib/voucher-storage";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import VoucherList from "@/components/VoucherList";

export default function VoucherGenerator() {
  const [data, setData] = useState<VoucherData>(defaultVoucherData);
  const [downloading, setDownloading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [searchVoucherNo, setSearchVoucherNo] = useState("");
  const [searchResults, setSearchResults] = useState<VoucherData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const previewRef = useRef<HTMLDivElement>(null);

  // Generate a unique ID for new vouchers
  const generateUniqueId = useCallback((): string => {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 10);
    return `${timestamp}-${randomStr}`;
  }, []);

  // Initialize new voucher with unique ID and voucher number added flight voucher generator
  const initializeNewVoucher = useCallback(async (): Promise<VoucherData> => {
    const newVoucherNumber = await generateVoucherNumber();
    return {
      ...defaultVoucherData,
      id: generateUniqueId(),
      voucherNo: newVoucherNumber,
      date: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      status: "active",
      bookingStatus: "book",
      agentName: "Antony Waititu",
      signedName: "Antony Waititu",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }, [generateUniqueId]);

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const vouchers = await loadVouchers();
        if (vouchers.length > 0) {
          const last = vouchers[vouchers.length - 1];
          if (last.status !== "cancelled") {
            setData(last);
            setCurrentId(last.id ?? null);
            setIsEditing(!!last.id);
          }
        } else {
          await handleNew();
        }
      } catch (error) {
        console.error("Error loading initial data:", error);
        toast({
          title: "Error loading data",
          description: "Failed to load vouchers. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInitialData();
  }, []);

  const update = useCallback(<K extends keyof VoucherData>(
    field: K,
    value: VoucherData[K]
  ) => {
    setData((prev) => ({ ...prev, [field]: value, updatedAt: new Date().toISOString() }));
  }, []);

  const handleNew = useCallback(async () => {
    setIsLoading(true);
    try {
      const newVoucher = await initializeNewVoucher();
      setData(newVoucher);
      setCurrentId(newVoucher.id!);
      setIsEditing(false);
      toast({ 
        title: "New voucher started", 
        description: `Voucher #${newVoucher.voucherNo} (Prepared by: ${newVoucher.agentName})` 
      });
    } catch (error) {
      toast({
        title: "Error creating voucher",
        description: "Failed to create new voucher. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [initializeNewVoucher, toast]);

  const handleAmend = useCallback((voucher: VoucherData) => {
    setData(voucher);
    setCurrentId(voucher.id ?? null);
    setIsEditing(true);
    setSearchDialogOpen(false);
    setSearchVoucherNo("");
    setSearchResults([]);
    toast({ 
      title: "Voucher loaded for editing", 
      description: `Voucher #${voucher.voucherNo} (Prepared by: ${voucher.agentName || "Unknown"})` 
    });
  }, [toast]);

  const handleSearchVoucher = useCallback(async () => {
    if (!searchVoucherNo.trim()) {
      toast({ 
        title: "Please enter a voucher number", 
        variant: "destructive" 
      });
      return;
    }

    setIsLoading(true);
    try {
      const vouchers = await loadVouchers();
      const results = vouchers.filter(v => 
        v.voucherNo?.toLowerCase().includes(searchVoucherNo.toLowerCase())
      );
      
      setSearchResults(results);
      
      if (results.length === 0) {
        toast({ 
          title: "No vouchers found", 
          description: `No voucher matching "${searchVoucherNo}"` 
        });
      }
    } catch (error) {
      toast({
        title: "Search failed",
        description: "Failed to search vouchers. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [searchVoucherNo, toast]);

  const handleSave = useCallback(async () => {
    if (!data.voucherNo?.trim()) {
      toast({ title: "Voucher number is required", variant: "destructive" });
      return;
    }

    if (!data.id) {
      data.id = generateUniqueId();
    }
  
    setIsLoading(true);
    try {
      // Check for duplicates
      const vouchers = await loadVouchers();
      const duplicate = vouchers.find(
        v => v.voucherNo === data.voucherNo && v.id !== currentId
      );
    
      if (duplicate) {
        if (!confirm(`Voucher number ${data.voucherNo} is already used by another record.\n\nOverwrite number?`)) {
          setIsLoading(false);
          return;
        }
      }

      // Ensure signedName matches agentName if not set
      if (!data.signedName && data.agentName) {
        data.signedName = data.agentName;
      }

      const dataToSave = {
        ...data,
        updatedAt: new Date().toISOString()
      };

      const saved = await saveVoucher(dataToSave);
      setData(saved);
      setCurrentId(saved.id!);
      setIsEditing(true);
      toast({
        title: isEditing ? "Voucher updated" : "Voucher saved",
        description: `Voucher #${saved.voucherNo} (Prepared by: ${saved.agentName})`,
      });
    } catch (err) {
      toast({
        title: "Save failed",
        description: String(err),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [data, currentId, isEditing, generateUniqueId, toast]);

  const handleBookingStatusChange = useCallback(async (status: "cancel" | "book" | "amend") => {
    setData(prev => ({ ...prev, bookingStatus: status, updatedAt: new Date().toISOString() }));
    
    if (currentId) {
      setIsLoading(true);
      try {
        const success = await updateBookingStatus(currentId, status);
        if (success) {
          toast({ 
            title: `Status updated to ${status.charAt(0).toUpperCase() + status.slice(1)}`, 
            description: `Voucher #${data.voucherNo} is now ${status === "book" ? "confirmed" : status}`
          });
        } else {
          toast({
            title: "Status update failed",
            description: "Failed to update status. Please try again.",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Status update failed",
          description: "An error occurred while updating status.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  }, [currentId, data.voucherNo, toast]);

  const handleCancel = useCallback(async () => {
    if (!currentId) {
      toast({ 
        title: "No voucher selected", 
        description: "Please select a voucher to cancel",
        variant: "destructive" 
      });
      return;
    }
    
    if (!confirm(`Are you sure you want to cancel voucher #${data.voucherNo}?`)) return;

    setIsLoading(true);
    try {
      const success = await cancelVoucher(currentId);
      if (success) {
        setData(prev => ({ ...prev, status: "cancelled" }));
        toast({ 
          title: "Voucher cancelled successfully", 
          description: `Voucher #${data.voucherNo} has been cancelled` 
        });
      } else {
        toast({ title: "Could not cancel voucher", variant: "destructive" });
      }
    } catch (error) {
      toast({
        title: "Cancel failed",
        description: "An error occurred while cancelling the voucher.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentId, data.voucherNo, toast]);

  const handleDownload = useCallback(async () => {
    setDownloading(true);
    try {
      const blob = await pdf(<VoucherPDF data={data} />).toBlob();
      saveAs(blob, `voucher-${data.voucherNo || "unnamed"}.pdf`);
      toast({ title: "PDF downloaded", description: `Voucher #${data.voucherNo}` });
    } catch (err) {
      console.error(err);
      toast({
        title: "PDF generation failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setDownloading(false);
    }
  }, [data, toast]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const isCancelled = data.status === "cancelled";

  return (
    <>
      <style jsx global>{`
        @media print {
          @page { size: A4 portrait; margin: 8mm 10mm; }
          html, body { margin: 0 !important; padding: 0 !important; height: 100% !important; background: white !important; }
          body > *:not(#print-content-wrapper) { display: none !important; }
          #print-content-wrapper { display: block !important; width: 210mm !important; height: 297mm !important; margin: 0 auto !important; background: white !important; }
          .no-print { display: none !important; }
        }
        #print-content-wrapper { display: none; }
      `}</style>

      <div id="print-content-wrapper" className="no-print">
        <div id="printable-voucher" ref={previewRef}>
          <VoucherPreview data={data} />
        </div>
      </div>

      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 md:p-10 print:hidden">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Travel Voucher Generator
          </h1>

          <div className="flex flex-wrap gap-3 mb-6">
            <Button onClick={handleNew} variant="outline" disabled={isLoading}>
              <Plus className="mr-2 h-4 w-4" />
              New Voucher
            </Button>

            <Dialog open={searchDialogOpen} onOpenChange={setSearchDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="bg-blue-50 hover:bg-blue-100" disabled={isLoading}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Amend Voucher
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Find Voucher to Amend</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="search">Voucher Number</Label>
                    <div className="flex gap-2">
                      <Input
                        id="search"
                        placeholder="Enter voucher number..."
                        value={searchVoucherNo}
                        onChange={(e) => setSearchVoucherNo(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearchVoucher()}
                        disabled={isLoading}
                      />
                      <Button onClick={handleSearchVoucher} disabled={isLoading}>
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  {searchResults.length > 0 && (
                    <div className="space-y-2">
                      <Label>Results ({searchResults.length} found)</Label>
                      <div className="max-h-60 overflow-y-auto space-y-2">
                        {searchResults.map((voucher) => (
                          <Card
                            key={voucher.id}
                            className={`p-3 cursor-pointer hover:bg-slate-50 transition-colors ${
                              voucher.status === "cancelled" ? "opacity-60" : ""
                            }`}
                            onClick={() => voucher.status !== "cancelled" && handleAmend(voucher)}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">#{voucher.voucherNo}</p>
                                <p className="text-sm text-slate-600">
                                  {voucher.clients || "No client"} - {voucher.date}
                                </p>
                                <div className="flex flex-col gap-1 mt-1">
                                  <div className="flex gap-2">
                                    <span className={`text-xs px-2 py-0.5 rounded ${
                                      voucher.status === "cancelled" 
                                        ? "bg-red-100 text-red-800" 
                                        : "bg-green-100 text-green-800"
                                    }`}>
                                      {voucher.status === "cancelled" ? "Cancelled" : "Active"}
                                    </span>
                                    <span className={`text-xs px-2 py-0.5 rounded ${
                                      voucher.bookingStatus === "book" 
                                        ? "bg-green-100 text-green-800"
                                        : voucher.bookingStatus === "amend"
                                        ? "bg-orange-100 text-orange-800"
                                        : voucher.bookingStatus === "cancel"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-gray-100 text-gray-800"
                                    }`}>
                                      {voucher.bookingStatus ? 
                                        voucher.bookingStatus.charAt(0).toUpperCase() + voucher.bookingStatus.slice(1) 
                                        : "Book"}
                                    </span>
                                  </div>
                                  <span className="text-xs text-gray-500">
                                    Agent: {voucher.agentName || "Unknown"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            <Button
              onClick={handleSave}
              disabled={isCancelled || downloading || isLoading}
              className="bg-amber-600 hover:bg-amber-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : isEditing ? (
                <>
                  <Pencil className="mr-2 h-4 w-4" />
                  Update Voucher #{data.voucherNo}
                </>
              ) : (
                "Save Voucher"
              )}
            </Button>

            {isEditing && !isCancelled && (
              <div className="flex gap-2 ml-2">
                <Button
                  variant={data.bookingStatus === "book" ? "default" : "outline"}
                  onClick={() => handleBookingStatusChange("book")}
                  className={data.bookingStatus === "book" ? "bg-green-600 hover:bg-green-700" : ""}
                  size="sm"
                  disabled={isLoading}
                >
                  Book
                </Button>
                <Button
                  variant={data.bookingStatus === "amend" ? "default" : "outline"}
                  onClick={() => handleBookingStatusChange("amend")}
                  className={data.bookingStatus === "amend" ? "bg-orange-600 hover:bg-orange-700" : ""}
                  size="sm"
                  disabled={isLoading}
                >
                  Amend
                </Button>
                <Button
                  variant={data.bookingStatus === "cancel" ? "default" : "outline"}
                  onClick={() => handleBookingStatusChange("cancel")}
                  className={data.bookingStatus === "cancel" ? "bg-red-600 hover:bg-red-700" : ""}
                  size="sm"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            )}

            {isEditing && !isCancelled && (
              <Button
                variant="destructive"
                onClick={handleCancel}
                disabled={downloading || isLoading}
              >
                <Ban className="mr-2 h-4 w-4" />
                Cancel Voucher #{data.voucherNo}
              </Button>
            )}

            {isCancelled && (
              <div className="inline-flex items-center px-4 py-2 bg-red-100 text-red-800 rounded-md font-medium">
                CANCELLED #{data.voucherNo}
              </div>
            )}
          </div>

          {currentId && (
            <div className="mb-4 flex flex-wrap gap-4 items-center">
              <div className="text-sm text-slate-500 flex gap-4">
                <span>Voucher #: <span className="font-mono bg-slate-100 px-2 py-1 rounded">{data.voucherNo}</span></span>
                <span>ID: <span className="font-mono bg-slate-100 px-2 py-1 rounded">{currentId.slice(0, 8)}...</span></span>
                <span>Agent: <span className="font-mono bg-slate-100 px-2 py-1 rounded">{data.agentName || "Antony Waititu"}</span></span>
              </div>
              <div className="flex gap-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  data.status === "cancelled" 
                    ? "bg-red-100 text-red-800" 
                    : "bg-green-100 text-green-800"
                }`}>
                  {data.status === "cancelled" ? "Cancelled" : "Active"}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  data.bookingStatus === "book" 
                    ? "bg-green-100 text-green-800"
                    : data.bookingStatus === "amend"
                    ? "bg-orange-100 text-orange-800"
                    : data.bookingStatus === "cancel"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
                }`}>
                  {data.bookingStatus ? 
                    data.bookingStatus.charAt(0).toUpperCase() + data.bookingStatus.slice(1) 
                    : "Book"}
                </span>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="p-6 shadow-lg">
              <h2 className="text-2xl font-semibold mb-6">Voucher Details</h2>
              <VoucherForm
                data={data}
                onChange={update}
                onReset={handleNew}
                disabled={isCancelled || isLoading}
              />
            </Card>

            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-semibold">Preview</h2>
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={handlePrint}
                    variant="secondary"
                    disabled={downloading || isLoading}
                  >
                    <Printer className="mr-2 h-4 w-4" />
                    Print
                  </Button>

                  <Button
                    onClick={handleDownload}
                    disabled={downloading || isCancelled || isLoading}
                  >
                    {downloading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <Card className="overflow-hidden">
                <div className="p-4 bg-slate-50 border-b text-sm text-slate-600">
                  {isCancelled ? (
                    <span className="text-red-600 font-medium">Cancelled voucher #{data.voucherNo} – cannot edit or download</span>
                  ) : (
                    <div className="flex items-center gap-4">
                      <span>Preview approximates final PDF layout</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        data.bookingStatus === "book" 
                          ? "bg-green-100 text-green-800"
                          : data.bookingStatus === "amend"
                          ? "bg-orange-100 text-orange-800"
                          : data.bookingStatus === "cancel"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        Status: {data.bookingStatus ? 
                          data.bookingStatus.charAt(0).toUpperCase() + data.bookingStatus.slice(1) 
                          : "Book"}
                      </span>
                      <span className="text-xs text-gray-500">
                        Agent: {data.agentName || "Antony Waititu"}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6 overflow-auto max-h-[70vh]">
                  <VoucherPreview data={data} />
                </div>
              </Card>
            </div>
          </div>

          {/* Voucher List Section */}
          <div className="mt-8">
            <VoucherList onSelectVoucher={handleAmend} />
          </div>
        </div>
      </main>
    </>
  );
}
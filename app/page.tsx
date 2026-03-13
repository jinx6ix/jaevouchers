"use client";

import { useState, useRef } from "react";
import { Download, Loader2, Printer } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";

import VoucherForm from "@/components/voucher-form";
import VoucherPreview from "@/components/VoucherPreview";
import VoucherPDF from "@/components/voucherPDF";

import { VoucherData, defaultVoucherData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function VoucherGenerator() {
  const [data, setData] = useState<VoucherData>(defaultVoucherData);
  const [downloading, setDownloading] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);

  // UPDATED: now supports both string and number fields
  const update = <K extends keyof VoucherData>(
    field: K,
    value: VoucherData[K]
  ) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const blob = await pdf(<VoucherPDF data={data} />).toBlob();
      saveAs(blob, `voucher-${data.voucherNo || "unnamed"}.pdf`);
    } catch (err) {
      console.error("PDF generation failed", err);
      alert("Could not generate PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Global print styles - unchanged */}
      <style jsx global>{`
        @media print {
          @page { size: A4 portrait; margin: 8mm 10mm; }
          html, body { margin: 0 !important; padding: 0 !important; height: 100% !important; background: white !important; }
          body > *:not(#print-content-wrapper) { display: none !important; }
          #print-content-wrapper {
            display: block !important; position: relative !important; width: 210mm !important;
            min-height: 297mm !important; max-height: 297mm !important; margin: 0 auto !important;
            padding: 0 !important; background: white !important; box-shadow: none !important;
          }
          #printable-voucher { width: 100% !important; height: 100% !important; }
          .overflow-auto, .shadow-xl, .border, .rounded-lg { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
        #print-content-wrapper { display: none; }
      `}</style>

      <div id="print-content-wrapper">
        <div id="printable-voucher" ref={previewRef}>
          <VoucherPreview data={data} />
        </div>
      </div>

      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 md:p-10 print:hidden">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Travel Voucher Generator
          </h1>
          <p className="text-slate-600 mb-8">
            Fill the form → preview matches original layout → download exact PDF
          </p>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form */}
            <Card className="p-6 shadow-lg">
              <h2 className="text-2xl font-semibold mb-6">Voucher Details</h2>
              <VoucherForm
                data={data}
                onChange={update}
                onReset={() => setData(defaultVoucherData)}
              />
            </Card>

            {/* Preview + Actions - unchanged */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-semibold">Preview</h2>
                <div className="flex gap-3">
                  <Button
                    onClick={handlePrint}
                    className="bg-green-600 hover:bg-green-700 min-w-[140px]"
                  >
                    <Printer className="mr-2 h-4 w-4" />
                    Print Voucher
                  </Button>

                  <Button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="bg-blue-600 hover:bg-blue-700 min-w-[180px]"
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

              <div className="bg-white rounded-lg shadow-xl overflow-hidden border">
                <div className="p-4 bg-slate-50 border-b text-sm text-slate-600">
                  This preview approximates the final PDF layout
                </div>
                <div className="p-4 overflow-auto max-h-[70vh]">
                  <VoucherPreview data={data} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
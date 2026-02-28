"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
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

  const update = (field: keyof VoucherData, value: string) => {
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

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Travel Voucher Generator</h1>
        <p className="text-slate-600 mb-8">Fill the form → preview matches original layout → download exact PDF</p>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <Card className="p-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">Voucher Details</h2>
            <VoucherForm data={data} onChange={update} />
          </Card>

          {/* Preview + Download */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-semibold">Preview</h2>
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
  );
}
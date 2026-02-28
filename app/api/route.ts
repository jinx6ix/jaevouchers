import { NextResponse } from "next/server";
import { createVoucherPDF } from "@/lib/pdf";

export async function POST(req: Request) {
  const data = await req.json();
  const pdf = await createVoucherPDF(data);

  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=voucher.pdf",
    },
  });
}
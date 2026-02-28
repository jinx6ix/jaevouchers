import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

interface VoucherData {
  voucherNo: string;
  date: string;
  hotelName: string;
  roomType: string;
  clients: string;
  adults: string;
  children: string;
  doubles: string;
  checkIn: string;
  checkOut: string;
  nights: string;
  remarks?: string;
  agentName?: string;
}

export async function createVoucherPDF(data: VoucherData): Promise<Buffer> {
  return new Promise<Buffer>((resolve) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: 40,
    });

    const buffers: Buffer[] = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));

    /* =====================
       LOGOS – Top left & top right (symmetric)
    ====================== */
    const logoWidth = 130;
    const logoY = 25;           // distance from top
    const leftLogoX = 40;       // left margin
    const rightLogoX = 595 - 40 - logoWidth;  // right-aligned: page width - margin - logo width

    const leftLogoPath = path.join(process.cwd(), "public", "logos", "left-logo.png");
    const rightLogoPath = path.join(process.cwd(), "public", "logos", "right-logo.png");

    // Optional: add try-catch if you want to handle missing files gracefully
    try {
      doc.image(leftLogoPath, leftLogoX, logoY, { width: logoWidth });
      doc.image(rightLogoPath, rightLogoX, logoY, { width: logoWidth });
    } catch (err) {
      console.error("Failed to load logos:", {
        left: leftLogoPath,
        right: rightLogoPath,
        error: err.message,
      });
    
      // Draw visible placeholders so it's obvious in the PDF
      doc
        .rect(leftLogoX, logoY, logoWidth, 80)
        .strokeColor("red")
        .lineWidth(2)
        .stroke()
        .fillColor("black")
        .fontSize(10)
        .text("LEFT LOGO MISSING", leftLogoX + 10, logoY + 30);
    
      doc
        .rect(rightLogoX, logoY, logoWidth, 80)
        .strokeColor("red")
        .lineWidth(2)
        .stroke()
        .fillColor("black")
        .fontSize(10)
        .text("RIGHT LOGO MISSING", rightLogoX + 10, logoY + 30);
    }

    /* =====================
       VOUCHER NO (centered ~ upper middle)
    ====================== */
    doc
      .fontSize(11)
      .fillColor("black")
      .text(`Voucher No:`, 40, 100)
      .text(`${data.voucherNo}`, 230, 100);

    /* =====================
       DATE (left side)
    ====================== */
    doc.text(`Date: ${data.date}`, 40, 135);

    /* =====================
       HOTEL & ROOM TYPE
    ====================== */
    doc
      .fontSize(11)
      .fillColor("black")
      .text("Hotel Name:", 40, 175)
      .fillColor("red")
      .text(data.hotelName, 140, 175);

    doc
      .fillColor("black")
      .text("Room Type :", 40, 200)
      .fillColor("red")
      .text(data.roomType, 140, 200);

    /* =====================
       CLIENTS (orange bar)
    ====================== */
    doc
      .rect(40, 245, 515, 25)
      .fill("#ff7a00"); // orange background

    doc
      .fillColor("black")
      .fontSize(11)
      .text("CLIENTS:", 50, 252)
      .text(data.clients, 120, 252);

    /* =====================
       GUEST COUNTS
    ====================== */
    doc
      .fillColor("black")
      .text("No. of Adults:", 40, 290)
      .fillColor("red")
      .text(data.adults, 140, 290);

    doc
      .fillColor("black")
      .text("No. of children under 12 years", 300, 290)
      .fillColor("red")
      .text(data.children || "", 460, 290);

    /* =====================
       ROOM BOOKING SECTION
    ====================== */
    doc
      .fillColor("black")
      .text("Please Reserve BOOK", 40, 335);

    doc.text("TWINS:", 300, 335);
    doc.text("DOUBLES: ", 300, 360);
    doc.fillColor("red").text(data.doubles, 380, 360);

    doc.fillColor("black").text("SINGLES:", 300, 385);
    doc.text("TRIPLES:", 300, 410);

    /* =====================
       CHECK-IN / OUT / NIGHTS
    ====================== */
    doc
      .fillColor("black")
      .text("Check in:", 40, 455)
      .fillColor("red")
      .text(data.checkIn, 120, 455);

    doc
      .fillColor("black")
      .text("Check out:", 40, 480)
      .fillColor("red")
      .text(data.checkOut, 120, 480);

    doc
      .fillColor("black")
      .text("Number of Nights:", 40, 505)
      .fillColor("red")
      .text(data.nights, 170, 505);

    /* =====================
       REMARKS
    ====================== */
    doc
      .fillColor("black")
      .text("Remarks:", 40, 545)
      .fillColor("red")
      .text(
        data.remarks || "PLEASE NOTE CLIENT DIETARY REQUEST VEGETERIAN",
        120,
        545
      );

    /* =====================
       SIGNATURE BLOCK
    ====================== */
    doc
      .fillColor("black")
      .fontSize(11)
      .text("Signed", 40, 620);

    doc.text("For: Jae Travel Expeditions", 40, 645);
    doc.text(`Name: ${data.agentName || "Antony Waititu"}`, 40, 670);

    doc.end();
  });
}
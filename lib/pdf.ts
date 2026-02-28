import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export async function createVoucherPDF(data: any) {
  return new Promise<Buffer>((resolve) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: 40,
    });

    const buffers: Buffer[] = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));

    /* =====================
       LOGOS
    ====================== */
    const leftLogo = path.join(process.cwd(), "/unnamed.png");
    const rightLogo = path.join(process.cwd(), "/unnamed.png");

    doc.image(leftLogo, 40, 30, { width: 130 });
    doc.image(rightLogo, 420, 30, { width: 130 });

    /* =====================
       HEADER INFO
    ====================== */
    doc
      .fontSize(11)
      .fillColor("black")
      .text(`Voucher No: ${data.voucherNo}`, 230, 55);

    doc.text(`Date: ${data.date}`, 40, 120);

    /* =====================
       HOTEL DETAILS
    ====================== */
    doc
      .fontSize(11)
      .text("Hotel Name:", 40, 160)
      .fillColor("red")
      .text(data.hotelName, 120, 160);

    doc
      .fillColor("black")
      .text("Room Type:", 40, 185)
      .fillColor("red")
      .text("Standard Room Halfboard", 120, 185);

    /* =====================
       ORANGE CLIENT BAR
    ====================== */
    doc
      .rect(40, 230, 515, 22)
      .fill("#ff7a00");

    doc
      .fillColor("black")
      .fontSize(11)
      .text("CLIENTS:", 45, 235);

    doc
      .fillColor("black")
      .text(data.clients, 110, 235);

    /* =====================
       GUEST DETAILS
    ====================== */
    doc
      .fillColor("black")
      .text("No. of Adults:", 40, 270)
      .fillColor("red")
      .text("02 Adults", 130, 270);

    doc
      .fillColor("black")
      .text("No. of children under 12 years", 300, 270);

    /* =====================
       ROOMS SECTION
    ====================== */
    doc
      .fillColor("black")
      .text("Please Reserve BOOK", 40, 310);

    doc.text("TWINS:", 300, 310);
    doc.text("DOUBLES:", 300, 335);
    doc.fillColor("red").text(data.doubles, 380, 335);

    doc.fillColor("black").text("SINGLES:", 300, 360);
    doc.text("TRIPLES:", 300, 385);

    /* =====================
       DATES
    ====================== */
    doc
      .fillColor("black")
      .text("Check in:", 40, 430)
      .fillColor("red")
      .text(data.checkIn, 110, 430);

    doc
      .fillColor("black")
      .text("Check out:", 40, 455)
      .fillColor("red")
      .text(data.checkOut, 110, 455);

    doc
      .fillColor("black")
      .text("Number of Nights:", 40, 480)
      .fillColor("red")
      .text("01 night", 160, 480);

    /* =====================
       REMARKS
    ====================== */
    doc
      .fillColor("black")
      .text("Remarks:", 40, 515)
      .fillColor("red")
      .text(
        data.dietary || "PLEASE NOTE CLIENT DIETARY REQUEST VEGETERIAN",
        110,
        515
      );

    /* =====================
       SIGNATURE
    ====================== */
    doc
      .fillColor("black")
      .fontSize(11)
      .text("Signed", 40, 610);

    doc.text("For: Jae Travel Expeditions", 40, 635);
    doc.text("Name: Antony Waititu", 40, 660);

    doc.end();
  });
}
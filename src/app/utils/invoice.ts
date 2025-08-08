/* eslint-disable @typescript-eslint/no-explicit-any */
import PDFDocument from "pdfkit";
import AppError from "../errorHelpers/AppError";

export interface IInvoiceData {
  transactionId: string;
  bookingDate: string;
  userName: string;
  tourTitle: string;
  guestCount: number;
  totalAmount: number;
}

export const generatePdf = async (
  invoiceData: IInvoiceData
): Promise<Buffer<ArrayBufferLike>> => {
  try {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const buffer: Uint8Array[] = [];

      doc.on("data", (chunk) => buffer.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffer)));
      doc.on("error", (err) => reject(err));

      // Header
      doc
        .fontSize(24)
        .font("Helvetica-Bold")
        .text("Tour Booking Invoice", { align: "center" });

      doc.moveDown();
      doc
        .moveTo(50, doc.y)
        .lineTo(545, doc.y)
        .strokeColor("#444")
        .lineWidth(1)
        .stroke();

      doc.moveDown(1.5);

      // Transaction Info
      doc
        .fontSize(14)
        .font("Helvetica-Bold")
        .text("Transaction Details", { underline: true });
      doc.moveDown(0.5);

      doc
        .font("Helvetica")
        .fontSize(12)
        .text(`Transaction ID: ${invoiceData.transactionId}`);
      doc.text(
        `Booking Date: ${new Date(
          invoiceData.bookingDate
        ).toLocaleDateString()}`
      );
      doc.text(`Customer Name: ${invoiceData.userName}`);

      doc.moveDown();
      doc
        .moveTo(50, doc.y)
        .lineTo(545, doc.y)
        .strokeColor("#ccc")
        .lineWidth(0.5)
        .stroke();

      doc.moveDown(1.5);

      // Tour Details
      doc
        .fontSize(14)
        .font("Helvetica-Bold")
        .text("Tour Details", { underline: true });
      doc.moveDown(0.5);

      doc
        .font("Helvetica")
        .fontSize(12)
        .text(`Tour Title: ${invoiceData.tourTitle}`);
      doc.text(`Guest Count: ${invoiceData.guestCount}`);
      doc.text(`Total Amount: $${invoiceData.totalAmount.toFixed(2)}`);

      doc.moveDown();
      doc
        .moveTo(50, doc.y)
        .lineTo(545, doc.y)
        .strokeColor("#ccc")
        .lineWidth(0.5)
        .stroke();

      doc.moveDown(2);

      // Footer
      doc.font("Helvetica-Bold").fontSize(13).fillColor("#333");
      doc.text("Thank you for booking with us!", {
        align: "center",
      });

      doc.end();
    });
  } catch (error: any) {
    console.log(error);
    throw new AppError(401, `Pdf creation error ${error.message}`);
  }
};

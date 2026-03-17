const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const PDFDocument = require("pdfkit");
const numWords = require("num-words");

const Invoice = require("./models/Invoice");

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/invoices")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

/* ---------------- CREATE INVOICE ---------------- */

app.post("/api/invoices", async (req, res) => {
  try {
    const data = req.body;

    // Calculate totals
    const subTotal = (data.items || []).reduce(
      (sum, item) => sum + Number(item.totalAmount || 0),
      0
    );

    const cgst = subTotal * 0.09;
    const sgst = subTotal * 0.09;
    const total = subTotal + cgst + sgst;

    const invoice = new Invoice({
      ...data,
      subTotal,
      cgst,
      sgst,
      total
    });

    await invoice.save();
    res.json(invoice);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- GET INVOICE ---------------- */

app.get("/api/invoices/:id", async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).send("Invoice not found");
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- DOWNLOAD PDF ---------------- */

app.get("/api/invoices/:id/pdf", async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).send("Invoice not found");

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${invoice.invoiceNumber}.pdf`
    );

    doc.pipe(res);

    /* -------- HEADER -------- */
    doc.fontSize(22).text("TAX INVOICE", { align: "center" });
    doc.moveDown();
    doc.fontSize(12);

    doc.text(`Invoice Number: ${invoice.invoiceNumber}`);
    doc.text(`Invoice Date: ${new Date(invoice.date).toLocaleDateString()}`);
    doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`);
    doc.moveDown();

    /* -------- BILLED BY -------- */
    doc.text("Billed By:");
    doc.text(invoice.billedBy?.name || "");
    doc.text(invoice.billedBy?.address || "");
    doc.text(`GSTIN: ${invoice.billedBy?.gstin || ""}`);
    doc.text(`PAN: ${invoice.billedBy?.pan || ""}`);
    doc.moveDown();

    /* -------- BILLED TO -------- */
    doc.text("Billed To:");
    doc.text(invoice.billedTo?.name || "");
    doc.text(invoice.billedTo?.address || "");
    doc.text(`GSTIN: ${invoice.billedTo?.gstin || ""}`);
    doc.text(`PAN: ${invoice.billedTo?.pan || ""}`);
    doc.moveDown();

    doc.text(`Place of Supply: ${invoice.placeOfSupply || ""}`);
    doc.moveDown();

    /* -------- ITEMS -------- */
    doc.fontSize(14).text("Items", { underline: true });
    doc.moveDown();

    (invoice.items || []).forEach((item, i) => {
      doc.fontSize(11).text(
        `${i + 1}. ${item.description} | Qty: ${item.quantity} | Amount: Rs ${item.taxableAmount || 0} | Total: Rs ${item.totalAmount || 0}`
      );
    });
    doc.moveDown();

    /* -------- TOTALS -------- */
    const subTotal = Number(invoice.subTotal) || 0;
    const cgst = Number(invoice.cgst) || 0;
    const sgst = Number(invoice.sgst) || 0;
    const total = Number(invoice.total) || 0;

    doc.text(`Sub Total: Rs ${subTotal.toFixed(2)}`);
    doc.text(`CGST: Rs ${cgst.toFixed(2)}`);
    doc.text(`SGST: Rs ${sgst.toFixed(2)}`);
    doc.fontSize(13).text(`Total: Rs ${total.toFixed(2)}`);
    doc.moveDown();

    /* -------- AMOUNT IN WORDS -------- */
    let words = "Zero";
    try {
      words = numWords(Math.round(total));
    } catch (e) {
      words = "Zero";
    }
    doc.text(`Amount in words: ${words} Rupees Only`);
    doc.moveDown();

    /* -------- BANK DETAILS -------- */
    doc.text("Bank Details:");
    doc.text(`Account Holder: ${invoice.bankDetails?.accountHolder || ""}`);
    doc.text(`Account Number: ${invoice.bankDetails?.accountNumber || ""}`);
    doc.text(`IFSC: ${invoice.bankDetails?.ifsc || ""}`);
    doc.text(`Bank Name: ${invoice.bankDetails?.bankName || ""}`);
    //doc.text(`Bank: ${invoice.bankDetails?.bankName || ""}`);
    doc.text(`UPI: ${invoice.bankDetails?.upi || ""}`);
    doc.moveDown();

    doc.text("Notes:");
    doc.text(invoice.notes || "");
    doc.moveDown();

    doc.text("Terms & Conditions:");
    doc.text(invoice.terms || "");

    doc.end();

  } catch (err) {
    console.error("PDF Error:", err);
    if (!res.headersSent) res.status(500).json({ error: err.message });
  }
});

/* ---------------- START SERVER ---------------- */
/* ---------------- START SERVER ---------------- */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
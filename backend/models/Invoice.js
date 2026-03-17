const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  description: String,
  quantity: Number,
  taxableAmount: Number,
  totalAmount: Number
});

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: String,
  date: Date,
  dueDate: Date,
  billedBy: {
    name: String,
    address: String,
    gstin: String,
    pan: String
  },
  billedTo: {
    name: String,
    address: String,
    gstin: String,
    pan: String
  },
  placeOfSupply: String,
  countryOfSupply: String,
  items: [itemSchema],
  bankDetails: {
    accountHolder: String,
    accountNumber: String,
    ifsc: String,
    accountType: String,
    bankName: String,
    upi: String
  },
  subTotal: Number,
  discount: Number,
  taxableAmount: Number,
  cgst: Number,
  sgst: Number,
  total: Number,
  earlyPayDiscount: Number,
  earlyPayDeadline: Date,
  notes: String,
  terms: String,
  contact: String
});

module.exports = mongoose.model("Invoice", invoiceSchema);
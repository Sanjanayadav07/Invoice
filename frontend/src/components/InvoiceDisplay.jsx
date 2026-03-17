import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function InvoiceDisplay() {

  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {

    axios
      .get(`http://localhost:5000/api/invoices/${id}`)
      .then(res => setInvoice(res.data))
      .catch(err => console.log(err));

  }, [id]);

  const downloadPDF = () => {
    window.open(
      `http://localhost:5000/api/invoices/${id}/pdf`,
      "_blank"
    );
  };

  if (!invoice)
    return (
      <p className="text-center text-gray-500 mt-10">Loading...</p>
    );

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 mt-10">

      <h2 className="text-3xl font-bold text-blue-700 mb-6">
        Invoice #{invoice.invoiceNumber}
      </h2>

      {/* Invoice Details */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <p className="text-sm text-gray-600">
            Date: {invoice.date ? new Date(invoice.date).toLocaleDateString() : "-"}
          </p>

          <p className="text-sm text-gray-600">
            Due Date: {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : "-"}
          </p>
          <p className="text-sm text-gray-600">Place of Supply: {invoice.placeOfSupply}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold">Billed By</p>
          <p className="text-sm text-gray-600">{invoice.billedBy?.name}</p>
          <p className="text-sm text-gray-600">{invoice.billedBy?.address}</p>
        </div>
      </div>

      {/* Items Table */}
      <h3 className="text-xl font-semibold mb-3">Items</h3>

      <table className="w-full border border-gray-300 mb-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Description</th>
            <th className="border p-2">Qty</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Total</th>
          </tr>
        </thead>

        <tbody>
          {invoice.items?.map((item, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="border p-2">{item.description}</td>
              <td className="border p-2 text-center">{item.quantity}</td>
              <td className="border p-2 text-right">₹{item.taxableAmount}</td>
              <td className="border p-2 text-right">₹{item.totalAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="text-right space-y-2 mb-6">

        <p>
          Subtotal: ₹{Number(invoice.subTotal || 0).toFixed(2)}
        </p>

        <p>
          CGST (9%): ₹{Number(invoice.cgst || 0).toFixed(2)}
        </p>

        <p>
          SGST (9%): ₹{Number(invoice.sgst || 0).toFixed(2)}
        </p>

        <h3 className="text-xl font-bold">
          Total: ₹{Number(invoice.total || 0).toFixed(2)}
        </h3>

      </div>

      {/* Bank Details */}
      {invoice.bankDetails && (
        <div className="mb-6">
          <p className="font-semibold text-lg">Bank Details</p>
          <p>Account Holder: {invoice.bankDetails.accountHolder}</p>
          <p>Account Number: {invoice.bankDetails.accountNumber}</p>
          <p>IFSC: {invoice.bankDetails.ifsc}</p>
          <p>Bank Name: {invoice.bankDetails?.bankName}</p>
          
          <p>UPI: {invoice.bankDetails.upi}</p>
        </div>
      )}

      {/* Notes */}
      {invoice.notes && (
        <div className="mb-6">
          <p className="font-semibold">Notes</p>
          <p className="text-gray-700">{invoice.notes}</p>
        </div>
      )}

      {/* Terms */}
      {invoice.terms && (
        <div className="mb-6">
          <p className="font-semibold">Terms & Conditions</p>
          <p className="text-gray-700">{invoice.terms}</p>
        </div>
      )}

      {/* Download Button */}
      <div className="flex justify-end">
        <button
          onClick={downloadPDF}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          Download PDF
        </button>
      </div>

    </div>
  );
}

export default InvoiceDisplay;
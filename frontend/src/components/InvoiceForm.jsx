import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function InvoiceForm() {
  const navigate = useNavigate();

  const generateInvoiceNumber = () => {
    return Math.floor(100000 + Math.random() * 900000);
  };

  const [form, setForm] = useState({
    invoiceNumber: generateInvoiceNumber(),
    date: "",
    dueDate: "",
    placeOfSupply: "",

    billedBy: {
      name: "",
      address: "",
      gstin: "",
      pan: ""
    },

    billedTo: {
      name: "",
      address: "",
      gstin: "",
      pan: ""
    },
    bankDetails: {
      accountHolder: "",
      accountNumber: "",
      ifsc: "",
      bankName: "",
      upi: ""
    },

    items: [],
    subTotal: 0,
    cgst: 0,
    sgst: 0,
    total: 0,

    notes: "",
    terms: ""
  });

  const [item, setItem] = useState({
    description: "",
    quantity: 1,
    taxableAmount: 0,
    totalAmount: 0
  });

  /* -------- ADD ITEM -------- */

  const addItem = () => {
    if (!item.description || item.taxableAmount <= 0) return;

    const updatedItems = [...form.items, item];

    const subTotal = updatedItems.reduce(
      (sum, i) => sum + Number(i.totalAmount),
      0
    );

    const cgst = subTotal * 0.09;
    const sgst = subTotal * 0.09;
    const total = subTotal + cgst + sgst;

    setForm({
      ...form,
      items: updatedItems,
      subTotal,
      cgst,
      sgst,
      total
    });

    setItem({
      description: "",
      quantity: 1,
      taxableAmount: 0,
      totalAmount: 0
    });
  };

  /* -------- DELETE ITEM -------- */

  const deleteItem = (index) => {
    const updatedItems = form.items.filter((_, i) => i !== index);

    const subTotal = updatedItems.reduce(
      (sum, i) => sum + Number(i.totalAmount),
      0
    );

    const cgst = subTotal * 0.09;
    const sgst = subTotal * 0.09;
    const total = subTotal + cgst + sgst;

    setForm({
      ...form,
      items: updatedItems,
      subTotal,
      cgst,
      sgst,
      total
    });
  };

  /* -------- SAVE INVOICE -------- */

  const handleSubmit = async () => {
    if (!form.billedBy.name || !form.billedTo.name) {
      alert("Please fill Billed By and Billed To details");
      return;
    }

    const res = await axios.post(
      "http://localhost:5000/api/invoices",
      form
    );

    navigate(`/invoice/${res.data._id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-8">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-4xl">

        <h2 className="text-3xl font-bold text-blue-600 mb-6">
          Create Invoice
        </h2>

        {/* Invoice Details */}
        <div className="grid grid-cols-2 gap-4 mb-6">

          <input
            className="border p-2"
            value={form.invoiceNumber}
            readOnly
          />

          <input
            type="date"
            className="border p-2"
            onChange={(e) =>
              setForm({ ...form, date: e.target.value })
            }
          />

          <input
            type="date"
            className="border p-2"
            onChange={(e) =>
              setForm({ ...form, dueDate: e.target.value })
            }
          />

          <input
            className="border p-2"
            placeholder="Place of Supply"
            onChange={(e) =>
              setForm({ ...form, placeOfSupply: e.target.value })
            }
          />
        </div>

        {/* Billed By */}
        <h3 className="text-xl font-semibold mb-2">Billed By</h3>

        <input
          className="border p-2 w-full mb-2"
          placeholder="Company Name"
          value={form.billedBy.name}
          onChange={(e) =>
            setForm({
              ...form,
              billedBy: { ...form.billedBy, name: e.target.value }
            })
          }
        />

        <input
          className="border p-2 w-full mb-2"
          placeholder="Address"
          value={form.billedBy.address}
          onChange={(e) =>
            setForm({
              ...form,
              billedBy: { ...form.billedBy, address: e.target.value }
            })
          }
        />

        <input
          className="border p-2 w-full mb-2"
          placeholder="GSTIN"
          value={form.billedBy.gstin}
          onChange={(e) =>
            setForm({
              ...form,
              billedBy: { ...form.billedBy, gstin: e.target.value }
            })
          }
        />

        <input
          className="border p-2 w-full mb-4"
          placeholder="PAN"
          value={form.billedBy.pan}
          onChange={(e) =>
            setForm({
              ...form,
              billedBy: { ...form.billedBy, pan: e.target.value }
            })
          }
        />

        {/* Billed To */}
        <h3 className="text-xl font-semibold mb-2">Billed To</h3>

        <input
          className="border p-2 w-full mb-2"
          placeholder="Customer Name"
          value={form.billedTo.name}
          onChange={(e) =>
            setForm({
              ...form,
              billedTo: { ...form.billedTo, name: e.target.value }
            })
          }
        />

        <input
          className="border p-2 w-full mb-2"
          placeholder="Address"
          value={form.billedTo.address}
          onChange={(e) =>
            setForm({
              ...form,
              billedTo: { ...form.billedTo, address: e.target.value }
            })
          }
        />

        {/* Bank Details */}
        <h3 className="text-xl font-semibold mt-4 mb-2">Bank Details</h3>

        <input
          className="border p-2 w-full mb-2"
          placeholder="Account Holder Name"
          value={form.bankDetails.accountHolder}
          onChange={(e) =>
            setForm({
              ...form,
              bankDetails: { ...form.bankDetails, accountHolder: e.target.value }
            })
          }
        />

        <input
          className="border p-2 w-full mb-2"
          placeholder="Account Number"
          value={form.bankDetails.accountNumber}
          onChange={(e) =>
            setForm({
              ...form,
              bankDetails: { ...form.bankDetails, accountNumber: e.target.value }
            })
          }
        />

        <input
          className="border p-2 w-full mb-2"
          placeholder="IFSC Code"
          value={form.bankDetails.ifsc}
          onChange={(e) =>
            setForm({
              ...form,
              bankDetails: { ...form.bankDetails, ifsc: e.target.value }
            })
          }
        />

        <input
          className="border p-2 w-full mb-2"
          placeholder="Bank Name"
          value={form.bankDetails.bankName}   // <-- THIS LINE FIXED
          onChange={(e) =>
            setForm({
              ...form,
              bankDetails: { ...form.bankDetails, bankName: e.target.value }
            })
          }
        />

        <input
          className="border p-2 w-full mb-4"
          placeholder="UPI ID"
          value={form.bankDetails.upi}
          onChange={(e) =>
            setForm({
              ...form,
              bankDetails: { ...form.bankDetails, upi: e.target.value }
            })
          }
        />

        {/* Add Item */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Add Item</h3>

        <div className="grid grid-cols-4 gap-3 mb-5">

          <input
            className="border p-2"
            placeholder="Description"
            value={item.description}
            onChange={(e) =>
              setItem({ ...item, description: e.target.value })
            }
          />

          <input
            type="number"
            className="border p-2"
            placeholder="Quantity"
            value={item.quantity}
            onChange={(e) => {
              const qty = Number(e.target.value);
              setItem({
                ...item,
                quantity: qty,
                totalAmount: qty * item.taxableAmount
              });
            }}
          />

          <input
            type="number"
            className="border p-2"
            placeholder="Amount"
            value={item.taxableAmount}
            onChange={(e) => {
              const amount = Number(e.target.value);
              setItem({
                ...item,
                taxableAmount: amount,
                totalAmount: item.quantity * amount
              });
            }}
          />

          <button
            onClick={addItem}
            className="bg-green-500 text-white rounded p-2"
          >
            Add
          </button>
        </div>


        {/* Save */}
        <div className="text-center mt-6">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-2 rounded"
          >
            Save Invoice
          </button>
        </div>
        {/* Notes */}
        <h3 className="text-xl font-semibold mt-6 mb-2">
          Notes
        </h3>

        <textarea
          className="border p-2 w-full mb-4"
          rows="3"
          placeholder="Enter Notes"
          value={form.notes}
          onChange={(e) =>
            setForm({ ...form, notes: e.target.value })
          }
        />

        {/* Terms & Conditions */}
        <h3 className="text-xl font-semibold mb-2">
          Terms & Conditions
        </h3>

        <textarea
          className="border p-2 w-full mb-4"
          rows="3"
          placeholder="Enter Terms & Conditions"
          value={form.terms}
          onChange={(e) =>
            setForm({ ...form, terms: e.target.value })
          }
        />

      </div>
    </div>
  );
}

export default InvoiceForm;

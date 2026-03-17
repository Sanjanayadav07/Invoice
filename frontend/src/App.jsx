import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InvoiceForm from "./components/InvoiceForm";
import InvoiceDisplay from "./components/InvoiceDisplay";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InvoiceForm />} />
        <Route path="/invoice/:id" element={<InvoiceDisplay />} />
      </Routes>
    </Router>
  );
}

export default App;
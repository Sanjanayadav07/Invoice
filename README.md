# 🧾 Invoice Generator App (MERN Stack)

A full-stack Invoice Generator web application built using **React, Node.js, Express, and MongoDB**.  
This app allows users to create invoices, add items, calculate taxes (CGST/SGST), generate PDF invoices, and store data in database.

---

## ✨ Features

- ✅ Create Invoice
- ✅ Auto Generate Invoice Number
- ✅ Add / Delete Items
- ✅ Auto Calculate:
  - Subtotal
  - CGST
  - SGST
  - Total
- ✅ Bank Details Section
- ✅ Notes & Terms & Conditions
- ✅ Download Invoice as PDF
- ✅ Save Invoice to MongoDB
- ✅ Responsive UI

---

## 🛠️ Tech Stack

### Frontend:
- React.js
- Axios
- React Router
- Tailwind CSS (or CSS)

### Backend:
- Node.js
- Express.js
- MongoDB
- Mongoose
- PDFKit
- CORS
- dotenv

---

## 📂 Project Structure

```
project/
│
├── frontend/
│   ├── src/
│   └── package.json
│
├── backend/
│   ├── server.js
│   ├── models/
│   └── package.json
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```
git clone https://github.com/yourusername/invoice-app.git
cd invoice-app
```

---

### 2️⃣ Backend Setup

```
cd backend
npm install
```

Create `.env` file:

```
MONGO_URI=your_mongodb_atlas_connection_string
PORT=5000
```

Start server:

```
npm start
```

---

### 3️⃣ Frontend Setup

```
cd frontend
npm install
npm start
```

Build for production:

```
npm run build
```

---

## 📄 PDF Generation

Invoices can be downloaded in PDF format using:

```
/api/invoices/:id/pdf
```

---

## 🌐 Deployment

- Frontend: Vercel
- Backend: Render / Railway
- Database: MongoDB Atlas

Make sure to use:
- `process.env.PORT`
- `process.env.MONGO_URI`

---

## 👩‍💻 Developer

Developed by: **Sanjana Yadav**

---

## 📌 Future Improvements

- Email Invoice Feature
- Authentication System
- Dashboard Analytics
- Invoice Search & Filter
- Payment Integration

---

⭐ If you like this project, please give it a star!

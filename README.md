# Birth Certificate Digitalization Application System

## 📌 Overview
This is a web-based application developed for **Bagula 2 No Gram Panchayat** to streamline the process of birth certificate digitalization.

The system enables citizens to generate structured applications, prevents duplicate entries, and allows Panchayat staff to review and verify submissions efficiently.

---

## 🎯 Objective
- Eliminate duplicate applications  
- Reduce repeated visits to Panchayat office  
- Ensure structured and validated data entry  
- Generate printable one-page application PDF  

---

## 🚀 Core Features

### 👤 User Module
- OTP-based login (mobile authentication)  
- Step-by-step multi-stage form  
- Duplicate entry detection  
- Document upload (≤250KB)  
- One-page PDF generation  
- Application status tracking  

---

### 👨‍💼 Staff Module
- Secure login with OTP  
- View all applications  
- Download uploaded documents  
- Approve / Reject applications  
- Audit log tracking  

---

### 🛡️ Admin Module
- Full system control  
- Approve staff edits  
- Manage system configuration  

---

## 🔒 Validation & Security
- One mobile = one application (strict enforcement)  
- Duplicate detection using:
  - Child Name + DOB + Mother Name  
- Aadhaar and ID format validation  
- Mandatory field enforcement  
- File size and format validation  

---

## 🔕 System Behavior
- No SMS/email notifications to users  
- Users must check status via portal  
- Data stored securely with structured schema  

---

## 📄 Required Documents
1. Application Form (Generated)  
2. Birth Certificate  
3. Father’s Aadhaar  
4. Mother’s Aadhaar  
5. Ration Cards  
6. Child Proof (Aadhaar/EPIC)  
7. Supporting documents (if available)  

---

## 🧾 PDF Output
- One-page A4 format  
- Government-style layout  
- Print-ready with proper margins  
- No watermark  

---

## ⚙️ Tech Stack
- Next.js (App Router)  
- Tailwind CSS  
- Firebase (Auth, Firestore, Storage)  
- jsPDF  
- EmailJS  
- Vercel (Hosting)  

---

## 🧠 System Design
- Multi-step form wizard  
- Dropdown-based controlled inputs  
- Conditional rendering  
- Auto-save functionality  

---

## 🛠️ Setup Instructions

1. Clone the repository  
2. Create `.env.local` using `.env.example`  
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run development server:
   ```bash
   npm run dev
   ```

---

## 📁 Project Structure (Basic)

- `/app` → Next.js routes and pages  
- `/components` → UI components  
- `/lib` → Firebase and utility functions  
- `/public` → Static assets  

---

## 🔑 Environment Configuration
Configure the following in `.env.local`:

- Firebase API Key
- Firebase Auth Domain
- Firestore Project ID
- Storage Bucket
- EmailJS Service ID
- EmailJS Public Key

---

## ⚖️ Disclaimer
This portal facilitates application generation only.
Final approval rests with the competent Panchayat authority.

---

## 👨‍💻 Developed For
Bagula 2 No Gram Panchayat  
Nadia, West Bengal

---

## 📧 Contact
nitush8343980898@gmail.com

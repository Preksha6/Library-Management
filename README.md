# 📚 Library Management System (MERN)

A full-stack **Library Management System** built using the MERN stack (**MongoDB, Express, React, Node.js**) to efficiently manage books, users, and borrowing operations in a library.

> ⚠️ **Note:** This is **not an e-commerce platform** — no payment system is included.

---

## 🚀 Features

### 👨‍💼 Admin Panel

* 📘 Manage books (Add / Update / Delete)
* 👥 View user details (ID, borrowed books, etc.)
* ✅ Approve book requests
* 🔄 Confirm book returns
* 💰 Manage late return charges

### 👤 Client Panel

* 🔍 Browse and search books
* 📚 Check availability
* 📩 Request books
* 👤 Manage profile & dashboard (CRUD operations)

---

## 🛠️ Tech Stack

**Frontend**

* React.js
* Bootstrap

**Backend**

* Node.js
* Express.js

**Database**

* MongoDB

---

## ⚙️ Version Specifications

* Node.js: v18.16.0
* Express: v4.18.2
* React: v18.2.0
* MongoDB: v6.0.6
* Mongosh: v2.0.2

---

## 🎬 Demo

![Demo](https://mraalu.pythonanywhere.com/media/project/LMS.gif)

---

## 📚 Documentation

Documentation is available inside the `/docs/` folder.

---

## 🧑‍💻 Getting Started (Local Setup)

### 1️⃣ Clone the Repository

```bash
git clone git@github.com:MrAalu/LibraryManagementSystem_MERN.git
cd LibraryManagementSystem_MERN
```

---

### 2️⃣ Navigate to Project Folders

```bash
cd frontend
cd backend
```

---

### 3️⃣ Install Dependencies

```bash
npm install
```

---

### 4️⃣ Environment Variables

Create a `.env` file inside the `backend` folder and copy values from:

```
.env.example
```

---

### 5️⃣ Run the Application

Start both frontend and backend:

```bash
npm run dev
```

> 💡 If you face backend issues, refer to:

```
/backend/BackendInfo/
```

---

## 🗄️ Database Setup

* Ensure MongoDB server is running
* Open MongoDB Compass
* Import JSON files from:

```
mongoDatabase/
```

into respective collections

---

## 🐳 Run with Docker

1. Setup MongoDB locally (as above)
2. Configure `.env` with correct `CONNECTION_URL`
3. Run:

```bash
docker-compose up
```

---

## 🔐 Login Credentials

### 👨‍💼 Admin

```
Email: admin@gmail.com  
Password: admin  
Role: admin_user
```

### 👤 User

* Register via Signup page
* Role: normal_user

---

## 📘 Lessons Learned

* 💬 "Code comments are letters to your future self."
* 🔁 "If you can't solve it now, document it for later."

---

## 🚀 Future Improvements

* 📅 Automated due date tracking
* 🔔 Notifications (Email/SMS)
* 📊 Analytics dashboard
* 📚 Book categorization & recommendations

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork and submit a pull request.

---

## 👨‍💻 Author

**Preksha6**
🔗 https://github.com/Preksha6

---

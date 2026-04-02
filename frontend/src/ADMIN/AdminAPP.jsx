import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import AdminNavbar from "./navbar/AdminNavbar"
import PagenotFound from "./404-pageNotFoundADMIN/PagenotFound"
import AdminHome from "./adminHome/AdminHome"
import ManageBooks from "./manageBooks/ManageBooks"
import ViewUsers from "./viewUsers/ViewUsers"
import IssuedBooks from "./issuedBooks/IssuedBooks"
import BooksRequests from "./booksRequests/BooksRequests"
import ReturnedBooks from "./returnedBooks/ReturnedBooks"
import EditBookForm from "./manageBooks/EditBookForm"
import AddNewBook from "./addNewBook/AddNewBook"
import AdminLogout from "./adminLogout/AdminLogout"
import UserIndividualPage from "./viewUsers/UserIndividualPage"
import IssueBookToUser from "./issuedBooks/IssueBookToUser"
import Sidebar from "./sidebar/Sidebar"
import AdminSignup from "./createAdminAccount/AdminSignup"
import AdminOtpForm from "./adminOTP/AdminOtpForm"

const AdminAPP = () => (
  <React.Fragment>
    <Router>
      <AdminNavbar />
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 60px)' }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '2rem', overflow: 'auto', background: 'var(--bg-base)' }}>
          <Routes>
            <Route path="/admin" element={<AdminHome />} />
            <Route path="/admin/logout" element={<AdminLogout />} />
            <Route path="/admin/managebooks" element={<ManageBooks />} />
            <Route path="/admin/viewusers" element={<ViewUsers />} />
            <Route path="/admin/viewusers/:id" element={<UserIndividualPage />} />
            <Route path="/admin/issuedbooks" element={<IssuedBooks />} />
            <Route path="/admin/issuebooktouser" element={<IssueBookToUser />} />
            <Route path="/admin/booksrequests" element={<BooksRequests />} />
            <Route path="/admin/returnedbooks" element={<ReturnedBooks />} />
            <Route path="/admin/addnewbook" element={<AddNewBook />} />
            <Route path="/admin/managebooks/:id" element={<EditBookForm />} />
            <Route path="/admin/adminsignup" element={<AdminSignup />} />
            <Route path="/admin/otp" element={<AdminOtpForm />} />
            <Route path="*" element={<PagenotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  </React.Fragment>
)
export default AdminAPP

import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import AdminPanel from "./pages/AdminPanel";
import TeachersPanel from "./pages/TeachersPanel";
import ProtectedRoute from "./components/ProtectedRoute";
import NewAdmission from "./pages/NewAdmission"; // ✅ New Admission Page Import
import StudentsDetails from "./pages/StudentsDetails"; // ✅ Import StudentsDetails Page
import PaymentPage from './pages/PaymentPage'; // ✅ Import PaymentPage

// App Component
function App() {
  return (
    <Router>
      <RoutesWrapper />
    </Router>
  );
}

// Routes Wrapper Component to handle Navbar rendering based on path
function RoutesWrapper() {
  const location = useLocation(); // Use useLocation inside the RoutesWrapper

  return (
    <div className="w-screen h-screen flex flex-col bg-gray-100 text-blue-900">
      {/* Hide Navbar on Admin Panel */}
      {location.pathname !== '/adminpanel' && location.pathname !== '/admin/students' && location.pathname !== '/admin/new-admission' && location.pathname !== '/admin/students/payment' &&  <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />

        {/* ✅ Protected Admin Panel Route */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/adminpanel" element={<AdminPanel />} />
          <Route path="/admin/new-admission" element={<NewAdmission />} /> {/* ✅ New Admission Route */}
          <Route path="/admin/students" element={<StudentsDetails />} /> {/* ✅ Students Route */}
          <Route path="/admin/students/payment" element={<PaymentPage />} /> {/* Payment Page */}
        </Route>

        {/* ✅ Protected Teachers Panel Route */}
        <Route element={<ProtectedRoute allowedRoles={["teacher"]} />}>
          <Route path="/teacherspanel" element={<TeachersPanel />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;

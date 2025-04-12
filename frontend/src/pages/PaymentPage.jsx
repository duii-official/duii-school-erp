import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Snackbar,
} from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Loader2, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import {
  Sun,
  Moon,
  School2,
  UserPlus,
  Users,
  LogOut,
  Menu,
  X,
  TrendingUp,
  Calendar,
  DollarSign,
  Wallet,
  UserCheck,
  UserX,
  Users2,
} from "lucide-react";
import { AdminPanelSettings } from "@mui/icons-material"; // Add this line

const PaymentPage = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentMode, setPaymentMode] = useState("Offline");
  const [transactionId, setTransactionId] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();
  const [studentDetails, setStudentDetails] = useState(null);
  const [sponsorDetails, setSponsorDetails] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [totalFees, setTotalFees] = useState(0);
  const [selectedPayer, setSelectedPayer] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    setIsLoggedIn(!!token);
    setUserRole(role);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setUserRole(null);
    navigate("/");
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/payment/students")
      .then((response) => setStudents(response.data))
      .catch((error) => console.error("Error fetching students:", error));
  }, []);

  const validateInputs = () => {
    if (!selectedStudent) return "Please select a student.";
    if (!/^[0-9]{1,5}$/.test(paymentAmount))
      return "Enter a valid payment amount (max 5 digits).";
    if (paymentMode === "Offline" && !/^[A-Za-z ]+$/.test(receiverName))
      return "Receiver's Name must only contain letters.";
    if (paymentMode === "Online" && !/^[A-Za-z0-9]{4}$/.test(transactionId))
      return "Transaction ID must be exactly 4 alphanumeric characters.";
    if (!selectedPayer) return "Please select a Payer.";
    return null;
  };

  const handleSubmitPayment = async () => {
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    // 🛠️ Ensure 'payer' is correctly assigned
    if (!selectedPayer) {
      console.error("❌ ERROR: Payer is undefined!");
      toast.error("Please select who is paying (Parent/Sponsor)");
      setLoading(false);
      return;
    }

    const paymentData = {
      paymentAmount,
      paymentMode,
      transactionId: paymentMode === "Online" ? transactionId : "",
      receiverName: paymentMode === "Offline" ? receiverName : "",
      payer: selectedPayer, // 🔥 Corrected from "selectedPayer" to "payer"
    };

    // console.log("🟡 Selected Payer:", selectedPayer);
    // console.log("🟢 Sending Payment Data:", paymentData);

    try {
      const response = await axios.post(
        `http://localhost:5000/api/payment/pay/${selectedStudent}`,
        paymentData
      );
      
      toast.success(response.data.message || "Payment successful");

      setTimeout(() => {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        setSelectedStudent("");
        setSearchQuery("");
        setPaymentMode("Offline");
        setTransactionId("");
        setReceiverName("");
        setSelectedPayer("");
        setPaymentAmount("");
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("❌ Payment Failed:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Payment failed");
      setLoading(false);
    }
};


  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length > 0) {
      const matches = students.filter((student) =>
        student.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredStudents(
        matches.length > 0
          ? matches
          : [
              {
                _id: "not-found",
                name: "Student Not Found",
                classApplied: "",
              },
            ]
      );
    } else {
      setFilteredStudents([]);
    }
  };

  const handleSelectStudent = async () => {
    if (!selectedStudent) {
      console.error("No student selected");
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:5000/api/students/${selectedStudent}`
      );
      const student = res.data;

      if (!student) {
        console.error("Student not found!");
        return;
      }

      // ✅ Total Fees Fetch
      setStudentDetails(student);
      setTotalFees(student.totalFees || 0);

      // ✅ Sponsor & Parent Fees Check
      const sponsorPaying = student.sponsorPaying ?? 0;
      const parentsPaying = student.parentsPaying ?? 0;
      const sponsorName = student.sponsorName ?? "N/A";

      setSponsorDetails({ sponsorName, sponsorPaying, parentsPaying });

      // ✅ Sponsorship Status Determine Karna
      if (sponsorPaying > 0 && parentsPaying > 0) {
        setPaymentStatus("Semi-Sponsored");
        setSelectedPayer(""); // User selects manually
      } else if (sponsorPaying > 0) {
        setPaymentStatus("Full-Sponsored");
        setSelectedPayer("Sponsor"); // Default to Sponsor
      } else {
        setPaymentStatus("Not-Sponsored");
        setSelectedPayer("Parent"); // Default to Parent
      }
    } catch (err) {
      console.error("Error fetching student details:", err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4 lg:ml-80 ">
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Toggle Menu"
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Sidebar */}
      <nav
        className={`fixed top-0 left-0 h-full w-72 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        } bg-white dark:bg-gray-800 shadow-xl z-40`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <School2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold dark:text-white">DUII</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Admin Dashboard
                </p>
              </div>
            </motion.div>

            <nav className="space-y-2">
              {/* New Admin Panel Link */}
              {[
                { icon: AdminPanelSettings, label: "Admin Panel", delay: 0.3 }, // Admin Panel Item
                { icon: UserPlus, label: "New Admission", delay: 0.3 },
                { icon: Users, label: "Student Details", delay: 0.3 },
              ].map((item, index) => (
                <motion.a
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: item.delay }}
                  whileHover={{ x: 10 }}
                  onClick={() => {
                    if (item.label === "New Admission") {
                      navigate("/admin/new-admission");
                    } else if (item.label === "Admin Panel") {
                      navigate("/adminpanel"); // Admin Panel route
                    } else if (item.label === "Student Details") {
                      navigate("/admin/students"); // Admin Panel route
                    }
                  }}
                  className="flex items-center gap-3 p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors cursor-pointer"
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </motion.a>
              ))}
            </nav>
          </div>

          {/* Logout Button at Bottom */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ x: 10 }}
            className="mt-auto mb-6 mx-6 flex items-center gap-3 p-4 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors w-auto"
            onClick={handleLogout} // Attach handleLogout function to the logout button
          >
            <LogOut className="h-5 w-5" />
            Logout
          </motion.button>
        </div>
      </nav>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={!!error}
        autoHideDuration={3000}
        message={error}
        onClose={() => setError("")}
      />

      {success ? (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          className="flex flex-col items-center justify-center bg-white shadow-lg p-8 rounded-lg"
        >
          <CheckCircle className="text-green-500" size={80} />
          <h2 className="text-xl font-bold text-gray-700 mt-4">
            Payment Successful!
          </h2>
        </motion.div>
      ) : (
        <Card className="w-full max-w-lg shadow-lg rounded-xl bg-white p-6" sx={{boxShadow:20, borderRadius:2}}>
          <CardHeader
            title="Record Fees"
            className="text-center text-2xl font-bold text-gray-700"
          />
          <CardContent>
            <TextField
              fullWidth
              label="Search Student"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />

            {filteredStudents.length > 0 && (
              <div className="max-h-40 overflow-y-auto border rounded p-2 mb-4">
                {filteredStudents.map((student) => (
                  <div
                    key={student._id}
                    className="p-2 hover:bg-gray-200 cursor-pointer"
                    onClick={() => {
                      if (student._id !== "not-found") {
                        setSelectedStudent(student._id);
                        setSearchQuery(student.name);
                      }
                      setFilteredStudents([]);
                    }}
                  >
                    {student.name}{" "}
                    {student.classApplied && `(${student.classApplied})`}
                  </div>
                ))}
              </div>
            )}

            {/* ✅ Fetch Details Button */}
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSelectStudent}
              disabled={!selectedStudent} // Jab tak student select nahi hota, disable rahega
              sx={{ mt: 1 , height:50}} 
            >
              Fetch Details
            </Button>

            {studentDetails && (
              <div className="p-4 border rounded shadow-md mt-2 mb-3">
                <h3 className="text-lg font-bold">Student Fees Details</h3>
                <p>
                  <strong>Status:</strong> {paymentStatus}
                </p>
                <p>
                  <strong>Sponsor Name:</strong>{" "}
                  {sponsorDetails?.sponsorName || "N/A"}
                </p>
                <p>
                  <strong>Sponsor Paying:</strong> ₹{" "}
                  {sponsorDetails?.sponsorPaying || 0}
                </p>
                <p>
                  <strong>Parents Paying:</strong> ₹{" "}
                  {sponsorDetails?.parentsPaying || 0}
                </p>
                <p>
                  <strong>Total Fees:</strong> ₹{totalFees}
                </p>{" "}
                {/* ✅ New Line */}
              </div>
            )}

            {/* ✅ Payment Selector Dropdown */}
            {paymentStatus  === "Semi-Sponsored" ? (
              <FormControl fullWidth className="mt-4"  >
                <InputLabel  >Who is Paying?</InputLabel>
                <Select
                  value={selectedPayer}
                  onChange={(e) => setSelectedPayer(e.target.value)}
                >
                  <MenuItem value="Sponsor">Sponsor</MenuItem>
                  <MenuItem value="Parent">Parent</MenuItem>
                </Select>
              </FormControl>
            ) : (
              <TextField
                fullWidth
                label="Who is Paying?"
                value={selectedPayer}
                disabled
                className="mt-4"
                sx={{ mt: 1.5 }} 
              />
            )}

            <FormLabel className="mt-5" component="legend">
              Payment Mode
            </FormLabel>
            <RadioGroup
              row
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              className="mb-4"
            >
              <FormControlLabel
                value="Offline"
                control={<Radio />}
                label="Offline"
              />
              <FormControlLabel
                value="Online"
                control={<Radio />}
                label="Online"
              />
            </RadioGroup>

            {paymentMode === "Online" ? (
              <TextField
                fullWidth
                label="Transaction ID (Last 4 characters)"
                value={transactionId}
                onChange={(e) =>
                  e.target.value.length <= 4 && setTransactionId(e.target.value)
                }
                sx={{ mb: 1.5 }} // This will apply margin-bottom properly
              />
            ) : (
              <TextField
                fullWidth
                label="Receiver's Name"
                value={receiverName}
                onChange={(e) =>
                  /^[A-Za-z ]*$/.test(e.target.value) &&
                  setReceiverName(e.target.value)
                }
                sx={{ mb: 1.5 }} // This will apply margin-bottom properly
              />
            )}

            <TextField
              fullWidth
              type="number"
              label="Fees Amount"
              value={paymentAmount}
              onChange={(e) =>
                e.target.value.length <= 5 &&
                setPaymentAmount(e.target.value.replace(/[^0-9]/g, ""))
              }
              sx={{ mb: 1.5 }} // This will apply margin-bottom properly
            />

            <Button
              variant="contained"
              // color="success"
              fullWidth
              onClick={handleSubmitPayment}
              className="flex items-center justify-center gap-2"
              disabled={loading}
              sx={{
                height: 50,
                bgcolor: "#33b249",
                "&:hover": { bgcolor: "darkgreen" }, // Hover effect
              }}
            >
              {loading ? (
                <Loader2 className="animate-spin slow-spin" size={20} />
              ) : (
                <CheckCircle size={20} />
              )}
              {loading ? "Processing..." : "Submit Fees"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PaymentPage;

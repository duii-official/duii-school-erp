import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Button,
  Modal,
  Box,
  TextField,
  Snackbar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  useMediaQuery,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { toast } from "react-toastify";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { format } from "date-fns"; // for formatting dates
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
  IndianRupee,
} from "lucide-react";
import { AdminPanelSettings } from "@mui/icons-material"; // Add this line

export default function StudentsDetails() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [editStudent, setEditStudent] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [expanded, setExpanded] = useState(false); // for accordion functionality
  const [searchQuery, setSearchQuery] = useState(""); // for search filter
  const [searchCategory, setSearchCategory] = useState("name"); // default search category (name)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();

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

  // Media query to check if the screen size is smaller than 'md' (medium screens and below)
  const isMobile = useMediaQuery("(max-width: 900px)");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/students");

      //console.log("✅ API Response:", res.data); // API se aane wala data check karne ke liye

      // ✅ Ensure new fields exist, otherwise default to 0
      const updatedStudents = res.data.map((student) => {
        const parentsPaid = student.parentsPaid || 0;
        const sponsorsPaid = student.sponsorsPaid || 0;
        const parentsPaying = student.parentsPaying || 0;
        const sponsorPaying = student.sponsorPaying || 0;
        const totalFees = student.totalFees || 0;

        const updatedStudent = {
          ...student,
          parentsPaid,
          sponsorsPaid,
          parentsRemaining: Math.max(0, parentsPaying - parentsPaid),
          sponsorsRemaining: Math.max(0, sponsorPaying - sponsorsPaid),
          totalRemaining: Math.max(0, totalFees - parentsPaid - sponsorsPaid),
        };

        //console.log("🔍 Updated Student Data:", updatedStudent); // Har student ke updated data ka log

        return updatedStudent;
      });

      setStudents(updatedStudents);
      //console.log("📌 Final Students Data in State:", updatedStudents); // Final state me save hone wala data
    } catch (err) {
      console.error("❌ Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };


  const handleEdit = (student) => {
    setFormData(student);
    setEditStudent(student._id);
    setOpenModal(true);
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/students/${editStudent}`,
        formData
      );
      setStudents(students.map((s) => (s._id === editStudent ? res.data : s)));
      setSnackbarMessage("Student updated successfully!");
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMessage("Failed to update student.");
      setSnackbarOpen(true);
    }
    setOpenModal(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await axios.delete(`http://localhost:5000/api/students/${id}`);
        setStudents(students.filter((student) => student._id !== id));
        setSnackbarMessage("Student deleted successfully!");
        setSnackbarOpen(true);
      } catch (err) {
        setSnackbarMessage("Failed to delete student.");
        setSnackbarOpen(true);
      }
    }
  };

  // Format dates to DD/MM/YYYY
  const formatDate = (dateString) => {
    return format(new Date(dateString), "dd/MM/yyyy");
  };

  // Filter students based on the selected category and search query
  const filteredStudents = students.filter((student) => {
    switch (searchCategory) {
      case "name":
        return student.name.toLowerCase().includes(searchQuery.toLowerCase());
      case "class":
        return student.classApplied
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      case "fatherPhone":
        return student.fatherPhone.includes(searchQuery);
      case "motherPhone":
        return student.motherPhone.includes(searchQuery);
      default:
        return true;
    }
  });

  const updatedRows = filteredStudents.map((student) => ({
    id: student._id,
    ...student,
    dob: formatDate(student.dob), // format date of birth
    admissionDate: formatDate(student.admissionDate), // format admission date
  }));

  const columns = [
    {
      field: "name",
      headerName: "Name",
      width: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "classApplied",
      headerName: "Class",
      width: 80,
      headerAlign: "center",
      align: "center",
    },
    // {
    //   field: "dob",
    //   headerName: "Date of Birth",
    //   width: 100,
    //   headerAlign: "center",
    //   align: "center",
    // },
    // {
    //   field: "admissionDate",
    //   headerName: "Admission Date",
    //   width: 120,
    //   headerAlign: "center",
    //   align: "center",
    // },
    // {
    //   field: "aadharNo",
    //   headerName: "Aadhar No",
    //   width: 130,
    //   headerAlign: "center",
    //   align: "center",
    // },
    // {
    //   field: "fatherPhone",
    //   headerName: "Father's Phone",
    //   width: 120,
    //   headerAlign: "center",
    //   align: "center",
    // },
    // {
    //   field: "motherPhone",
    //   headerName: "Mother's Phone",
    //   width: 120,
    //   headerAlign: "center",
    //   align: "center",
    // },
    {
      field: "totalFees",
      headerName: "Total Fees",
      width: 90,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "parentsPaying",
      headerName: "Parents Declared",
      width: 130,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "parentsPaid",
      headerName: "Parents Paid",
      width: 120,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "parentsRemaining",
      headerName: "Parents Remaining",
      width: 140,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "sponsorPaying",
      headerName: "Sponsor Declared",
      width: 130,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "sponsorsPaid",
      headerName: "Sponsors Paid",
      width: 120,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "sponsorsRemaining",
      headerName: "Sponsors Remaining",
      width: 140,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "sponsorName",
      headerName: "Sponsor Name",
      width: 120,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "totalRemaining",
      headerName: "Total Remaining",
      width: 140,
      headerAlign: "center",
      align: "center",
    },
    // {
    //   field: "sponsorPhone",
    //   headerName: "Sponsor Phone",
    //   width: 120,
    //   headerAlign: "center",
    //   align: "center",
    // },
    {
      field: "actions",
      headerAlign: "center",
      align: "center",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleEdit(params.row)}
            style={{ margin: 5 }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="p-6 rounded-xl ">
      {/* Overlay for mobile menu */}
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
                { icon: IndianRupee, label: "Fees", delay: 0.3 },
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
                    } else if (item.label === "Fees") {
                      navigate("/admin/students/payment"); // Admin Panel route
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
      <div className="lg:ml-72 p-6 lg:p-0">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Student Details
        </h2>

        <Grid container spacing={1} alignItems="center">
          <Grid item xs={4} md={2}>
            <FormControl fullWidth>
              <InputLabel>Search Category</InputLabel>
              <Select
                style={{ marginBottom: 10 }}
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                label="Search Category"
              >
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="class">Class</MenuItem>
                <MenuItem value="fatherPhone">Father's Phone</MenuItem>
                <MenuItem value="motherPhone">Mother's Phone</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {/* Search Bar with Category Selector */}
          <Grid item xs={8} md={10}>
            <TextField
              label={`Search by ${
                searchCategory.charAt(0).toUpperCase() + searchCategory.slice(1)
              }`}
              variant="outlined"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ marginBottom: 10 }}
            />
          </Grid>
        </Grid>

        <Grid
          container
          spacing={0}
          className="shadow-lg shadow-gray-300 rounded-xl"
        >
          {/* DataGrid - visible only on larger screens (md and above) */}
          {!isMobile && (
            <Grid item xs={12} md={12}>
              <div style={{ height: "auto", width: "100%" }}>
                <DataGrid
                  rows={updatedRows}
                  columns={columns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                />
              </div>
            </Grid>
          )}

          {/* Accordion - visible only on smaller screens */}
          {isMobile && (
            <Grid item xs={12}>
              {filteredStudents.map((student) => (
                <Accordion
                  key={student._id}
                  expanded={expanded === student._id}
                  onChange={() =>
                    setExpanded(expanded === student._id ? false : student._id)
                  }
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <div>{student.name}</div>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div>
                      <p>
                        <strong>Class:</strong> {student.classApplied}
                      </p>
                      <p>
                        <strong>Admission Date:</strong>{" "}
                        {formatDate(student.admissionDate)}
                      </p>
                      <p>
                        <strong>Total Fees:</strong> {student.totalFees}
                      </p>

                      {/* ✅ Parents Fee Tracking */}
                      <p>
                        <strong>Parents Declared:</strong>{" "}
                        {student.parentsPaying}
                      </p>
                      <p>
                        <strong>Parents Paid:</strong> {student.parentsPaid}
                      </p>
                      <p>
                        <strong>Parents Remaining:</strong>{" "}
                        {student.parentsRemaining}
                      </p>

                      {/* ✅ Sponsors Fee Tracking */}
                      <p>
                        <strong>Sponsor Declared:</strong>{" "}
                        {student.sponsorPaying}
                      </p>
                      <p>
                        <strong>Sponsors Paid:</strong> {student.sponsorsPaid}
                      </p>
                      <p>
                        <strong>Sponsors Remaining:</strong>{" "}
                        {student.sponsorsRemaining}
                      </p>

                      {/* ✅ Total Remaining Balance */}
                      <p>
                        <strong>Total Remaining:</strong>{" "}
                        {student.totalRemaining}
                      </p>

                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleEdit(student)}
                        style={{ margin: 5 }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleDelete(student._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Grid>
          )}
        </Grid>

        {/* Modal for Edit */}
        <Modal open={openModal} onClose={() => setOpenModal(false)}>
          <Box
            sx={{
              width: 400,
              padding: 3,
              backgroundColor: "white",
              margin: "auto",
              marginTop: 10,
              borderRadius: 2,
            }}
          >
            <h3>Edit Student</h3>
            <TextField
              fullWidth
              label="Name"
              value={formData.name || ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="Class"
              value={formData.classApplied || ""}
              onChange={(e) =>
                setFormData({ ...formData, classApplied: e.target.value })
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="Father's Phone"
              value={formData.fatherPhone || ""}
              onChange={(e) =>
                setFormData({ ...formData, fatherPhone: e.target.value })
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="Mother's Phone"
              value={formData.motherPhone || ""}
              onChange={(e) =>
                setFormData({ ...formData, motherPhone: e.target.value })
              }
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdate}
              style={{ marginTop: 10 }}
            >
              Save
            </Button>
          </Box>
        </Modal>

        {/* Snackbar for Alerts */}
        <Snackbar
          open={snackbarOpen}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        />
      </div>
    </div>
  );
}

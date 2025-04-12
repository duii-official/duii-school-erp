import { useState,useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { TextField, Button, Container, Typography, Grid } from "@mui/material";
import { Alert, Snackbar } from "@mui/material";
import { Sun, Moon, School2, UserPlus, Users, LogOut, Menu, X, TrendingUp, Calendar, DollarSign, Wallet, UserCheck, UserX, Users2,IndianRupee } from 'lucide-react';
import { motion } from 'framer-motion';
import { AdminPanelSettings } from '@mui/icons-material'; // Add this line
import { useNavigate,useLocation, } from 'react-router-dom';


const AddStudent = () => {
  const [student, setStudent] = useState({
    name: "",
    classApplied: "",
    dob: "",
    aadharNo: "",
    address: "",
    fatherName: "",
    motherName: "",
    fatherOccupation: "",
    motherOccupation: "",
    fatherPhone: "",
    motherPhone: "",
    guardianPhone: "",
    admissionDate: "",
    totalFees: "",
    parentsPaying: "",
    sponsorPaying: "",
    sponsorName: "",
    sponsorPhone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validation Rules
    if (name === "name" || name === "fatherName" || name === "motherName" || name === "sponsorName") {
      if (!/^[a-zA-Z ]*$/.test(value)) return;
    }

    if (name === "classApplied" && value.length > 5) return;

    if (name === "aadharNo" && (!/^[0-9]*$/.test(value) || value.length > 12)) return;

    if (name === "address" && value.length > 150) return;

    if (name === "fatherOccupation" || name === "motherOccupation") {
      if (!/^[a-zA-Z ]*$/.test(value)) return;
    }

    if (name === "totalFees" && (!/^[0-9]*$/.test(value) || value.length > 5)) return;
    
    if (["fatherPhone", "motherPhone", "guardianPhone", "sponsorPhone"].includes(name)) {
      if (!/^[0-9]*$/.test(value) || value.length > 10) return;
    }

    if (["parentsPaying", "sponsorPaying"].includes(name)) {
      if (!/^[0-9]*$/.test(value) || value.length > 5) return;
    }

    setStudent({ ...student, [name]: value });
  };


const [alert, setAlert] = useState({ open: false, message: "", severity: "error" });

  const showAlert = (message, severity = "error") => {
    // console.log("Setting Alert:", { open: true, message, severity });
    setAlert({ open: true, message, severity });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("button clicked, Now validating the inputs");

    if (!student.name) return showAlert("❌ Student Name is required");
    // console.log("name validated");

    if (!student.classApplied) return showAlert("❌ Class Applied is required");
    // console.log("class validated");

    if (!student.dob) return showAlert("❌ DOB is required");
    // console.log("dob validated");
    
    if (!student.admissionDate) return showAlert("❌ Admission Date is required");
    // console.log("admisiiondate validated");

    if (!student.aadharNo || student.aadharNo.length !== 12) return showAlert("❌ Aadhar Number must be exactly 12 digits");
    // console.log("aadharNo validated");

    if (!student.address) return showAlert("❌ Address is required");
    // console.log("address validated");


    if (!student.fatherName) return showAlert("❌ Father's Name is required");
    // console.log("fName validated");
    if (!/^\d{10}$/.test(student.fatherPhone)) return showAlert("❌ Father's Phone Number must be exactly 10 digits");
    if (!student.fatherOccupation) return showAlert("❌ Father's Occupation is required");
    // console.log("Foccu validated");

    
    if (!student.motherName) return showAlert("❌ Mother's Name is required");
    // console.log("mName validated");
    if (!/^\d{10}$/.test(student.motherPhone)) return showAlert("❌ Mother's Phone Number must be exactly 10 digits");
    if (!student.motherOccupation) return showAlert("❌ Mother's Occupation is required");
    // console.log("Moccu validated");

    
    if (student.guardianPhone && !/^\d{10}$/.test(student.guardianPhone)) return showAlert("❌ Guardian's Phone Number must be exactly 10 digits or empty");


    if (!student.totalFees) return showAlert("❌ Total Fees is required");
    // console.log("totalfees validated");
    if (student.totalFees && !student.parentsPaying && !student.sponsorPaying) {
      return showAlert("❌ Either Parents Paying or Sponsor Paying is required if Total Fees is filled");
    }


    if (student.parentsPaying && !/^\d{1,5}$/.test(student.parentsPaying)) return showAlert("❌ Parents Paying amount cannot exceed 5 digits");
    if (student.sponsorPaying && !/^\d{1,5}$/.test(student.sponsorPaying)) return showAlert("❌ Sponsor Paying amount cannot exceed 5 digits");
    if (student.sponsorPhone && !/^\d{10}$/.test(student.sponsorPhone)) return showAlert("❌ Sponsor's Phone Number must be exactly 10 digits or empty");

    if (student.sponsorName || student.sponsorPhone || student.sponsorPaying) {
      if (!student.sponsorName) return showAlert("❌ Sponsor Name is required ");
      if (!student.sponsorPhone) return showAlert("❌ Sponsor Phone is required ");
      if (!student.sponsorPaying) return showAlert("❌ Sponsor Paying is required if any sponsor details are provided");
    }
    try {
      // console.log("Submitting Form Data:", student);
      const res = await axios.post("http://localhost:5000/api/students/add", student);
      // console.log("Response Status:", res.status);

      if (res.status === 201) {
        showAlert("✅ Student Added Successfully", "success");
        handleClear();
      }
    } catch (error) {
      // console.error("Submission Error:", error);
      if (error.response && error.response.data.error) {
        showAlert(`❌ ${error.response.data.error}`);
      } else {
        showAlert("❌ Error adding student");
      }
    }
  };







  const handleClear = () => {
    setStudent({
      name: "",
      classApplied: "",
      dob: "",
      aadharNo: "",
      address: "",
      fatherName: "",
      motherName: "",
      fatherOccupation: "",
      motherOccupation: "",
      fatherPhone: "",
      motherPhone: "",
      guardianPhone: "",
      admissionDate: "",
      totalFees: "",
      parentsPaying: "",
      sponsorPaying: "",
      sponsorName: "",
      sponsorPhone: "",
    });
  };



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

   return (
     <Container
       maxWidth="md"
       sx={{ "@media (min-width: 900px)": { maxWidth: "none" } }}
       className="bg-gray-50 mt-5 p-5 rounded-lg shadow-lg"
     >
       <div className="lg:ml-72 p-6 lg:p-0">
         <Typography textAlign={"center"} variant="h4" gutterBottom>
           🎓 New Admission
         </Typography>

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
                 {[
                   {
                     icon: AdminPanelSettings,
                     label: "Admin Panel",
                     delay: 0.3,
                   },
                   { icon: Users, label: "Student Details", delay: 0.2 },
                   {
                     icon: IndianRupee,
                     label: "Fees",
                     delay: 0.3,
                   }, // Added Payments route
                 ].map((item, index) => (
                   <motion.a
                     key={index}
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: item.delay }}
                     whileHover={{ x: 10 }}
                     onClick={() => {
                       if (item.label === "Student Details") {
                         navigate("/admin/students");
                       } 
                       else if (item.label === "Admin Panel") 
                        {
                         navigate("/adminpanel");
                       }
                       else if (item.label === "Fees") 
                        {
                         navigate("/admin/students/payment");
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
               onClick={handleLogout}
             >
               <LogOut className="h-5 w-5" />
               Logout
             </motion.button>
           </div>
         </nav>

         {/* Main Content - Add margin-left for larger screens */}
         <div>
           {" "}
           {/* Added lg:ml-72 */}
           <form onSubmit={handleSubmit}>
             <Snackbar
               open={alert.open}
               autoHideDuration={4000}
               onClose={() => setAlert({ ...alert, open: false })}
               anchorOrigin={{ vertical: "top", horizontal: "center" }}
               TransitionProps={{ timeout: 500 }}
             >
               <Alert
                 onClose={() => setAlert({ ...alert, open: false })}
                 severity={alert.severity}
                 variant="filled"
                 sx={{
                   borderRadius: 3,
                   fontWeight: "bold",
                   padding: 2,
                   display: "flex",
                   justifyContent: "space-between",
                 }}
               >
                 {alert.message}
               </Alert>
             </Snackbar>
             <Grid container spacing={2}>
               {/* Form Fields */}
               <Grid item xs={12} sm={6}>
                 <TextField
                   fullWidth
                   label="Student Name"
                   name="name"
                   value={student.name}
                   onChange={handleChange}
                   required
                 />
               </Grid>
               <Grid item xs={6} sm={3}>
                 <TextField
                   fullWidth
                   label="Class Applied"
                   name="classApplied"
                   value={student.classApplied}
                   onChange={handleChange}
                   required
                 />
               </Grid>
               <Grid item xs={6} sm={3}>
                 <TextField
                   fullWidth
                   type="date"
                   label="DOB"
                   name="dob"
                   value={student.dob}
                   onChange={handleChange}
                   required
                   InputLabelProps={{ shrink: true }}
                 />
               </Grid>

               {/* Other Fields */}
               <Grid item xs={6} sm={2.5}>
                 <TextField
                   fullWidth
                   type="date"
                   label="Admission Date"
                   name="admissionDate"
                   value={student.admissionDate}
                   onChange={handleChange}
                   required
                   InputLabelProps={{ shrink: true }}
                 />
               </Grid>
               <Grid item xs={6} sm={3.5}>
                 <TextField
                   fullWidth
                   label="Aadhar No"
                   name="aadharNo"
                   value={student.aadharNo}
                   onChange={handleChange}
                   required
                 />
               </Grid>
               <Grid item xs={12} sm={6}>
                 <TextField
                   fullWidth
                   label="Address"
                   name="address"
                   value={student.address}
                   onChange={handleChange}
                   required
                 />
               </Grid>

               {/* Parent Details */}
               <Grid item xs={6} sm={4}>
                 <TextField
                   fullWidth
                   label="Father's Name"
                   name="fatherName"
                   value={student.fatherName}
                   onChange={handleChange}
                   required
                 />
               </Grid>
               <Grid item xs={6} sm={4}>
                 <TextField
                   fullWidth
                   label="Father's Phone"
                   name="fatherPhone"
                   value={student.fatherPhone}
                   onChange={handleChange}
                   required
                 />
               </Grid>
               <Grid item xs={6} sm={4}>
                 <TextField
                   fullWidth
                   label="Father's Occupation"
                   name="fatherOccupation"
                   value={student.fatherOccupation}
                   onChange={handleChange}
                 />
               </Grid>
               <Grid item xs={6} sm={4}>
                 <TextField
                   fullWidth
                   label="Mother's Name"
                   name="motherName"
                   value={student.motherName}
                   onChange={handleChange}
                   required
                 />
               </Grid>
               <Grid item xs={6} sm={4}>
                 <TextField
                   fullWidth
                   label="Mother's Phone"
                   name="motherPhone"
                   value={student.motherPhone}
                   onChange={handleChange}
                   required
                 />
               </Grid>
               <Grid item xs={6} sm={4}>
                 <TextField
                   fullWidth
                   label="Mother's Occupation"
                   name="motherOccupation"
                   value={student.motherOccupation}
                   onChange={handleChange}
                 />
               </Grid>

               {/* Contact Details */}
               <Grid item xs={12} sm={6}>
                 <TextField
                   fullWidth
                   label="Guardian's Phone"
                   name="guardianPhone"
                   value={student.guardianPhone}
                   onChange={handleChange}
                 />
               </Grid>

               {/* Fee Details */}
               <Grid item xs={12} sm={6}>
                 <TextField
                   type="number"
                   fullWidth
                   label="Total Fees"
                   name="totalFees"
                   value={student.totalFees}
                   onChange={handleChange}
                   required
                 />
               </Grid>
               <Grid item xs={12} sm={6}>
                 <TextField
                   type="number"
                   fullWidth
                   label="Parents Paying"
                   name="parentsPaying"
                   value={student.parentsPaying}
                   onChange={handleChange}
                 />
               </Grid>

               {/* Sponsor Details */}
               <Grid item xs={12} sm={6}>
                 <TextField
                   type="number"
                   fullWidth
                   label="Sponsor Paying"
                   name="sponsorPaying"
                   value={student.sponsorPaying}
                   onChange={handleChange}
                 />
               </Grid>
               <Grid item xs={12} sm={6}>
                 <TextField
                   fullWidth
                   label="Sponsor Name"
                   name="sponsorName"
                   value={student.sponsorName}
                   onChange={handleChange}
                 />
               </Grid>
               <Grid item xs={12} sm={6}>
                 <TextField
                   fullWidth
                   label="Sponsor Phone"
                   name="sponsorPhone"
                   value={student.sponsorPhone}
                   onChange={handleChange}
                 />
               </Grid>

               {/* Buttons */}
               <Grid container spacing={2} className="mt-5 pt-3 pl-4">
                 <Grid item xs={6}>
                   <Button
                     fullWidth
                     variant="contained"
                     color="secondary"
                     onClick={handleClear}
                     sx={{ height: "50px" }} // Button Height Fixed
                   >
                     ❌ Cancel
                   </Button>
                 </Grid>
                 <Grid item xs={6}>
                   <Button
                     fullWidth
                     variant="contained"
                     color="primary"
                     type="submit"
                     onClick={handleSubmit}
                     sx={{ height: "50px" }} // Button Height Fixed
                   >
                     ✅ Submit
                   </Button>
                 </Grid>
               </Grid>
             </Grid>
           </form>
         </div>
       </div>
     </Container>
   );
};

export default AddStudent;

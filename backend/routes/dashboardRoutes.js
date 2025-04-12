import express from "express";
import Student from '../models/Student.js';
const router = express.Router();

// Get Dashboard Stats
router.get("/stats", async (req, res) => {
    try {
      const students = await Student.find();
      const totalStudents = students.length;
      
      const totalFees = students.reduce((sum, student) => sum + student.totalFees, 0);
      const paidFees = students.reduce((sum, student) => sum + (student.parentsPaid + student.sponsorsPaid), 0);
      const balanceFees = totalFees - paidFees;  // ✅ Fixed
      
      const parentsDeclaredFees = students.reduce((sum, student) => sum + student.parentsPaying, 0);
      const parentsPaidFees = students.reduce((sum, student) => sum + student.parentsPaid, 0);
      const parentsRemainingFees = parentsDeclaredFees - parentsPaidFees;

      
      const sponsorDeclaredFees = students.reduce((sum, student) => sum + student.sponsorPaying, 0);
      const sponsorPaidFees = students.reduce((sum, student) => sum + student.sponsorsPaid, 0);
      const sponsorRemainingFees = sponsorDeclaredFees - sponsorPaidFees;
      
      const fullSponsoredStudents = students.filter(s => s.sponsorPaying && !s.parentsPaying).length;
      const semiSponsoredStudents = students.filter(student => student.sponsorPaying > 0 && student.parentsPaying > 0).length;
      const notSponsoredStudents = students.filter(s => !s.sponsorPaying && s.parentsPaying).length;
      
      res.json({
        totalStudents,
        totalFees,
        paidFees,
        balanceFees, // ✅ Corrected
        parentsPaidFees,
        parentsDeclaredFees,
        parentsRemainingFees,
        sponsorDeclaredFees,
        sponsorPaidFees,
        sponsorRemainingFees,
        fullSponsoredStudents,
        semiSponsoredStudents,
        notSponsoredStudents
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
  export default router;
  

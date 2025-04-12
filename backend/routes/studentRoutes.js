import express from "express";
import Student from '../models/Student.js';


const router = express.Router();

// ✅ Add New Student
router.post("/add", async (req, res) => {
  try {
    console.log("📩 Received Data:", req.body);

    const {
      name,
      classApplied,
      dob,
      aadharNo,
      address,
      fatherName,
      motherName,
      fatherOccupation,
      motherOccupation,
      fatherPhone,
      motherPhone,
      guardianPhone,
      admissionDate,
      totalFees,
      parentsPaying,
      sponsorPaying,
      sponsorName,
      sponsorPhone,
    } = req.body;

    // ✅ Required Fields Validation
    if (
      !name ||
      !classApplied ||
      !dob ||
      !aadharNo ||
      !address ||
      !fatherName ||
      !motherName ||
      !fatherPhone ||
      !motherPhone ||
      !admissionDate ||
      !totalFees
    ) {
      console.log("❌ Validation Failed: Missing Fields");
      return res.status(400).json({ error: "All required fields must be filled" });
    }

    // ✅ Create & Save Student
    const newStudent = new Student({
      name,
      classApplied,
      dob,
      aadharNo,
      address,
      fatherName,
      motherName,
      fatherOccupation,
      motherOccupation,
      fatherPhone,
      motherPhone,
      guardianPhone,
      admissionDate,
      totalFees,
      parentsPaying,
      sponsorPaying,
      sponsorName,
      sponsorPhone,
    });

    await newStudent.save();
    console.log("✅ Student Added Successfully");
    res.status(201).json({ message: "Student added successfully" });
  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ error: "Server error, try again later" });
  }
});


// ✅ Get All Students
router.get("/", async (req, res) => {
  try {
    const students = await Student.find({}).lean(); // 🔥 Yeh ensure karega ke fresh data aaye
    console.log("📢 Backend Response:", students); // ✅ Yeh check karega ke backend kaunsa data bhej raha hai
    res.json(students);
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

// ✅ Get a Single Student by ID
// router.get("/:id", async (req, res) => {
//   try {
//     const student = await Student.findById(req.params.id);
//     if (!student) {
//       return res.status(404).json({ error: "Student not found" });
//     }
//     res.json(student);
//   } catch (err) {
//     res.status(500).json({ error: "Server error" });
//   }
// });


router.get("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // ✅ Yeh naye fields frontend ko bhej rahe hain
    res.json({
      name: student.name,
      classApplied: student.classApplied,
      totalFees: student.totalFees,
      parentsPaying: student.parentsPaying,
      sponsorPaying: student.sponsorPaying,
      parentsPaid: student.parentsPaid,
      sponsorsPaid: student.sponsorsPaid,
      parentsRemaining: student.parentsRemaining,
      sponsorsRemaining: student.sponsorsRemaining,
      totalRemaining: student.totalRemaining,
      sponsorName: student.sponsorName || "N/A",
    });
  } catch (err) {
    console.error("❌ Error Fetching Student Details:", err);
    res.status(500).json({ error: "Server error, please try again" });
  }
});




// ✅ Update Student
router.put("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    Object.keys(req.body).forEach((key) => {
      if (req.body[key] !== undefined) {
        student[key] = req.body[key];
      }
    });

    const updatedStudent = await student.save();
    res.json(updatedStudent);
  } catch (err) {
    res.status(500).json({ error: "Failed to update student" });
  }
});

// ✅ Delete Student
router.delete("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    await student.deleteOne();
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete student" });
  }
});

export default router;

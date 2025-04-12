import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    classApplied: { type: String, required: true, maxlength: 5 },
    dob: { type: Date, required: true },
    aadharNo: { type: String, required: true, match: /^\d{12}$/ },
    address: { type: String, required: true, maxlength: 150 },
    fatherName: { type: String, required: true, trim: true },
    motherName: { type: String, required: true, trim: true },
    fatherOccupation: { type: String, required: false, trim: true },
    motherOccupation: { type: String, required: false, trim: true },
    fatherPhone: { type: String, required: true, match: /^\d{10}$/ },
    motherPhone: { type: String, required: true, match: /^\d{10}$/ },
    guardianPhone: { type: String, required: false, match: /^\d{10}$/ },
    admissionDate: { type: Date, required: true },

    // ✅ Fees fields changed to Number
    totalFees: { type: Number, required: true },
    parentsPaying: { type: Number, required: false, default: 0 },
    sponsorPaying: { type: Number, required: false, default: 0 },

    sponsorName: { type: String, required: false, trim: true },
    sponsorPhone: { type: String, required: false, match: /^\d{10}$/ },

    parentsPaid: { type: Number, default: 0 },  // Parents ne kitna pay kiya hai
    sponsorsPaid: { type: Number, default: 0 },  // Sponsor ne kitna pay kiya hai
    parentsRemaining: { type: Number, default: 0 },  // Parents ka remaining balance
    sponsorsRemaining: { type: Number, default: 0 },  // Sponsors ka remaining balance
    totalRemaining: { type: Number, default: 0 },  // Total remaining balance (Parents + Sponsors)

  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);
export default Student;

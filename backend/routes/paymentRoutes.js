import express from 'express';
import Payment from '../models/Payment.js';  // Yeh sahi hona chahiye
import Student from '../models/student.js';


const router = express.Router();

// ✅ Get All Students
router.get('/students', async (req, res) => {
  try {
    const students = await Student.find({}, '_id name classApplied');
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// ✅ Record Payment
router.post('/pay/:studentId', async (req, res) => {
  const { studentId } = req.params;
  let { paymentAmount, paymentMode, transactionId, receiverName, payer } = req.body;

  try {
    // ✅ Ensure paymentAmount is a number
    paymentAmount = Number(paymentAmount);
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      return res.status(400).json({ error: 'Invalid payment amount' });
    }

    // ✅ Student Find Karo
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    //console.log("🟡 Payer:", payer);  // ✅ Debugging ke liye

    // ✅ Payment Save Karo
    const payment = new Payment({
      studentId,
      paymentAmount,
      paymentMode,
      transactionId: paymentMode === 'Online' ? transactionId : '',
      receiverName: paymentMode === 'Offline' ? receiverName : '',
    });

    await payment.save();
    //console.log("✅ Payment saved:", payment);

    let updateFields = {}; // ✅ Yeh object me updated fields rakhenge

    // ✅ Balance Update Logic
    if (payer === "Parent") {
      updateFields.parentsPaid = (student.parentsPaid || 0) + paymentAmount;
      updateFields.parentsRemaining = Math.max(0, (student.parentsPaying || 0) - updateFields.parentsPaid);
    } else if (payer === "Sponsor") {
      updateFields.sponsorsPaid = (student.sponsorsPaid || 0) + paymentAmount;
      updateFields.sponsorsRemaining = Math.max(0, (student.sponsorPaying || 0) - updateFields.sponsorsPaid);
    }

    // ✅ Always update total remaining
    updateFields.totalRemaining = (updateFields.parentsRemaining || student.parentsRemaining) + 
                                  (updateFields.sponsorsRemaining || student.sponsorsRemaining);

    // ✅ Use findByIdAndUpdate instead of save()
    const updatedStudent = await Student.findByIdAndUpdate(studentId, updateFields, { new: true });

    //console.log("✅ Updated Student Data:", updatedStudent); // 🟢 Debugging ke liye

    res.status(200).json({ success: true, message: 'Payment recorded successfully & balance updated', student: updatedStudent });

  } catch (err) {
    console.error("❌ Payment Error:", err);
    res.status(500).json({ error: 'Server error, please try again' });
  }
});




export default router;

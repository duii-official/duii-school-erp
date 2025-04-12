import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  paymentAmount: { type: Number, required: true },
  paymentMode: { type: String, enum: ['Online', 'Offline'], required: true },
  transactionId: { 
    type: String, 
    required: function() { return this.paymentMode === 'Online'; }  // ✅ Required only if Online
  },
  receiverName: { 
    type: String, 
    required: function() { return this.paymentMode === 'Offline'; }  // ✅ Required only if Offline
  },
  paymentDate: { type: Date, default: () => new Date() },  // ✅ Best Practice
});

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;

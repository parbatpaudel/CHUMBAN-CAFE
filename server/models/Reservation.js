const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  customerName: { 
    type: String, 
    required: [true, 'Customer name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  customerEmail: { 
    type: String, 
    required: [true, 'Email is required'],
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  customerPhone: { 
    type: String, 
    required: [true, 'Phone number is required'],
    match: [/^[0-9+\-\s()]+$/, 'Please enter a valid phone number']
  },
  numberOfSeats: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },
  slot: {
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true }
  },
  reservedSeats: [{
    tableId: String,
    seatId: String
  }],
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'restaurant'],
    default: 'pending'
  },
  bookingStatus: {
    type: String,
    enum: ['pending_approval', 'confirmed', 'cancelled'],
    default: 'pending_approval'
  },
  paymentMethod: {
    type: String,
    enum: ['pay_now', 'pay_at_restaurant']
  },
  transactionId: String,
  confirmationCode: String
}, {
  timestamps: true
});

// Index for preventing double bookings
reservationSchema.index({ "slot.startTime": 1, "slot.endTime": 1, "reservedSeats.seatId": 1 });

module.exports = mongoose.model('Reservation', reservationSchema);
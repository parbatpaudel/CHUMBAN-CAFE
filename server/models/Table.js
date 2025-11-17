const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  seatId: { type: String, required: true }, // e.g., T01-S1
  isReserved: { type: Boolean, default: false }
});

const tableSchema = new mongoose.Schema({
  tableId: { type: String, required: true, unique: true }, // e.g., T01
  tableName: { type: String, required: true },
  seats: [seatSchema],
  isReservable: { type: Boolean, default: true },
  status: { 
    type: String, 
    enum: ['open', 'closed'], 
    default: 'open' 
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Table', tableSchema);
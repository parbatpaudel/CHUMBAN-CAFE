const Reservation = require('../models/Reservation');
const Table = require('../models/Table');

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const totalToday = await Reservation.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow }
    });
    
    const pendingApprovals = await Reservation.countDocuments({
      bookingStatus: 'pending_approval'
    });
    
    const confirmedBookings = await Reservation.countDocuments({
      bookingStatus: 'confirmed'
    });
    
    res.json({
      totalToday,
      pendingApprovals,
      confirmedBookings
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard stats' });
  }
};

// Get all reservations with filters
const getAllReservations = async (req, res) => {
  try {
    const { date, slot, tableId, status } = req.query;
    
    let filter = {};
    
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      
      filter['slot.startTime'] = { $gte: startDate, $lt: endDate };
    }
    
    if (slot) {
      // Apply slot filtering logic
    }
    
    if (tableId) {
      filter['reservedSeats.tableId'] = tableId;
    }
    
    if (status) {
      filter.bookingStatus = status;
    }
    
    const reservations = await Reservation.find(filter)
      .sort({ createdAt: -1 })
      .populate('reservedSeats');
    
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reservations' });
  }
};

// Approve/reject reservation
const updateReservationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'confirmed' or 'cancelled'
    
    const reservation = await Reservation.findByIdAndUpdate(
      id,
      { bookingStatus: status },
      { new: true }
    );
    
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    
    res.json({
      message: `Reservation ${status}`,
      reservation
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating reservation status' });
  }
};

// Manage tables
const manageTables = async (req, res) => {
  try {
    const { tableId, isReservable, status } = req.body;
    
    const table = await Table.findOneAndUpdate(
      { tableId },
      { isReservable, status },
      { new: true }
    );
    
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }
    
    res.json({
      message: 'Table updated successfully',
      table
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating table' });
  }
};

module.exports = {
  getDashboardStats,
  getAllReservations,
  updateReservationStatus,
  manageTables
};
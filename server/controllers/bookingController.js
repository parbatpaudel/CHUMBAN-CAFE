const Reservation = require('../models/Reservation');
const Table = require('../models/Table');

// Get available time slots
const getTimeSlots = async (req, res) => {
  try {
    // Define time slots with 30-minute buffer
    const slots = [
      { startTime: '07:00', endTime: '09:00' },
      { startTime: '09:30', endTime: '11:30' },
      { startTime: '12:00', endTime: '14:00' },
      { startTime: '14:30', endTime: '16:30' },
      { startTime: '17:00', endTime: '19:00' },
      { startTime: '19:30', endTime: '21:30' }
    ];
    
    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching time slots' });
  }
};

// Get available tables for a specific slot
const getAvailableTables = async (req, res) => {
  try {
    const { date, startTime, endTime } = req.query;
    
    // Convert to proper date format
    const slotStart = new Date(`${date}T${startTime}:00`);
    const slotEnd = new Date(`${date}T${endTime}:00`);
    
    // Find conflicting reservations
    const conflictingReservations = await Reservation.find({
      $or: [
        {
          'slot.startTime': { $lt: slotEnd },
          'slot.endTime': { $gt: slotStart }
        }
      ],
      bookingStatus: { $in: ['confirmed', 'pending_approval'] }
    });
    
    // Get all reservable tables
    const allTables = await Table.find({ isReservable: true, status: 'open' });
    
    // Mark reserved seats
    const reservedSeatIds = conflictingReservations.flatMap(reservation => 
      reservation.reservedSeats.map(seat => seat.seatId)
    );
    
    // Update tables with reservation status
    const tablesWithAvailability = allTables.map(table => {
      const updatedSeats = table.seats.map(seat => ({
        ...seat.toObject(),
        isReserved: reservedSeatIds.includes(seat.seatId)
      }));
      
      return {
        ...table.toObject(),
        seats: updatedSeats
      };
    });
    
    res.json(tablesWithAvailability);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching available tables' });
  }
};

// Create a new reservation
const createReservation = async (req, res) => {
  try {
    const { 
      customerName, 
      customerEmail, 
      customerPhone, 
      numberOfSeats, 
      slot,
      reservedSeats,
      paymentMethod
    } = req.body;
    
    // Validate input
    if (numberOfSeats > 5) {
      return res.status(400).json({ message: 'Maximum 5 seats allowed per booking' });
    }
    
    // Check for conflicts
    const slotStart = new Date(slot.startTime);
    const slotEnd = new Date(slot.endTime);
    
    const conflictingReservations = await Reservation.find({
      'reservedSeats.seatId': { $in: reservedSeats.map(s => s.seatId) },
      $or: [
        {
          'slot.startTime': { $lt: slotEnd },
          'slot.endTime': { $gt: slotStart }
        }
      ]
    });
    
    if (conflictingReservations.length > 0) {
      return res.status(400).json({ message: 'Selected seats are already reserved for this time slot' });
    }
    
    // Create reservation
    const reservation = new Reservation({
      customerName,
      customerEmail,
      customerPhone,
      numberOfSeats,
      slot: {
        startTime: slotStart,
        endTime: slotEnd
      },
      reservedSeats,
      paymentMethod,
      paymentStatus: paymentMethod === 'pay_now' ? 'paid' : 'restaurant',
      bookingStatus: paymentMethod === 'pay_now' ? 'confirmed' : 'pending_approval'
    });
    
    await reservation.save();
    
    res.status(201).json({
      message: 'Reservation created successfully',
      reservation
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating reservation' });
  }
};

module.exports = {
  getTimeSlots,
  getAvailableTables,
  createReservation
};
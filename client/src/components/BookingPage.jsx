import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './BookingPage.css'

const BookingPage = () => {
  const navigate = useNavigate()
  
  const [step, setStep] = useState(1) // 1: Select slot, 2: Select seats, 3: Customer info, 4: Payment, 5: Confirmation
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [selectedSeats, setSelectedSeats] = useState([])
  const [availableTables, setAvailableTables] = useState([])
  const [timeSlots, setTimeSlots] = useState([])
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    numberOfSeats: 1
  })
  const [paymentMethod, setPaymentMethod] = useState('pay_now')
  
  // Fetch time slots
  useEffect(() => {
    const fetchTimeSlots = async () => {
      try {
        // In a real app, this would be an API call
        const slots = [
          { startTime: '07:00', endTime: '09:00' },
          { startTime: '09:30', endTime: '11:30' },
          { startTime: '12:00', endTime: '14:00' },
          { startTime: '14:30', endTime: '16:30' },
          { startTime: '17:00', endTime: '19:00' },
          { startTime: '19:30', endTime: '21:30' }
        ]
        setTimeSlots(slots)
      } catch (error) {
        console.error('Error fetching time slots:', error)
      }
    }
    
    fetchTimeSlots()
  }, [])
  
  // Handle slot selection
  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot)
    setStep(2)
    
    // In a real app, this would fetch available tables for the selected slot
    const mockTables = [
      {
        tableId: 'T01',
        tableName: 'Table 1',
        seats: [
          { seatId: 'T01-S1', isReserved: false },
          { seatId: 'T01-S2', isReserved: false }
        ]
      },
      {
        tableId: 'T02',
        tableName: 'Table 2',
        seats: [
          { seatId: 'T02-S1', isReserved: false },
          { seatId: 'T02-S2', isReserved: false }
        ]
      }
    ]
    setAvailableTables(mockTables)
  }
  
  // Handle seat selection
  const handleSeatSelect = (seat) => {
    if (selectedSeats.some(s => s.seatId === seat.seatId)) {
      // Deselect seat
      setSelectedSeats(selectedSeats.filter(s => s.seatId !== seat.seatId))
    } else {
      // Select seat if within limit
      if (selectedSeats.length < formData.numberOfSeats) {
        setSelectedSeats([...selectedSeats, seat])
      }
    }
  }
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }
  
  // Handle number of seats change
  const handleSeatCountChange = (e) => {
    const count = parseInt(e.target.value)
    setFormData({
      ...formData,
      numberOfSeats: count
    })
    // Reset selected seats when count changes
    setSelectedSeats([])
  }
  
  // Proceed to next step
  const nextStep = () => {
    if (step === 2 && selectedSeats.length !== formData.numberOfSeats) {
      alert(`Please select exactly ${formData.numberOfSeats} seats`)
      return
    }
    setStep(step + 1)
  }
  
  // Go back to previous step
  const prevStep = () => {
    setStep(step - 1)
  }
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      // In a real app, this would be an API call to create the reservation
      const reservationData = {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        numberOfSeats: formData.numberOfSeats,
        slot: selectedSlot,
        reservedSeats: selectedSeats,
        paymentMethod: paymentMethod
      }
      
      console.log('Reservation data:', reservationData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Move to confirmation step
      setStep(5)
    } catch (error) {
      console.error('Error creating reservation:', error)
      alert('Error creating reservation. Please try again.')
    }
  }
  
  // Render step 1: Time slot selection
  const renderSlotSelection = () => (
    <div className="booking-step">
      <h2>Select Time Slot</h2>
      <div className="slots-container">
        {timeSlots.map((slot, index) => (
          <button
            key={index}
            className="slot-button"
            onClick={() => handleSlotSelect(slot)}
          >
            {slot.startTime} - {slot.endTime}
          </button>
        ))}
      </div>
    </div>
  )
  
  // Render step 2: Seat selection
  const renderSeatSelection = () => (
    <div className="booking-step">
      <h2>Select Seats</h2>
      <p>Number of seats needed: {formData.numberOfSeats}</p>
      <p>Selected: {selectedSeats.length} seats</p>
      
      <div className="tables-container">
        {availableTables.map(table => (
          <div key={table.tableId} className="table">
            <h3>{table.tableName}</h3>
            <div className="seats-grid">
              {table.seats.map(seat => (
                <button
                  key={seat.seatId}
                  className={`seat-button ${
                    seat.isReserved ? 'reserved' : 
                    selectedSeats.some(s => s.seatId === seat.seatId) ? 'selected' : ''
                  }`}
                  onClick={() => !seat.isReserved && handleSeatSelect(seat)}
                  disabled={seat.isReserved}
                >
                  {seat.seatId}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="step-buttons">
        <button onClick={prevStep}>Back</button>
        <button 
          onClick={nextStep}
          disabled={selectedSeats.length !== formData.numberOfSeats}
        >
          Continue
        </button>
      </div>
    </div>
  )
  
  // Render step 3: Customer information
  const renderCustomerInfo = () => (
    <div className="booking-step">
      <h2>Customer Information</h2>
      <form onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
        <div className="form-group">
          <label htmlFor="customerName">Full Name</label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            value={formData.customerName}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="customerEmail">Email</label>
          <input
            type="email"
            id="customerEmail"
            name="customerEmail"
            value={formData.customerEmail}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="customerPhone">Phone Number</label>
          <input
            type="tel"
            id="customerPhone"
            name="customerPhone"
            value={formData.customerPhone}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="numberOfSeats">Number of Seats</label>
          <select
            id="numberOfSeats"
            name="numberOfSeats"
            value={formData.numberOfSeats}
            onChange={handleSeatCountChange}
          >
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>
        
        <div className="step-buttons">
          <button onClick={prevStep}>Back</button>
          <button type="submit">Continue</button>
        </div>
      </form>
    </div>
  )
  
  // Render step 4: Payment method
  const renderPaymentMethod = () => (
    <div className="booking-step">
      <h2>Payment Method</h2>
      <div className="payment-options">
        <div 
          className={`payment-option ${paymentMethod === 'pay_now' ? 'selected' : ''}`}
          onClick={() => setPaymentMethod('pay_now')}
        >
          <h3>Pay Now</h3>
          <p>Pay online with eSewa for instant confirmation</p>
        </div>
        
        <div 
          className={`payment-option ${paymentMethod === 'pay_at_restaurant' ? 'selected' : ''}`}
          onClick={() => setPaymentMethod('pay_at_restaurant')}
        >
          <h3>Pay at Restaurant</h3>
          <p>Pay when you arrive. Requires admin approval.</p>
        </div>
      </div>
      
      <div className="step-buttons">
        <button onClick={prevStep}>Back</button>
        <button onClick={nextStep}>Continue</button>
      </div>
    </div>
  )
  
  // Render step 5: Confirmation
  const renderConfirmation = () => (
    <div className="booking-step">
      <h2>Booking Confirmed!</h2>
      <div className="confirmation-details">
        <p>Thank you for your reservation at Chumban Cafe.</p>
        <div className="booking-summary">
          <h3>Booking Summary</h3>
          <p><strong>Name:</strong> {formData.customerName}</p>
          <p><strong>Email:</strong> {formData.customerEmail}</p>
          <p><strong>Phone:</strong> {formData.customerPhone}</p>
          <p><strong>Time Slot:</strong> {selectedSlot?.startTime} - {selectedSlot?.endTime}</p>
          <p><strong>Seats:</strong> {selectedSeats.map(s => s.seatId).join(', ')}</p>
          <p><strong>Payment Method:</strong> {paymentMethod === 'pay_now' ? 'Pay Now' : 'Pay at Restaurant'}</p>
        </div>
      </div>
      
      <div className="step-buttons">
        <button onClick={() => navigate('/')}>Back to Home</button>
      </div>
    </div>
  )
  
  return (
    <div className="booking-page">
      <header className="booking-header">
        <h1>Table Reservation</h1>
        <p>Step {step} of 5</p>
      </header>
      
      <main className="booking-main">
        {step === 1 && renderSlotSelection()}
        {step === 2 && renderSeatSelection()}
        {step === 3 && renderCustomerInfo()}
        {step === 4 && renderPaymentMethod()}
        {step === 5 && renderConfirmation()}
      </main>
    </div>
  )
}

export default BookingPage
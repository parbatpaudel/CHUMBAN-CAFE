import React, { useState, useEffect } from 'react'
import './AdminPanel.css'

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [reservations, setReservations] = useState([])
  const [tables, setTables] = useState([])
  const [stats, setStats] = useState({
    totalToday: 0,
    pendingApprovals: 0,
    confirmedBookings: 0
  })
  
  // Mock data for demonstration
  useEffect(() => {
    // In a real app, this would be API calls
    const mockReservations = [
      {
        id: 1,
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerPhone: '123-456-7890',
        numberOfSeats: 2,
        slot: { startTime: '2023-01-01T07:00:00', endTime: '2023-01-01T09:00:00' },
        reservedSeats: [{ tableId: 'T01', seatId: 'T01-S1' }, { tableId: 'T01', seatId: 'T01-S2' }],
        paymentStatus: 'paid',
        bookingStatus: 'confirmed',
        paymentMethod: 'pay_now',
        createdAt: '2023-01-01T10:00:00Z'
      },
      {
        id: 2,
        customerName: 'Jane Smith',
        customerEmail: 'jane@example.com',
        customerPhone: '098-765-4321',
        numberOfSeats: 4,
        slot: { startTime: '2023-01-01T12:00:00', endTime: '2023-01-01T14:00:00' },
        reservedSeats: [
          { tableId: 'T02', seatId: 'T02-S1' },
          { tableId: 'T02', seatId: 'T02-S2' },
          { tableId: 'T03', seatId: 'T03-S1' },
          { tableId: 'T03', seatId: 'T03-S2' }
        ],
        paymentStatus: 'restaurant',
        bookingStatus: 'pending_approval',
        paymentMethod: 'pay_at_restaurant',
        createdAt: '2023-01-01T11:00:00Z'
      }
    ]
    
    const mockTables = [
      {
        tableId: 'T01',
        tableName: 'Table 1',
        seats: [
          { seatId: 'T01-S1', isReserved: false },
          { seatId: 'T01-S2', isReserved: false }
        ],
        isReservable: true,
        status: 'open'
      },
      {
        tableId: 'T02',
        tableName: 'Table 2',
        seats: [
          { seatId: 'T02-S1', isReserved: false },
          { seatId: 'T02-S2', isReserved: false }
        ],
        isReservable: true,
        status: 'open'
      }
    ]
    
    const mockStats = {
      totalToday: 5,
      pendingApprovals: 2,
      confirmedBookings: 3
    }
    
    setReservations(mockReservations)
    setTables(mockTables)
    setStats(mockStats)
  }, [])
  
  // Handle reservation status update
  const handleStatusUpdate = (reservationId, status) => {
    // In a real app, this would be an API call
    setReservations(reservations.map(reservation => 
      reservation.id === reservationId 
        ? { ...reservation, bookingStatus: status } 
        : reservation
    ))
    
    // Update stats
    if (status === 'confirmed') {
      setStats({
        ...stats,
        pendingApprovals: stats.pendingApprovals - 1,
        confirmedBookings: stats.confirmedBookings + 1
      })
    }
  }
  
  // Handle table management
  const handleTableUpdate = (tableId, updates) => {
    // In a real app, this would be an API call
    setTables(tables.map(table => 
      table.tableId === tableId 
        ? { ...table, ...updates } 
        : table
    ))
  }
  
  // Render dashboard tab
  const renderDashboard = () => (
    <div className="dashboard">
      <h2>Dashboard</h2>
      
      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Reservations Today</h3>
          <p className="stat-number">{stats.totalToday}</p>
        </div>
        
        <div className="stat-card">
          <h3>Pending Approvals</h3>
          <p className="stat-number">{stats.pendingApprovals}</p>
        </div>
        
        <div className="stat-card">
          <h3>Confirmed Bookings</h3>
          <p className="stat-number">{stats.confirmedBookings}</p>
        </div>
      </div>
      
      <div className="reservations-list">
        <h3>Recent Reservations</h3>
        <table className="reservations-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Contact</th>
              <th>Time Slot</th>
              <th>Seats</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map(reservation => (
              <tr key={reservation.id}>
                <td>{reservation.customerName}</td>
                <td>{reservation.customerEmail}<br/>{reservation.customerPhone}</td>
                <td>{new Date(reservation.slot.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(reservation.slot.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                <td>{reservation.reservedSeats.length}</td>
                <td>
                  <span className={`status-badge ${reservation.bookingStatus}`}>
                    {reservation.bookingStatus.replace('_', ' ')}
                  </span>
                </td>
                <td>
                  <span className={`payment-badge ${reservation.paymentStatus}`}>
                    {reservation.paymentStatus}
                  </span>
                </td>
                <td>
                  {reservation.bookingStatus === 'pending_approval' && (
                    <div className="action-buttons">
                      <button 
                        className="approve-btn"
                        onClick={() => handleStatusUpdate(reservation.id, 'confirmed')}
                      >
                        Approve
                      </button>
                      <button 
                        className="reject-btn"
                        onClick={() => handleStatusUpdate(reservation.id, 'cancelled')}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
  
  // Render reservations management tab
  const renderReservations = () => (
    <div className="reservations-management">
      <h2>Reservations Management</h2>
      
      <div className="filters">
        <input type="date" placeholder="Filter by date" />
        <select>
          <option>All Slots</option>
          <option>07:00-09:00</option>
          <option>09:30-11:30</option>
          <option>12:00-14:00</option>
        </select>
        <select>
          <option>All Tables</option>
          <option>Table 1</option>
          <option>Table 2</option>
        </select>
        <select>
          <option>All Statuses</option>
          <option>Confirmed</option>
          <option>Pending Approval</option>
          <option>Cancelled</option>
        </select>
        <button className="filter-btn">Apply Filters</button>
      </div>
      
      <table className="reservations-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Contact</th>
            <th>Date</th>
            <th>Time Slot</th>
            <th>Seats</th>
            <th>Status</th>
            <th>Payment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map(reservation => (
            <tr key={reservation.id}>
              <td>{reservation.customerName}</td>
              <td>{reservation.customerEmail}<br/>{reservation.customerPhone}</td>
              <td>{new Date(reservation.createdAt).toLocaleDateString()}</td>
              <td>{new Date(reservation.slot.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(reservation.slot.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
              <td>{reservation.reservedSeats.map(s => s.seatId).join(', ')}</td>
              <td>
                <span className={`status-badge ${reservation.bookingStatus}`}>
                  {reservation.bookingStatus.replace('_', ' ')}
                </span>
              </td>
              <td>
                <span className={`payment-badge ${reservation.paymentStatus}`}>
                  {reservation.paymentStatus}
                </span>
              </td>
              <td>
                {reservation.bookingStatus === 'pending_approval' && (
                  <div className="action-buttons">
                    <button 
                      className="approve-btn"
                      onClick={() => handleStatusUpdate(reservation.id, 'confirmed')}
                    >
                      Approve
                    </button>
                    <button 
                      className="reject-btn"
                      onClick={() => handleStatusUpdate(reservation.id, 'cancelled')}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
  
  // Render table management tab
  const renderTableManagement = () => (
    <div className="table-management">
      <h2>Table Management</h2>
      
      <div className="tables-grid">
        {tables.map(table => (
          <div key={table.tableId} className="table-card">
            <h3>{table.tableName} ({table.tableId})</h3>
            
            <div className="table-status">
              <label>
                <input
                  type="checkbox"
                  checked={table.isReservable}
                  onChange={(e) => handleTableUpdate(table.tableId, { isReservable: e.target.checked })}
                />
                Reservable
              </label>
              
              <label>
                Status:
                <select
                  value={table.status}
                  onChange={(e) => handleTableUpdate(table.tableId, { status: e.target.value })}
                >
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </label>
            </div>
            
            <div className="seats-info">
              <h4>Seats</h4>
              <div className="seats-list">
                {table.seats.map(seat => (
                  <span 
                    key={seat.seatId} 
                    className={`seat-badge ${seat.isReserved ? 'reserved' : 'available'}`}
                  >
                    {seat.seatId}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
  
  return (
    <div className="admin-panel">
      <header className="admin-header">
        <h1>Admin Panel</h1>
        <button className="logout-btn">Logout</button>
      </header>
      
      <nav className="admin-nav">
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={activeTab === 'reservations' ? 'active' : ''}
          onClick={() => setActiveTab('reservations')}
        >
          Reservations
        </button>
        <button 
          className={activeTab === 'tables' ? 'active' : ''}
          onClick={() => setActiveTab('tables')}
        >
          Table Management
        </button>
        <button 
          className={activeTab === 'settings' ? 'active' : ''}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </nav>
      
      <main className="admin-main">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'reservations' && renderReservations()}
        {activeTab === 'tables' && renderTableManagement()}
        {activeTab === 'settings' && (
          <div className="settings">
            <h2>Settings</h2>
            <p>Settings management coming soon...</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default AdminPanel
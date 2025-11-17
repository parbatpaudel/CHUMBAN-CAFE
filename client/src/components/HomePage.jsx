import React from 'react'
import { Link } from 'react-router-dom'
import '../App.css'

const HomePage = () => {
  return (
    <div className="home-page">
      <header className="home-header">
        <h1>Welcome to Chumban Cafe</h1>
        <p>Experience the finest coffee in a cozy atmosphere</p>
      </header>
      
      <main className="home-main">
        <section className="hero-section">
          <h2>Reserve Your Table Online</h2>
          <p>Book your table in advance to ensure you get the best spot in our cafe.</p>
          <Link to="/booking" className="booking-button">
            Book a Table Now
          </Link>
        </section>
        
        <section className="info-section">
          <div className="info-card">
            <h3>Opening Hours</h3>
            <p>Monday - Sunday: 7:00 AM - 9:00 PM</p>
          </div>
          
          <div className="info-card">
            <h3>Location</h3>
            <p>123 Cafe Street, Coffee City</p>
          </div>
          
          <div className="info-card">
            <h3>Contact</h3>
            <p>Phone: (123) 456-7890</p>
            <p>Email: info@chumbancafe.com</p>
          </div>
        </section>
      </main>
    </div>
  )
}

export default HomePage
# Chumban Cafe Reservation System

A complete online table reservation system for Chumban Cafe built with the MERN stack.

## Features

### User Booking System
- Time slot selection with 30-minute buffer
- Visual table and seat selection
- Multi-seat booking across tables
- Payment options (Pay Now with eSewa or Pay at Restaurant)
- Email confirmations
- Prevention of double-bookings

### Admin Panel
- Dashboard with statistics
- Reservation management
- Table management
- Approval/rejection of pending bookings
- Settings configuration

## Tech Stack

- **Frontend**: React.js with Vite
- **Backend**: Node.js with Express
- **Database**: MongoDB Atlas
- **Authentication**: JWT
- **Deployment**: Render (backend), Vercel/Netlify (frontend)

## Project Structure

```
CHUMBAN-CAFE/
├── client/                 # React frontend
├── server/                 # Node.js backend
└── README.md
```

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```
   npm run install:all
   ```
3. Set up environment variables in `server/.env`
4. Run the development server:
   ```
   npm run dev
   ```

## Environment Variables

Create a `server/.env` file with the following variables:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=admin@chumbancafe.com
# ... other variables
```

## Deployment

The application is configured for deployment on Render for the backend and Vercel/Netlify for the frontend.

## License

MIT
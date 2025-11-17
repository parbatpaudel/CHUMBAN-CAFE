const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Generate JWT token
const generateToken = (adminId) => {
  return jwt.sign(
    { adminId },
    process.env.JWT_SECRET,
    { 
      expiresIn: process.env.JWT_EXPIRE_ADMIN,
      issuer: 'chumban-cafe'
    }
  );
};

// Admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }
    
    // Find admin by email
    const admin = await Admin.findOne({ email });
    
    // Check if admin exists and password is correct
    if (!admin || !await admin.comparePassword(password)) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Check if admin account is active
    if (!admin.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }
    
    // Generate token
    const token = generateToken(admin._id);
    
    // Send response
    res.json({
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error during login' });
  }
};

// Create default admin (for initial setup)
const createDefaultAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    
    if (!existingAdmin) {
      const admin = new Admin({
        email: process.env.ADMIN_EMAIL,
        password: 'admin123', // Default password, should be changed on first login
        role: 'super_admin',
        isActive: true
      });
      
      await admin.save();
      console.log('Default admin created successfully');
    } else {
      console.log('Admin already exists');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
};

module.exports = {
  adminLogin,
  createDefaultAdmin
};
import { Router } from 'express';
import { sign } from 'jsonwebtoken';
import { UserModel } from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = await UserModel.validatePassword(username, password);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET || 'your_jwt_secret'
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, first_name, last_name, phone } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    // Check if user already exists
    const existingUser = await UserModel.findByUsername(username);
    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    const existingEmail = await UserModel.findByEmail(email);
    if (existingEmail) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    const newUser = await UserModel.create({
      username,
      email,
      password,
      firstName: first_name,
      lastName: last_name,
      phone
    });

    const token = sign(
      { userId: newUser.id, username: newUser.username },
      process.env.JWT_SECRET || 'your_jwt_secret'
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = (req as any).user;
    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const user = (req as any).user;
    const { first_name, last_name, email, phone } = req.body;

    const updatedUser = await UserModel.update(user.id, {
      firstName: first_name,
      lastName: last_name,
      email,
      phone
    });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        phone: updatedUser.phone,
        updated_at: updatedUser.updated_at
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
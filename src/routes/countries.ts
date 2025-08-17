import { Router } from 'express';
import { CountryModel } from '../models/Country.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

// Get all countries (basic info only)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const countries = await CountryModel.findAll();
    res.json({
      success: true,
      countries
    });
  } catch (error) {
    console.error('Countries fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get country details by name (including all related data)
router.get('/:name', optionalAuth, async (req, res) => {
  try {
    const { name } = req.params;
    const country = await CountryModel.findByName(decodeURIComponent(name));
    
    if (!country) {
      return res.status(404).json({ error: 'Country not found' });
    }
    
    res.json({
      success: true,
      country
    });
  } catch (error) {
    console.error('Country details fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get country by ID (basic info only)
router.get('/id/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const country = await CountryModel.findById(parseInt(id));
    
    if (!country) {
      return res.status(404).json({ error: 'Country not found' });
    }
    
    res.json({
      success: true,
      country
    });
  } catch (error) {
    console.error('Country fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
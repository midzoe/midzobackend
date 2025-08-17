import express from 'express';
import { UniversityModel, UniversityFilters } from '../models/University.js';

const router = express.Router();

// GET /api/universities - Get all universities with optional filters
router.get('/', async (req, res) => {
  try {
    const filters: UniversityFilters = {
      country: req.query.country as string,
      city: req.query.city as string,
      programName: req.query.program as string,
      programLevel: req.query.level as string,
      search: req.query.search as string
    };

    // Remove undefined filters
    Object.keys(filters).forEach(key => {
      if (filters[key as keyof UniversityFilters] === undefined) {
        delete filters[key as keyof UniversityFilters];
      }
    });

    const universities = await UniversityModel.findAll(filters);

    res.json({
      success: true,
      data: universities,
      count: universities.length
    });
  } catch (error) {
    console.error('Error fetching universities:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch universities'
    });
  }
});

// GET /api/universities/search - Advanced search with multiple filters
router.get('/search', async (req, res) => {
  try {
    const {
      country,
      city,
      program,
      level,
      search,
      limit = '50',
      offset = '0'
    } = req.query;

    const filters: UniversityFilters = {
      country: country as string,
      city: city as string,
      programName: program as string,
      programLevel: level as string,
      search: search as string
    };

    // Remove undefined filters
    Object.keys(filters).forEach(key => {
      if (filters[key as keyof UniversityFilters] === undefined) {
        delete filters[key as keyof UniversityFilters];
      }
    });

    const universities = await UniversityModel.findAll(filters);

    // Apply pagination
    const limitNum = parseInt(limit as string);
    const offsetNum = parseInt(offset as string);
    const paginatedResults = universities.slice(offsetNum, offsetNum + limitNum);

    res.json({
      success: true,
      data: paginatedResults,
      pagination: {
        total: universities.length,
        limit: limitNum,
        offset: offsetNum,
        hasMore: offsetNum + limitNum < universities.length
      }
    });
  } catch (error) {
    console.error('Error searching universities:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search universities'
    });
  }
});

// GET /api/universities/countries - Get all available countries
router.get('/countries', async (req, res) => {
  try {
    const countries = await UniversityModel.getCountries();

    res.json({
      success: true,
      data: countries
    });
  } catch (error) {
    console.error('Error fetching countries:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch countries'
    });
  }
});

// GET /api/universities/cities/:country - Get cities for a specific country
router.get('/cities/:country', async (req, res) => {
  try {
    const { country } = req.params;
    const cities = await UniversityModel.getCitiesByCountry(country);

    res.json({
      success: true,
      data: cities
    });
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cities'
    });
  }
});

// GET /api/universities/programs - Get all available programs
router.get('/programs', async (req, res) => {
  try {
    const programs = await UniversityModel.getPrograms();

    // Group programs by name for better frontend handling
    const groupedPrograms = programs.reduce((acc, program) => {
      if (!acc[program.name]) {
        acc[program.name] = [];
      }
      if (!acc[program.name].includes(program.level)) {
        acc[program.name].push(program.level);
      }
      return acc;
    }, {} as Record<string, string[]>);

    res.json({
      success: true,
      data: {
        raw: programs,
        grouped: groupedPrograms,
        programNames: Object.keys(groupedPrograms).sort(),
        levels: [...new Set(programs.map(p => p.level))].sort()
      }
    });
  } catch (error) {
    console.error('Error fetching programs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch programs'
    });
  }
});

// GET /api/universities/:id - Get university by ID
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid university ID'
      });
    }

    const university = await UniversityModel.findById(id);

    if (!university) {
      return res.status(404).json({
        success: false,
        error: 'University not found'
      });
    }

    res.json({
      success: true,
      data: university
    });
  } catch (error) {
    console.error('Error fetching university:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch university'
    });
  }
});

// POST /api/universities - Create new university (admin only)
router.post('/', async (req, res) => {
  try {
    const { name, city, country, website, applicationUrl, specialty } = req.body;

    if (!name || !city || !country) {
      return res.status(400).json({
        success: false,
        error: 'Name, city, and country are required'
      });
    }

    const university = await UniversityModel.create({
      name,
      city,
      country,
      website,
      applicationUrl,
      specialty
    });

    res.status(201).json({
      success: true,
      data: university
    });
  } catch (error) {
    console.error('Error creating university:', error);
    
    if (error instanceof Error && error.message.includes('already exists')) {
      return res.status(409).json({
        success: false,
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to create university'
    });
  }
});

// POST /api/universities/:id/programs - Add program to university
router.post('/:id/programs', async (req, res) => {
  try {
    const universityId = parseInt(req.params.id);
    const { name, level } = req.body;

    if (isNaN(universityId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid university ID'
      });
    }

    if (!name || !level) {
      return res.status(400).json({
        success: false,
        error: 'Program name and level are required'
      });
    }

    // Check if university exists
    const university = await UniversityModel.findById(universityId);
    if (!university) {
      return res.status(404).json({
        success: false,
        error: 'University not found'
      });
    }

    const program = await UniversityModel.addProgram(universityId, { name, level });

    res.status(201).json({
      success: true,
      data: program
    });
  } catch (error) {
    console.error('Error adding program:', error);
    
    if (error instanceof Error && error.message.includes('already exists')) {
      return res.status(409).json({
        success: false,
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to add program'
    });
  }
});

// PUT /api/universities/:id - Update university
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid university ID'
      });
    }

    const { name, city, country, website, applicationUrl, specialty } = req.body;
    
    const updates: any = {};
    if (name !== undefined) updates.name = name;
    if (city !== undefined) updates.city = city;
    if (country !== undefined) updates.country = country;
    if (website !== undefined) updates.website = website;
    if (applicationUrl !== undefined) updates.applicationUrl = applicationUrl;
    if (specialty !== undefined) updates.specialty = specialty;

    const university = await UniversityModel.update(id, updates);

    if (!university) {
      return res.status(404).json({
        success: false,
        error: 'University not found'
      });
    }

    res.json({
      success: true,
      data: university
    });
  } catch (error) {
    console.error('Error updating university:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update university'
    });
  }
});

// DELETE /api/universities/:id - Delete university
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid university ID'
      });
    }

    const deleted = await UniversityModel.delete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'University not found'
      });
    }

    res.json({
      success: true,
      message: 'University deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting university:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete university'
    });
  }
});

export default router;
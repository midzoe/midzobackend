import { Router } from 'express';
import { CategoryModel } from '../models/Category.js';
import { optionalAuth } from '../middleware/auth.js';
const router = Router();
// Get all categories
router.get('/', optionalAuth, async (req, res) => {
    try {
        const categories = await CategoryModel.findAll();
        res.json({
            success: true,
            categories
        });
    }
    catch (error) {
        console.error('Categories fetch error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Get category by ID
router.get('/:id', optionalAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const category = await CategoryModel.findById(id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json({
            success: true,
            category
        });
    }
    catch (error) {
        console.error('Category fetch error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Get services by category
router.get('/:id/services', optionalAuth, async (req, res) => {
    try {
        const { id } = req.params;
        // Check if category exists
        const category = await CategoryModel.findById(id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        const services = await CategoryModel.findServicesbyCategory(id);
        res.json({
            success: true,
            category,
            services
        });
    }
    catch (error) {
        console.error('Services fetch error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Get all services (across all categories)
router.get('/services/all', optionalAuth, async (req, res) => {
    try {
        const services = await CategoryModel.findAllServices();
        // Group services by category for easier frontend consumption
        const servicesByCategory = services.reduce((acc, service) => {
            if (!acc[service.category_id]) {
                acc[service.category_id] = [];
            }
            acc[service.category_id].push(service);
            return acc;
        }, {});
        res.json({
            success: true,
            services,
            servicesByCategory
        });
    }
    catch (error) {
        console.error('All services fetch error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
export default router;
//# sourceMappingURL=categories.js.map
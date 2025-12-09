//This file connects your URL paths to the functions that handle the logic.

// backend/src/routes/salesRoutes.js

import express from 'express';
import { getSales } from '../controllers/salesController.js';
import validateSalesQuery from '../middlewares/validateQuery.js';

const router = express.Router();

// The main route that handles ALL Search, Filter, Sort, and Pagination.
// The queries are passed in the URL (e.g., /api/sales?region=West&sort=date)

router.get('/', validateSalesQuery, getSales);

export default router;
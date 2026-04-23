const express = require('express');
const router = express.Router();
const {
  createGrievance,
  getGrievances,
  getGrievanceById,
  updateGrievance,
  deleteGrievance,
  searchGrievances,
} = require('../controllers/grievanceController');
const { protect } = require('../middleware/authMiddleware');

// Order matters: /search must come before /:id so it doesn't get treated as an ID
router.get('/search', protect, searchGrievances);

router.route('/')
  .post(protect, createGrievance)
  .get(protect, getGrievances);

router.route('/:id')
  .get(protect, getGrievanceById)
  .put(protect, updateGrievance)
  .delete(protect, deleteGrievance);

module.exports = router;

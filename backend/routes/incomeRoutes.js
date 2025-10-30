const express = require('express');
const router = express.Router();
const {
  getIncome,
  getIncomeById,
  addIncome,
  updateIncome,
  deleteIncome,
  getIncomeStats,
} = require('../controllers/incomeController');
const { protect } = require('../middleware/auth');

router.route('/').get(protect, getIncome).post(protect, addIncome);
router.route('/stats/summary').get(protect, getIncomeStats);
router
  .route('/:id')
  .get(protect, getIncomeById)
  .put(protect, updateIncome)
  .delete(protect, deleteIncome);

module.exports = router;


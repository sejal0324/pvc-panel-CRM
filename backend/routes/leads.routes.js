const express = require('express');
const { authenticate } = require('../middleware/auth.middleware');
const leadController = require('../controllers/leads.controller');

const router = express.Router();

router.post('/', authenticate, leadController.createLead);
router.get('/', authenticate, leadController.getLeads);
router.get('/:id', authenticate, leadController.getLeadById);
router.patch('/:id/approve', authenticate, leadController.approveLead);
router.patch('/:id/reject', authenticate, leadController.rejectLead);
router.post('/discover',authenticate,leadController.discoverLead)

module.exports = router;

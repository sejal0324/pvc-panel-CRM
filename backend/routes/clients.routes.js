const clientController = require('../controllers/clients.controller');
const express = require('express');
const { authenticate } = require('../middleware/auth.middleware');
const router = express.Router();

router.post('/', authenticate, clientController.createClient);
router.get('/', authenticate, clientController.getClient);
router.get('/:id', authenticate, clientController.getClientById);
router.put('/:id', authenticate, clientController.updateClient);
router.delete('/:id',authenticate,clientController.deleteClient);
router.post("/:id/visit",authenticate,clientController.scheduleVisit);
router.post("/:id/followup",authenticate,clientController.scheduleFollowUp);

module.exports = router;
const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');

const { upload } = require('../middleware/uploadMiddleware');

router.get('/', teamController.getTeam);
router.post('/', upload.single('image'), teamController.addMember);
router.put('/:id', upload.single('image'), teamController.updateMember); 
router.delete('/:id', teamController.deleteMember);

module.exports = router;
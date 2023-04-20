const router = require('express').Router();
const programmingController = require('../controllers/programming-controller');

router.post('/createIndex', programmingController.createIndex);
router.get('/checkIndex', programmingController.checkIndex);
router.delete('/deleteIndex', programmingController.deleteIndex);
router.delete('/delete/:id', programmingController.remove);
router.post('/create', programmingController.create);
router.get('/search', programmingController.search);

module.exports = router;
const router = require('express').Router();
const programmingRouter = require('./programming-router');

router.use("/programming", programmingRouter);

module.exports = router;
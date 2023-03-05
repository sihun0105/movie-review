const express = require('express');
const router = express.Router();

router.get('/', async (req, res, next) => {
    return res.status(200).json({result : 1});
});

module.exports = router;